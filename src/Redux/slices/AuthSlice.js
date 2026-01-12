import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    userexist: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    userNotexist: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const {userexist,userNotexist}= AuthSlice.actions;
export default AuthSlice;
