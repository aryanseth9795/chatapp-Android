import * as SQLite from "expo-sqlite";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  attachments?: string;
  createdAt: string;
  status: "sent" | "delivered" | "read" | "pending";
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  isGroupChat: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  members?: string;
}

export interface MediaFile {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  localPath: string;
  remoteUrl: string;
  size: number;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync("chatsapp.db");
      await this.createTables();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error("Database not initialized");

    // Create chats table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        isGroupChat INTEGER DEFAULT 0,
        lastMessage TEXT,
        lastMessageTime TEXT,
        unreadCount INTEGER DEFAULT 0,
        members TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chatId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        content TEXT,
        attachments TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (chatId) REFERENCES chats (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chatId ON messages(chatId);
      CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages(createdAt);
    `);

    // Create media_files table for cached attachments
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS media_files (
        id TEXT PRIMARY KEY,
        messageId TEXT NOT NULL,
        fileName TEXT NOT NULL,
        fileType TEXT NOT NULL,
        localPath TEXT NOT NULL,
        remoteUrl TEXT NOT NULL,
        size INTEGER,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (messageId) REFERENCES messages (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_media_messageId ON media_files(messageId);
    `);
  }

  // Chat operations
  async saveChat(chat: Chat) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `INSERT OR REPLACE INTO chats (id, name, avatar, isGroupChat, lastMessage, lastMessageTime, unreadCount, members)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chat.id,
        chat.name,
        chat.avatar || null,
        chat.isGroupChat ? 1 : 0,
        chat.lastMessage || null,
        chat.lastMessageTime || null,
        chat.unreadCount || 0,
        chat.members || null,
      ]
    );
  }

  async getChats(): Promise<Chat[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync<any>(
      "SELECT * FROM chats ORDER BY lastMessageTime DESC"
    );

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar,
      isGroupChat: row.isGroupChat === 1,
      lastMessage: row.lastMessage,
      lastMessageTime: row.lastMessageTime,
      unreadCount: row.unreadCount,
      members: row.members,
    }));
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync<any>(
      "SELECT * FROM chats WHERE id = ?",
      [chatId]
    );

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      avatar: result.avatar,
      isGroupChat: result.isGroupChat === 1,
      lastMessage: result.lastMessage,
      lastMessageTime: result.lastMessageTime,
      unreadCount: result.unreadCount,
      members: result.members,
    };
  }

  async updateChatUnreadCount(chatId: string, count: number) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("UPDATE chats SET unreadCount = ? WHERE id = ?", [
      count,
      chatId,
    ]);
  }

  // Message operations
  async saveMessage(message: Message) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `INSERT OR REPLACE INTO messages (id, chatId, senderId, content, attachments, createdAt, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        message.id,
        message.chatId,
        message.senderId,
        message.content,
        message.attachments || null,
        message.createdAt,
        message.status,
      ]
    );
  }

  async saveMessages(messages: Message[]) {
    if (!this.db) throw new Error("Database not initialized");

    for (const message of messages) {
      await this.saveMessage(message);
    }
  }

  async getMessages(
    chatId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync<any>(
      "SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [chatId, limit, offset]
    );

    return result.map((row) => ({
      id: row.id,
      chatId: row.chatId,
      senderId: row.senderId,
      content: row.content,
      attachments: row.attachments,
      createdAt: row.createdAt,
      status: row.status as "sent" | "delivered" | "read" | "pending",
    }));
  }

  async updateMessageStatus(messageId: string, status: Message["status"]) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("UPDATE messages SET status = ? WHERE id = ?", [
      status,
      messageId,
    ]);
  }

  // Media file operations
  async saveMediaFile(media: MediaFile) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `INSERT OR REPLACE INTO media_files (id, messageId, fileName, fileType, localPath, remoteUrl, size, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        media.id,
        media.messageId,
        media.fileName,
        media.fileType,
        media.localPath,
        media.remoteUrl,
        media.size,
        media.createdAt,
      ]
    );
  }

  async getMediaFile(messageId: string): Promise<MediaFile | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync<any>(
      "SELECT * FROM media_files WHERE messageId = ?",
      [messageId]
    );

    if (!result) return null;

    return {
      id: result.id,
      messageId: result.messageId,
      fileName: result.fileName,
      fileType: result.fileType,
      localPath: result.localPath,
      remoteUrl: result.remoteUrl,
      size: result.size,
      createdAt: result.createdAt,
    };
  }

  async clearAllData() {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      DELETE FROM media_files;
      DELETE FROM messages;
      DELETE FROM chats;
    `);
  }

  async clearChatData(chatId: string) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      DELETE FROM media_files WHERE messageId IN (SELECT id FROM messages WHERE chatId = '${chatId}');
      DELETE FROM messages WHERE chatId = '${chatId}';
      DELETE FROM chats WHERE id = '${chatId}';
    `);
  }
}

export const database = new DatabaseService();
export default database;
