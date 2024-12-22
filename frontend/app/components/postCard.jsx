import React from "react";
import { View, Text, Image } from "react-native";
import { convertTimestampToDate } from "../hooks/timestampReader";
const PostCard = ({ post }) => {
  return (
    <View className="bg-white rounded-lg shadow p-4 mb-4">
      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          className="w-full h-40 rounded-lg mb-2"
          resizeMode="cover"
        />
      )}
      <Text className="text-lg font-bold text-gray-800">{post.title}</Text>
      <Text className="text-gray-600 mb-2">Category: {post.category}</Text>
      <Text className="text-gray-600 mb-2">Price: ${post.price}</Text>
      <Text className="text-gray-600">
        Date: {convertTimestampToDate(post.createdAt)}
      </Text>
    </View>
  );
};

export default PostCard;
