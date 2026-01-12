import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MiscState {
  isMobile: boolean;
  isSearchOpen: boolean;
  isFileMenuOpen: boolean;
  uploadingLoader: boolean;
}

const initialState: MiscState = {
  isMobile: true,
  isSearchOpen: false,
  isFileMenuOpen: false,
  uploadingLoader: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setIsSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    setIsFileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isFileMenuOpen = action.payload;
    },
    setUploadingLoader: (state, action: PayloadAction<boolean>) => {
      state.uploadingLoader = action.payload;
    },
  },
});

export const {
  setIsMobile,
  setIsSearchOpen,
  setIsFileMenuOpen,
  setUploadingLoader,
} = miscSlice.actions;

export default miscSlice.reducer;
