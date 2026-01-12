import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import chatReducer from "./slices/ChatSlice";
import miscReducer from "./slices/MiscSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    misc: miscReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
