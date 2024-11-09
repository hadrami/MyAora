import axios from "axios";
import { APP_API_URL } from "@env";

// Function to fetch all posts
export const fetchAllPosts = async () => {
  const response = await axios.get(`${APP_API_URL}/posts/getPosts`);
  return response.data;
};

// Function to create a new post
export const createNewPost = async (postData) => {
  const response = await axios.post(
    `${APP_API_URL}/posts/createPost`,
    postData
  );
  return response.data;
};

// Function to fetch a post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await axios.get(`${APP_API_URL}/posts/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};
