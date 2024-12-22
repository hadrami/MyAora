import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import PostCard from "../components/postCard";

const Bookmark = () => {
  const { bookmarks } = useSelector((state) => state.posts);

  return (
    <ScrollView className="p-4">
      {bookmarks.length > 0 ? (
        bookmarks.map((post) => <PostCard key={post.Id} post={post} />)
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No bookmarked posts</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Bookmark;
