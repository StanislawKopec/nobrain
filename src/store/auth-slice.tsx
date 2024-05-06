import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    loggedInUser: "",
    loggedInUserId: 0,
  },
  reducers: {
    login(state, action) {
      if(action.payload.username){
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loggedInUser", action.payload.username);
        sessionStorage.setItem("loggedInUserId", action.payload.userId);
        state.isLoggedIn = true;
        state.loggedInUser = action.payload.username;
        state.loggedInUserId = action.payload.userId;
      }
    },
    logout(state) {
      sessionStorage.setItem("isLoggedIn", "false");
      sessionStorage.setItem("loggedInUser", "");
      sessionStorage.setItem("loggedInUserId", "");
      state.isLoggedIn = false;
    },
    register(state, action) {
      console.log(state);
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;