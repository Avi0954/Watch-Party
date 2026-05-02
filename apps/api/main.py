from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import uuid
import logging
import time
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
            self.room_users[room_id] = {}
            self.room_states[room_id] = {
                "url": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                "isPlaying": False,
                "baseTime": 0,
                "startTimestamp": int(time.time() * 1000)
            }
        
        if room_id not in self.room_messages:
            self.room_messages[room_id] = []
            self.save_history()
        
        self.active_connections[room_id].append(websocket)
        logger.info(f"Client socket connected to room: {room_id}")

    async def disconnect(self, websocket: WebSocket, room_id: str):
        if websocket in self.active_connections.get(room_id, []):
            self.active_connections[room_id].remove(websocket)
        
        # Check if we have user mapping for this socket
        if websocket in self.ws_to_user:
            r_id, u_id = self.ws_to_user.pop(websocket)
            
            # Only remove from room_users if this is still the active socket for that user
            if r_id == room_id and r_id in self.room_users and u_id in self.room_users[r_id]:
                user_info = self.room_users[r_id][u_id]
                if user_info.get("websocket") == websocket:
                    username = user_info.get("name", "Someone")
                    del self.room_users[r_id][u_id]
                    
                    logger.info(f"User {username} ({u_id}) left room {r_id}")
                    await self.broadcast({"type": "CHAT", "name": "System", "message": f"{username} left the room"}, r_id)
                    
                    # Handle host transfer if needed
                    if self.room_hosts.get(r_id) == u_id:
                        active_users = list(self.room_users.get(r_id, {}).keys())
                        if active_users:
                            new_host_id = active_users[0]
                            self.room_hosts[r_id] = new_host_id
                            
                            # Notify everyone about the host change
                            await self.broadcast({
                                "type": "host_changed",
                                "new_host": new_host_id
                            }, r_id)
                            
                            # Specifically notify the new host about their role
                            new_host_ws = self.room_users[r_id][new_host_id]["websocket"]
                            try:
                                await new_host_ws.send_json({"type": "ROLE", "role": "HOST"})
                            except: pass
                        else:
                            if r_id in self.room_hosts: del self.room_hosts[r_id]
                            if r_id in self.room_states: del self.room_states[r_id]
                            # We no longer delete room_messages here to ensure persistence across sessions
                    
                    await self.broadcast_users(r_id)

        if room_id in self.active_connections and not self.active_connections[room_id]:
            del self.active_connections[room_id]
            if room_id in self.room_users: del self.room_users[room_id]
        
        logger.info(f"Socket disconnected from room: {room_id}")

    def is_host(self, websocket: WebSocket, room_id: str) -> bool:
        if websocket not in self.ws_to_user: return False
        _, user_id = self.ws_to_user[websocket]
        return self.room_hosts.get(room_id) == user_id

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

manager = ConnectionManager()

@app.get("/")
async def health_check():
    return {"status": "ok"}

@app.post("/create-room")
async def create_room():
    room_id = str(uuid.uuid4())[:8]
    return {"room_id": room_id}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                m_type = message.get("type")
                logger.debug(f"Received message: {m_type} in room {room_id}")
                
                if m_type == "JOIN":
                    user_id = message.get("user_id", str(uuid.uuid4()))
                    username = message.get("name", "Anonymous")
                    avatar = message.get("avatar", "bg-indigo-600")
                    
                    is_reconnection = user_id in manager.room_users.get(room_id, {})
                    logger.info(f"User {username} joining room {room_id} (ID: {user_id}, Reconnect: {is_reconnection})")
                    
                    # Update or add user
                    manager.room_users[room_id][user_id] = {
                        "websocket": websocket,
                        "name": username,
                        "avatar": avatar
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
