import axios from "axios";
import { APP_API_URL } from "@env";

// Function to fetch all posts
export const fetchAllPosts = async () => {
  const response = await axios.get(`${APP_API_URL}/posts/getPosts`);
  return response.data;
};

// Function to create a new post
export const createNewPost = async (postData) => {
  const formData = new FormData();
  formData.append("Id", postData.Id);
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  formData.append("category", postData.category);
  formData.append("location", postData.location);
  formData.append("status", postData.status);
  formData.append("price", postData.price);
  formData.append("userId", postData.userId);

  postData.images.forEach((image, index) => {
    formData.append("images", {
      uri: image,
      name: `image_${index}.jpg`,
      type: "image/jpeg",
    });
  });

  const response = await axios.post(
    `${APP_API_URL}/posts/createPost`,
    formData
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

export const searchPosts = async (query) => {
  const response = await axios.get(`${APP_API_URL}/posts/search/query`, {
    params: { query },
  });
  return response.data;
};

// Update a post
export const updatePost = async (postId, updatedData) => {
  const response = await axios.put(
    `${process.env.APP_API_URL}/posts/update/${postId}`,
    updatedData
  );
  console.log("The response in the Service:", response.data);

  return response.data;
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await axios.delete(`${APP_API_URL}/posts/delete/${postId}`);
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data || "Failed to delete post.");
  }
};
