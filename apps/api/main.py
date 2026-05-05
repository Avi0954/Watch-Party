from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, constr
from jose import JWTError, jwt
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import json
import uuid
import logging
import time
import os
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Environment Variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY must be set")
ALGORITHM = "HS256"


# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

# --- CORS SETUP ---
origins_env = os.getenv("ALLOWED_ORIGINS")
if not origins_env:
    raise ValueError("ALLOWED_ORIGINS must be set")

# Safety: trim whitespace, remove quotes, and remove trailing slashes
ALLOWED_ORIGINS = [
    origin.strip().replace('"', '').replace("'", "").rstrip("/")
    for origin in origins_env.split(",")
    if origin.strip()
]
print("CORS ORIGINS:", ALLOWED_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END CORS SETUP ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JWT Auth
def create_access_token(data: dict):
    to_encode = data.copy()
    now = datetime.utcnow()
    to_encode["nbf"] = now
    to_encode["exp"] = now + timedelta(hours=2)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(lambda r: r.query_params.get("token"))):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")
    try:
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            options={"require": ["exp", "nbf"]},
            leeway=5
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Models
class RoomCreate(BaseModel):
    name: constr(max_length=50) | None = None

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )

class ConnectionManager:
    def __init__(self):
        # room_id -> list of active WebSockets (for broadcasting)
        self.active_connections: dict[str, list[WebSocket]] = {}
        # room_id -> user_id (current host)
        self.room_hosts: dict[str, str] = {}
        # room_id -> { user_id -> { "websocket": WebSocket, "name": str, "avatar": str } }
        self.room_users: dict[str, dict[str, dict]] = {}
        # websocket -> (room_id, user_id) - for quick lookup on disconnect
        self.ws_to_user: dict[WebSocket, tuple[str, str]] = {}
        # room_id -> {url, isPlaying, baseTime, startTimestamp}
        self.room_states: dict[str, dict] = {}
        # room_id -> list of messages
        self.room_messages: dict[str, list[dict]] = {}
        self.host_disconnect_tasks: dict[str, asyncio.Task] = {}
        self.hosts: dict[str, WebSocket] = {}
        self.valid_rooms: set[str] = set()
        self.history_file = "chat_history.json"
        self.load_history()

    def load_history(self):
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, "r") as f:
                    self.room_messages = json.load(f)
                logger.info(f"Loaded chat history for {len(self.room_messages)} rooms")
            except Exception as e:
                logger.error(f"Error loading history: {e}")
                self.room_messages = {}

    def save_history(self):
        try:
            with open(self.history_file, "w") as f:
                json.dump(self.room_messages, f)
        except Exception as e:
            logger.error(f"Error saving history: {e}")

    async def connect(self, websocket: WebSocket, room_id: str):
        # Enforce single active host
        if getattr(websocket, "role", None) == "host" and room_id not in self.hosts:
            self.hosts[room_id] = websocket

        self.active_connections[room_id].append(websocket)
        logger.info(f"Client socket connected to room: {room_id}")

    async def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
        
        # Clear host if host disconnects
        if self.hosts.get(room_id) == websocket:
            del self.hosts[room_id]
        
        # Check if we have user mapping for this socket
        if websocket in self.ws_to_user:
            r_id, u_id = self.ws_to_user.pop(websocket)
            
            # Only process if this is still the active socket for that user
            if r_id == room_id and r_id in self.room_users and u_id in self.room_users[r_id]:
                user_info = self.room_users[r_id][u_id]
                if user_info.get("websocket") == websocket:
                    username = user_info.get("name", "Someone")
                    is_host = self.room_hosts.get(r_id) == u_id
                    
                    if not is_host:
                        # For viewers, delete immediately
                        del self.room_users[r_id][u_id]
                        logger.info(f"User {username} ({u_id}) left room {r_id}")
                        await self.broadcast({"type": "CHAT", "name": "System", "message": f"{username} left the room"}, r_id)
                        await self.broadcast_users(r_id)
                    else:
                        # For host, we keep them temporarily
                        user_info["temporarily_disconnected"] = True
                        logger.info(f"Host {username} ({u_id}) disconnected temporarily from room {r_id}")
                        
                        # Check if any active users remain
                        active_users = [k for k, v in self.room_users.get(r_id, {}).items() if not v.get("temporarily_disconnected")]
                        if len(active_users) == 0:
                            # Auto end room
                            self.room_hosts.pop(r_id, None)
                            self.room_states.pop(r_id, None)
                            self.room_users.pop(r_id, None)
                            self.valid_rooms.discard(r_id)
                            logger.info(f"Room {r_id} purged: host left and no viewers remain.")
                        else:
                            # Start timeout task to reassign host
                            loop = asyncio.get_running_loop()
                            task = loop.create_task(self.schedule_host_reassign(r_id, u_id))
                            self.host_disconnect_tasks[r_id] = task

        # Global Empty Room Cleanup (Safe)
        if room_id in self.active_connections and not self.active_connections[room_id]:
            self.active_connections.pop(room_id, None)
            self.room_users.pop(room_id, None)
            self.room_states.pop(room_id, None)
            self.hosts.pop(room_id, None)
            self.room_hosts.pop(room_id, None)
            self.valid_rooms.discard(room_id)
            logger.info(f"Room {room_id} fully cleaned up from memory.")

    async def schedule_host_reassign(self, room_id: str, old_host_id: str):
        await asyncio.sleep(10)
        # Check if old_host is still marked as temporarily disconnected
        if room_id in self.room_users and old_host_id in self.room_users[room_id]:
            user_info = self.room_users[room_id][old_host_id]
            if user_info.get("temporarily_disconnected"):
                username = user_info.get("name")
                del self.room_users[room_id][old_host_id]
                await self.broadcast({"type": "CHAT", "name": "System", "message": f"{username} left the room"}, room_id)
                
                # Assign new host deterministically
                active_users = [k for k, v in self.room_users[room_id].items() if not v.get("temporarily_disconnected")]
                if active_users:
                    # Sort by joinTime
                    active_users.sort(key=lambda k: self.room_users[room_id][k].get("joinTime", 0))
                    new_host_id = active_users[0]
                    self.room_hosts[room_id] = new_host_id
                    
                    await self.broadcast({
                        "type": "host_changed",
                        "new_host": new_host_id
                    }, room_id)
                    
                    new_host_ws = self.room_users[room_id][new_host_id]["websocket"]
                    if new_host_ws in self.active_connections.get(room_id, []):
                        self.hosts[room_id] = new_host_ws
                        new_host_ws.role = "host"
                        
                        # Notify all users of host change
                        for ws in self.active_connections.get(room_id, []):
                            try:
                                await ws.send_json({
                                    "type": "HOST_CHANGED",
                                    "hostId": new_host_id
                                })
                            except:
                                pass

                        try:
                            await new_host_ws.send_json({"type": "ROLE", "role": "HOST"})
                        except: pass
                else:
                    if room_id in self.room_hosts: del self.room_hosts[room_id]
                    if room_id in self.room_states: del self.room_states[room_id]
                    del self.room_users[room_id]
                
                await self.broadcast_users(room_id)
        
        if room_id in self.host_disconnect_tasks:
            del self.host_disconnect_tasks[room_id]

        if room_id in self.active_connections and not self.active_connections[room_id]:
            self.active_connections.pop(room_id, None)
            self.room_users.pop(room_id, None)
        
        logger.info(f"Socket disconnected from room: {room_id}")

    def is_host(self, websocket: WebSocket, room_id: str) -> bool:
        return self.hosts.get(room_id) == websocket

    async def broadcast_users(self, room_id: str):
        if room_id in self.room_users:
            users = []
            host_id = self.room_hosts.get(room_id)
            for u_id, info in self.room_users[room_id].items():
                users.append({
                    "id": u_id,
                    "name": info["name"],
                    "avatar": info.get("avatar", "bg-indigo-600"),
                    "isHost": u_id == host_id
                })
            count = len(self.active_connections.get(room_id, []))
            logger.info(f"Broadcasting user list to {count} connections in room {room_id}")
            await self.broadcast({"type": "USER_LIST", "users": users}, room_id)

    async def broadcast(self, message: dict, room_id: str, exclude: WebSocket = None):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != exclude:
                    try:
                        await connection.send_json(message)
                    except Exception as e: 
                        logger.error(f"Broadcast error to connection: {e}")
                        pass

