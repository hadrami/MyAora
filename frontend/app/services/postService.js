import axios from "axios";
import { APP_API_URL } from "@env";

export const getAllPosts = async () => {
  const response = await axios.get(`${APP_API_URL}/posts`);
  return response.data;
};
export const createNewPost = async (postData) => {
  const response = await axios.post(
    `${APP_API_URL}/posts/createPost`,
    postData
  );
  return response.data;
};
