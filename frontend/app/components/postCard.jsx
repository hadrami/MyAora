import React from "react";
import { View, Text, Image } from "react-native";
import { convertTimestampToDate } from "../hooks/timestampReader";

const PostCard = ({ post }) => {
  console.log("Post in the Card: ", post);
  const postDate = convertTimestampToDate(post.createdAt);
  return (
    <View className="bg-white p-4 shadow rounded-lg mb-4">
      <Image
        source={{ uri: post.images[0] }}
        className="w-full h-40 rounded-lg mb-4"
      />
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold">{post.title}</Text>
        <Text className="text-gray-500">{postDate}</Text>
      </View>
      <Text className="text-gray-600">{post.status}</Text>
    </View>
  );
};

export default PostCard;
