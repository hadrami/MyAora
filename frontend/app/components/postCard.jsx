import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ImageCarousel } from "./ImageCarousel"; // Handles multiple images
import { Avatar } from "./Avatar";

const PostCard = ({ post }) => {
  return (
    <TouchableOpacity className="bg-white rounded-lg shadow p-4 mb-4">
      <View className="flex-row items-center mb-2">
        <Avatar user={post.user} />
        <Text className="ml-2 text-lg font-bold">{post.user.username}</Text>
      </View>
      <ImageCarousel images={post.images} />
      <Text className="text-xl font-semibold mt-2">{post.title}</Text>
      <Text className="text-gray-500">
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      <Text className="text-sm text-green-600">{post.status}</Text>
    </TouchableOpacity>
  );
};

export default PostCard;
