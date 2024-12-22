import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import {
  signUpUser,
  signInUser,
  getUserInfo,
  fetchUserPosts,
  resetPassword,
  logoutService,
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
      const decodedToken = jwtDecode(token);
      const uid = decodedToken.uid; // Decode token to get user ID
      const user = await getUserInfo(uid); // Fetch user data
      // Fetch all posts after successful sign-in
      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    return { token: jwtDecode(token) };
  }
  return null;
});

export const getUserProfile = createAsyncThunk(
  "auth/users/userId",
  async (userId, thunkAPI) => {
    try {
      const response = await getUserProfile(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "auth/users/userId/posts",
  async (userId, thunkAPI) => {
    try {
      const posts = await fetchUserPosts(userId);
      return posts;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ phone, newPassword }, thunkAPI) => {
    try {
      const response = await resetPassword(phone, newPassword);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to reset password."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutService();
      AsyncStorage.removeItem("token"); // Clear local storage token
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
    setUser: (state, action) => {
      state.user = action.payload;
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
        state.posts = action.payload; // Store user posts
        state.loading = false;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.posts = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload; // Handle logout errors if needed
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
