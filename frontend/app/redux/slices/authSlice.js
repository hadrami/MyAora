import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import {
  signUpUser,
  signInUser,
  getUserInfo,
  fetchUserPosts,
} from "../../services/authService";

// Async actions using createAsyncThunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await signUpUser(
        userData.Id,
        userData.username,
        userData.phone,
        userData.password
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (userData, thunkAPI) => {
    try {
      const token = await signInUser(userData.phone, userData.password);
      await AsyncStorage.setItem("token", token);
      return { token, user: jwtDecode(token) };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    return { token, user: jwtDecode(token) };
  }
  return null;
});

export const getUserProfile = createAsyncThunk(
  "auth/getUserInfo",
  async (userId, thunkAPI) => {
    try {
      const response = await getUserInfo(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "auth/getUserPosts",
  async (userId, thunkAPI) => {
    try {
      const response = await fetchUserPosts(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// The actual slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    posts: [],
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup logic
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      })
      // Signin logic
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      // Fetch user info logic
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user info
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user posts logic
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // Store user posts
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
