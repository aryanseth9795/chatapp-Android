import { User } from "./user";

export interface Message {
  _id: string;
  sender: User;
  content: string;
  attachments?: Attachment[];
  chat: string;
  createdAt: string;
}

export interface Attachment {
  public_id: string;
  url: string;
}

export interface Chat {
  _id: string;
  name: string;
  groupChat: boolean;
  creator: User;
  members: User[];
  avatar?: string;
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
}

export interface ChatListItem {
  _id: string;
  name: string;
  avatar?: string;
  groupChat: boolean;
  members: User[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface NewMessageData {
  chatId: string;
  message: Message;
}

export interface TypingUser {
  _id: string;
  name: string;
}
