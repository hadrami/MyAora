import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
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
    const response = await axios.post(`${APP_API_URL}/auth/checkPhone`, {
      phone,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error checking phone availability");
  }
};
export const signUpUser = async (Id, username, phone, password) => {
  try {
    // Axios post method automatically handles headers and JSON stringification
    const response = await axios.post(`${APP_API_URL}/auth/signup`, {
      Id,
      username,
      phone,
      password,
    });
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
    const token = response.data.token;
    // Store token in AsyncStorage
    await AsyncStorage.setItem("token", JSON.stringify(token));

    return token;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

export const loadStoredToken = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return { token, user: decodedToken.user };
  }
  return null;
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

export const resetPassword = async (phone, newPassword) => {
  try {
    const response = await axios.post(`${APP_API_URL}/auth/resetPassword`, {
      phone,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password." };
  }
};

export const logoutService = async () => {
  try {
    const response = await axios.post(`${APP_API_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};
