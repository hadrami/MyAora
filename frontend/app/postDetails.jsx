import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updatePost, deletePost } from "../app/redux/slices/postSlice";
import { convertTimestampToDate } from "../utils/dateUtils";
import { FontAwesome } from "@expo/vector-icons";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const post = posts.find((p) => p.Id === postId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    price: post?.price || "",
    category: post?.category || "",
    description: post?.description || "",
    location: post?.location || "",
    status: post?.status || "Available",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(updatePost({ postId, ...formData })).unwrap();
      Alert.alert("Success", "Post updated successfully.");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      Alert.alert("Error", "Failed to update the post.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deletePost(postId)).unwrap();
              Alert.alert("Success", "Post deleted successfully.");
              router.push("/profile"); // Redirect to profile
            } catch (error) {
              Alert.alert("Error", "Failed to delete the post.");
            }
          },
        },
      ]
    );
  };

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-100 p-4">
      <View className="bg-white shadow rounded-lg p-4">
        {/* Post Image */}
        {post.images && post.images.length > 0 && (
          <Image
            source={{ uri: post.images[0] }}
            className="w-full h-40 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}
        {/* Title */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.title}
            onChangeText={(value) => handleInputChange("title", value)}
          />
        ) : (
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {post.title}
          </Text>
        )}

        {/* Status */}
        <Text
          className={`text-sm font-semibold mb-4 ${
            formData.status === "Available" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formData.status}
        </Text>

        {/* Price */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.price}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("price", value)}
          />
        ) : (
          <Text className="text-gray-600 mb-2">Price: ${post.price}</Text>
        )}

        {/* Category */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.category}
            onChangeText={(value) => handleInputChange("category", value)}
          />
        ) : (
          <Text className="text-gray-600 mb-2">Category: {post.category}</Text>
        )}

        {/* Description */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
          />
        ) : (
          <Text className="text-gray-700 mb-4">{post.description}</Text>
        )}

        {/* Location */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.location}
            onChangeText={(value) => handleInputChange("location", value)}
          />
        ) : (
          <Text className="text-gray-600 mb-2">Location: {post.location}</Text>
        )}

        {/* Date */}
        <Text className="text-gray-600 mb-2">
          Date: {convertTimestampToDate(post.createdAt)}
        </Text>

        {/* User Contact */}
        <View className="flex-row items-center justify-start mt-4">
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${user.phone}`)}
            className="mr-4"
          >
            <FontAwesome name="phone" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://wa.me/${user.phone}`)}
          >
            <FontAwesome name="whatsapp" size={24} color="green" />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        {post.userId === user.Id && (
          <View className="flex-row justify-between mt-6">
            {isEditing ? (
              <>
                <TouchableOpacity
                  onPress={handleSaveChanges}
                  className="bg-green-500 py-2 px-4 rounded"
                >
                  <Text className="text-white text-center">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEditToggle}
                  className="bg-gray-400 py-2 px-4 rounded"
                >
                  <Text className="text-white text-center">Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleEditToggle}
                  className="bg-blue-500 py-2 px-4 rounded"
                >
                  <Text className="text-white text-center">Modify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-red-500 py-2 px-4 rounded"
                >
                  <Text className="text-white text-center">Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PostDetails;
