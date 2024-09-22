import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Adjust the path as necessary
import postsReducer from "./slices/postSlice"; // Adjust the path as necessary

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});

export default store;