# Single global instance of ConnectionManager
manager = ConnectionManager()


@app.get("/")
@limiter.limit("5/minute")
async def health_check(request: Request):
    return {"status": "ok"}

@app.post("/create-room")
@limiter.limit("10/minute")
async def create_room(request: Request, room_data: RoomCreate = None):
    logger.info(f"CREATE_ROOM: Using manager instance {id(manager)}")
    room_id = str(uuid.uuid4())[:8]
    manager.valid_rooms.add(room_id)
    
    # Explicitly initialize room state
    manager.active_connections[room_id] = []
    manager.room_users[room_id] = {}
    manager.room_messages[room_id] = []
    manager.room_states[room_id] = {
        "url": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        "isPlaying": False,
        "baseTime": 0,
        "startTimestamp": int(time.time() * 1000)
    }
    
    token = create_access_token({"sub": room_id, "role": "host"})
    return {"room_id": room_id, "token": token}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str = None):
    logger.info(f"WS_CONNECT: Attempting to connect to room {room_id} using manager {id(manager)}")
    await websocket.accept()
    
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return
    try:
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            options={"require": ["exp", "nbf"]},
            leeway=5
        )
        if payload.get("sub") != room_id:
            await websocket.close(code=1008)
            return
        websocket.role = payload.get("role", "viewer")
    except JWTError:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, room_id)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                
                # Production-grade WebSocket Spam Protection
                now = time.time()
                if not hasattr(websocket, "msg_window"):
                    websocket.msg_window = {"start": now, "count": 0}
                window = websocket.msg_window
                if now - window["start"] > 10:
                    window["start"] = now
                    window["count"] = 0
                window["count"] += 1
                if window["count"] > 30:
                    logger.warning(f"Spam detected from socket in room {room_id}")
                    # await websocket.close(code=1008)
                    # return

                message = json.loads(data)
                m_type = message.get("type")
                logger.debug(f"Received message: {m_type} in room {room_id}")
                
                if m_type == "JOIN" or m_type == "join_room":
                    user_id = message.get("user_id", str(uuid.uuid4()))
                    username = message.get("name", "Anonymous")
                    avatar = message.get("avatar", "bg-indigo-600")
                    
                    is_reconnection = user_id in manager.room_users.get(room_id, {})
                    logger.info(f"User {username} joining room {room_id} (ID: {user_id}, Reconnect: {is_reconnection})")
                    
                    if is_reconnection:
                        # Cancel timeout task if it exists
                        if room_id in manager.host_disconnect_tasks:
                            manager.host_disconnect_tasks[room_id].cancel()
                            del manager.host_disconnect_tasks[room_id]
                        # Restore previous joinTime if available
                        joinTime = manager.room_users[room_id][user_id].get("joinTime", int(time.time() * 1000))
                    else:
                        joinTime = int(time.time() * 1000)

                    # Update or add user
                    manager.room_users[room_id][user_id] = {
                        "websocket": websocket,
                        "name": username,
                        "avatar": avatar,
                        "joinTime": joinTime,
                        "temporarily_disconnected": False
                    }
                    manager.ws_to_user[websocket] = (room_id, user_id)
                    
                    # Assign role if needed
                    current_host_id = manager.room_hosts.get(room_id)
                    if not current_host_id or current_host_id not in manager.room_users.get(room_id, {}):
                        manager.room_hosts[room_id] = user_id
                        logger.info(f"Assigned HOST role to user {username}")
                        await websocket.send_json({"type": "ROLE", "role": "HOST"})
                    elif current_host_id == user_id:
                        logger.info(f"User {username} rejoined as HOST")
                        await websocket.send_json({"type": "ROLE", "role": "HOST"})
                    else:
                        await websocket.send_json({"type": "ROLE", "role": "VIEWER"})

                    # Send current room state and chat history to the new user
                    await websocket.send_json({
                        "type": "SYNC_STATE",
                        "state": manager.room_states.get(room_id)
                    })
                    
                    await websocket.send_json({
                        "type": "CHAT_HISTORY",
                        "messages": manager.room_messages.get(room_id, [])
                    })
                    
                    if not is_reconnection:
                        await manager.broadcast({"type": "CHAT", "name": "System", "message": f"{username} joined the room"}, room_id)
                    
                    await manager.broadcast_users(room_id)
                
                elif m_type == "transfer_host":
                    if manager.is_host(websocket, room_id):
                        new_host_id = message.get("new_host")
                        
                        if new_host_id in manager.room_users.get(room_id, {}):
                            manager.room_hosts[room_id] = new_host_id
                            target_info = manager.room_users[room_id][new_host_id]
                            target_ws = target_info["websocket"]
                            target_name = target_info["name"]
                            
                            # 1. Update roles for old and new host
                            await websocket.send_json({"type": "ROLE", "role": "VIEWER"})
                            try:
                                await target_ws.send_json({"type": "ROLE", "role": "HOST"})
                            except: pass
                            
                            # 2. Broadcast host_changed event to everyone
                            await manager.broadcast({
                                "type": "host_changed",
                                "new_host": new_host_id
                            }, room_id)
                            
                            # 3. System message and user list refresh
                            await manager.broadcast({"type": "CHAT", "name": "System", "message": f"Host transferred to {target_name}"}, room_id)
                            await manager.broadcast_users(room_id)

                elif m_type == "end_room":
                    if manager.is_host(websocket, room_id):
                        logger.info(f"Host ended room {room_id}")
                        await manager.broadcast({"type": "end_room"}, room_id)
                        # The sockets will be closed by the clients or we can forcefully close them
                        if room_id in manager.room_hosts: del manager.room_hosts[room_id]
                        if room_id in manager.room_states: del manager.room_states[room_id]
                        if room_id in manager.room_users: del manager.room_users[room_id]
                
                elif m_type == "host_leaving":
                    if manager.is_host(websocket, room_id):
                        # Explicitly invoke temporary disconnect logic earlier
                        await manager.disconnect(websocket, room_id)

                elif m_type == "CHAT":
                    # Store message in history
                    if room_id in manager.room_messages:
                        manager.room_messages[room_id].append(message)
                        # Limit history size to 200 per room
                        if len(manager.room_messages[room_id]) > 200:
                            manager.room_messages[room_id].pop(0)
                        manager.save_history()
                    
                    await manager.broadcast(message, room_id, exclude=websocket)
                
                elif m_type == "REQUEST_SYNC":
                    if room_id in manager.room_states:
                        await websocket.send_json({
                            "type": "SYNC_STATE",
                            "state": manager.room_states[room_id]
                        })
                
                else:
                    # Host-only control messages that update state
                    if manager.is_host(websocket, room_id):
                        state = manager.room_states[room_id]
                        now = int(time.time() * 1000)
                        
                        if m_type == "PLAY":
                            state["isPlaying"] = True
                            state["baseTime"] = message.get("time", 0)
                            state["startTimestamp"] = now
                        elif m_type == "PAUSE":
                            state["isPlaying"] = False
                            state["baseTime"] = message.get("time", 0)
                            state["startTimestamp"] = now
                        elif m_type == "SEEK":
                            state["baseTime"] = message.get("time", 0)
                            state["startTimestamp"] = now
                        elif m_type == "VIDEO_CHANGE":
                            new_url = message.get("url")
                            logger.info(f"Video change in room {room_id} to {new_url}")
                            state["url"] = new_url
                            state["baseTime"] = 0
                            state["startTimestamp"] = now
                            state["isPlaying"] = True
                        elif m_type == "SYNC_STATE":
                            state["baseTime"] = message.get("time", 0)
                            if "isPlaying" in message:
                                state["isPlaying"] = message["isPlaying"]
                            state["startTimestamp"] = now
                            if "url" in message and message.get("url"):
                                state["url"] = message["url"]
                        
                        # Add server timestamp to outgoing control messages
                        message["timestamp"] = now
                        await manager.broadcast(message, room_id, exclude=websocket)
            except json.JSONDecodeError:
                continue
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_id)
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        await manager.disconnect(websocket, room_id)

@app.post("/chat")
@limiter.limit("20/minute")
async def chat_endpoint(request: Request):
    return {"status": "ok"}

@app.post("/join-room")
@limiter.limit("10/minute")
async def join_room_endpoint(request: Request):
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
