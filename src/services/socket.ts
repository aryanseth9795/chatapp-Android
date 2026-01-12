import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { SERVER_URL, SOCKET_CONFIG } from "../constants/config";
import { database } from "./database";

export interface SocketMessage {
  chatId: string;
  message: any;
}

export interface TypingData {
  chatId: string;
  user: {
    _id: string;
    name: string;
  };
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  async connect() {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        console.log("No token found, skipping socket connection");
        return;
      }

      this.socket = io(SERVER_URL, {
        ...SOCKET_CONFIG,
        auth: { token },
      });

      this.setupDefaultListeners();
      console.log("Socket connection initiated");
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  }

  private setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Handle new messages
    this.socket.on("NEW_MESSAGE", async (data: SocketMessage) => {
      console.log("New message received:", data);

      // Cache message to SQLite
      try {
        await database.saveMessage({
          id: data.message._id,
          chatId: data.chatId,
          senderId: data.message.sender._id,
          content: data.message.content,
          attachments: JSON.stringify(data.message.attachments || []),
          createdAt: data.message.createdAt,
          status: "delivered",
        });
      } catch (error) {
        console.error("Error caching message:", error);
      }

      this.emit("NEW_MESSAGE", data);
    });

    // Handle message alerts (for chat list updates)
    this.socket.on("NEW_MESSAGE_ALERT", async (data: any) => {
      console.log("New message alert:", data);
      this.emit("NEW_MESSAGE_ALERT", data);
    });

    // Handle typing indicators
    this.socket.on("START_TYPING", (data: TypingData) => {
      this.emit("START_TYPING", data);
    });

    this.socket.on("STOP_TYPING", (data: TypingData) => {
      this.emit("STOP_TYPING", data);
    });

    // Handle online status
    this.socket.on("ONLINE_USERS", (data: string[]) => {
      this.emit("ONLINE_USERS", data);
    });

    // Handle refetch for chat list
    this.socket.on("REFETCH_CHATS", (data: any) => {
      this.emit("REFETCH_CHATS", data);
    });
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  // Emit to listeners
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  // Send events to server
  send(event: string, data: any) {
    if (!this.socket || !this.socket.connected) {
      console.warn("Socket not connected, cannot send event:", event);
      return;
    }
    this.socket.emit(event, data);
  }

  // Join chat room
  joinChat(chatId: string) {
    this.send("JOIN_CHAT", { chatId });
  }

  // Leave chat room
  leaveChat(chatId: string) {
    this.send("LEAVE_CHAT", { chatId });
  }

  // Send typing indicator
  startTyping(chatId: string) {
    this.send("START_TYPING", { chatId });
  }

  stopTyping(chatId: string) {
    this.send("STOP_TYPING", { chatId });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log("Socket disconnected manually");
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;
