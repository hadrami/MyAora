import axios from "axios";
import { APP_API_URL } from "@env";

// Set your backend API URL

// Send OTP to the user's phone
export const checkUsernameAv = async (username) => {
  try {
    const response = await axios.post(`${APP_API_URL}/auth/checkUsername`, {
      username,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error checking username availability");
  }
};

export const checkPhoneAv = async (phone) => {
  try {
    const response = await axios.post(`${APP_API_URL}/auth//checkPhone`, {
      phone,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error checking phone availability");
  }
};
export const signUpUser = async (username, phone, password) => {
  try {
    // Axios post method automatically handles headers and JSON stringification
    const response = await axios.post(`${APP_API_URL}/auth/signup`, {
      username,
      phone,
      password,
    });
    console.log("***axios response***:", response);
    // Axios will throw an error for non-2xx status codes, so no need for `response.ok`
    return response.data; // Axios automatically parses JSON response
  } catch (error) {
    // Axios errors are stored in error.response if the server responds with an error
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Failed to sign up");
    }
    throw new Error(error.message);
  }
};

export const signInUser = async (phone, password) => {
  try {
    const response = await axios.post(`${APP_API_URL}/auth/signin`, {
      phone,
      password,
    });
    return response.data.token; // Returns the JWT token
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};
export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${APP_API_URL}/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user profile");
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const response = await axios.get(
      `${APP_API_URL}/auth/users/${userId}/posts`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user posts");
  }
};
