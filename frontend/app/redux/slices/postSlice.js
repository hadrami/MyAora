import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
} from "../../services/postService";

// Fetch all posts
export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  return await fetchAllPosts();
});

// Fetch a single post by ID
export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId) => {
    return await fetchPostById(postId);
  }
);

// Create a new post
export const createNewPost = createAsyncThunk(
  "posts/createNewPost",
  async (postData) => {
    return await createPost(postData);
  }
);

// Update a post
export const updateExistingPost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }) => {
    return await updatePost(postId, updatedData);
  }
);

// Delete a post
export const removePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    return await deletePost(postId);
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload.posts;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts.push(action.payload);
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateExistingPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allPosts.findIndex(
          (post) => post.Id === action.payload.Id
        );
        if (index !== -1) {
          state.allPosts[index] = action.payload;
        }
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = state.allPosts.filter(
          (post) => post.Id !== action.payload
        );
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetCurrentPost } = postSlice.actions;
export default postSlice.reducer;
