import axios from "axios";
// Set your backend API URL
const API_URL = "http://localhost:5000"; // Change this to the actual URL of your backend (e.g., deployed URL if hosted).
const homeip = "192.168.100.8";
const espip = "10.55.4.160";

export const getAllPosts = async () => {
  const response = await axios.get("http://192.168.100.8:5000/posts");
  return response.data;
};
