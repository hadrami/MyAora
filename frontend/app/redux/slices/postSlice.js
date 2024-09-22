import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllPosts } from "../../services/postService";

export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  const response = await fetchAllPosts();
  return response;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
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
        state.allPosts = action.payload;
        state.loading = false;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default postsSlice.reducer;
