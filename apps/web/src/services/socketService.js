class SocketService {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.onMessageCallback = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(roomId, onMessage, onConnect) {
    this.onMessageCallback = onMessage;
    this.onConnectCallback = onConnect;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) && this.roomId === roomId) {
      console.log("Using existing socket connection");
      if (this.socket.readyState === WebSocket.OPEN && onConnect) {
        onConnect();
      }
      return;
    }

    this.roomId = roomId;

    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem(`token_${roomId}`);
      const wsUrl = baseUrl.replace(/^http/, "ws") + `/ws/${roomId}${token ? `?token=${token}` : ""}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onmessage = (event) => {  
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) this.onMessageCallback(data);
        } catch (error) {
          console.error("Failed to parse socket message:", error);
        }
      };

      this.socket.onopen = () => {
        console.log(`Connected to room: ${roomId}`);
        this.reconnectAttempts = 0;
        if (this.onConnectCallback) this.onConnectCallback();
      };

      this.socket.onclose = (event) => {
        console.log("Disconnected from socket:", event.code, event.reason);

        // Handle invalid room or unauthorized access
        if (event.code === 1008) {
          alert("Room does not exist or session is invalid.");
          window.location.href = "/";
          return;
        }

        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(this.roomId, this.onMessageCallback, this.onConnectCallback), 2000);
        }
      };

      this.socket.onerror = (error) => {
        console.error("Socket error:", error);
      };
    } catch (e) {
      console.error("Connection error:", e);
    }
  }

  sendMessage(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    }
  }

  disconnect() {
    this.onMessageCallback = null;
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
      this.socket = null;
    }
  }
}

export default new SocketService();
