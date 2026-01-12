import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  notificationCount: number;
  isOnline: boolean;
  onlineUsers: string[];
  currentChatId: string | null;
  typingUsers: Record<string, string[]>; // chatId -> [userId]
}

const initialState: ChatState = {
  notificationCount: 0,
  isOnline: false,
  onlineUsers: [],
  currentChatId: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    decrementNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = Math.max(
        0,
        state.notificationCount - action.payload
      );
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setCurrentChatId: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    addTypingUser: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      if (!state.typingUsers[chatId].includes(userId)) {
        state.typingUsers[chatId].push(userId);
      }
    },
    removeTypingUser: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          (id) => id !== userId
        );
      }
    },
    clearTypingUsers: (state, action: PayloadAction<string>) => {
      delete state.typingUsers[action.payload];
    },
  },
});

export const {
  setNotificationCount,
  incrementNotificationCount,
  decrementNotificationCount,
  setOnlineStatus,
  setOnlineUsers,
  setCurrentChatId,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
