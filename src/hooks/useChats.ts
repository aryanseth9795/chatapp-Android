import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { database } from "../services/database";
import { Chat, Message } from "../types/chat";

// Query keys
export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (filters: any) => [...chatKeys.lists(), { filters }] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  messages: (chatId: string) => [...chatKeys.all, "messages", chatId] as const,
};

// Fetch chats with cache-first strategy
export const useChats = () => {
  return useQuery({
    queryKey: chatKeys.lists(),
    queryFn: async () => {
      try {
        // Try to get from cache first
        const cachedChats = await database.getChats();

        // Fetch from API
        const response = await api.getMyChats();
        const serverChats: Chat[] = response.chats || [];

        // Update cache
        for (const chat of serverChats) {
          await database.saveChat({
            id: chat._id,
            name: chat.name,
            avatar: chat.avatar,
            isGroupChat: chat.groupChat,
            lastMessage: chat.lastMessage?.content,
            lastMessageTime: chat.lastMessage?.createdAt,
            unreadCount: chat.unreadCount || 0,
            members: JSON.stringify(chat.members),
          });
        }

        return serverChats;
      } catch (error) {
        // If API fails, return cached data
        console.error("Error fetching chats, using cache:", error);
        const cachedChats = await database.getChats();
        return cachedChats as any[];
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

// Fetch chat details
export const useChatDetails = (chatId: string) => {
  return useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: async () => {
      const response = await api.getChatDetails(chatId);
      return response.chat as Chat;
    },
    enabled: !!chatId,
  });
};

// Fetch messages with cache-first and pagination
export const useMessages = (chatId: string, page: number = 1) => {
  return useQuery({
    queryKey: [...chatKeys.messages(chatId), page],
    queryFn: async () => {
      try {
        // Get from cache first for instant display
        if (page === 1) {
          const cachedMessages = await database.getMessages(chatId, 50);

          // Fetch from API in background
          const response = await api.getMessages(chatId, page);
          const serverMessages: Message[] = response.messages || [];

          // Update cache
          await database.saveMessages(
            serverMessages.map((msg) => ({
              id: msg._id,
              chatId: chatId,
              senderId: msg.sender._id,
              content: msg.content,
              attachments: JSON.stringify(msg.attachments || []),
              createdAt: msg.createdAt,
              status: "delivered",
            }))
          );

          return serverMessages;
        } else {
          // For pagination, fetch from API
          const response = await api.getMessages(chatId, page);
          return response.messages as Message[];
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        const cachedMessages = await database.getMessages(chatId, 50);
        return cachedMessages as any[];
      }
    },
    enabled: !!chatId,
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
    }: {
      chatId: string;
      content: string;
    }) => {
      const response = await api.sendMessage(chatId, content);
      return response.message as Message;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};

// Send attachments mutation
export const useSendAttachments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.sendAttachments(formData);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
};

// Create group mutation
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; members: string[] }) => {
      const response = await api.createGroupChat(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};
