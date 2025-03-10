import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import MiscSlice from "./slices/MiscSlice";

import ChatSlice from "./slices/ChatSlice";
import { apiSlice } from "./api/api";

const Store = configureStore({
  reducer: {
    [AuthSlice.name]: AuthSlice.reducer,
    [MiscSlice.name]: MiscSlice.reducer,
    [ChatSlice.name]: ChatSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (mid) => [...mid(), apiSlice.middleware],
  devTools: true,
});

export default Store;
