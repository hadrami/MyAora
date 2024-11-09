import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  createNewPost,
  fetchPostById,
} from "../../services/postService";

// Thunks for async actions
export const getAllPosts = createAsyncThunk("posts/getPosts", async () => {
  const response = await fetchAllPosts();
  return response.posts; // Ensure the response structure matches
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      const response = await createNewPost(postData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/post/id",
  async (postId, thunkAPI) => {
    try {
      const post = await fetchPostById(postId);
      return post;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice definition
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [], // Ensure this is initialized as an array
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.allPosts = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.allPosts.push(action.payload);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default postsSlice.reducer;
