import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isMobile: false,
  isSearch:false,
  isNotification:false,
  isFileMenu:false,
  isFileLoading:false,
  isNewGroup:false,
  isInfo:false
};

const MiscSlice = createSlice({
  name: "Misc",
  initialState,
  reducers: {
    setIsMenu: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsFileLoading: (state, action) => {
      state.isFileLoading = action.payload;
    },
    setIsFileLoading: (state, action) => {
      state.isFileLoading = action.payload;
    },   
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsInfo: (state, action) => {
      state.isInfo = action.payload;
    },
  },
});
export const { setIsMenu ,setIsSearch,setIsNotification,setIsFileMenu, setIsFileLoading,setIsNewGroup,setIsInfo} = MiscSlice.actions;
export default MiscSlice;
