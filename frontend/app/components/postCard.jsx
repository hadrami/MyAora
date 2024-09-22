import React from "react";
import { View, Text } from "react-native";

const PostCard = ({ post }) => {
  return (
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
    >
      <Text>{post.title}</Text>
      <Text>By: {post.creatorName}</Text>
      <Text>Date: {post.creationDate}</Text>
      <Text>Status: {post.status}</Text>
    </View>
  );
};

export default PostCard;
