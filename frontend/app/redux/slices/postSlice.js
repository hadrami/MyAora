import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllPosts, createNewPost } from "../../services/postService";

export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  const response = await fetchAllPosts();
  return response;
});
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      const response = await createNewPost(postData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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
      });
  },
});

export default postsSlice.reducer;
