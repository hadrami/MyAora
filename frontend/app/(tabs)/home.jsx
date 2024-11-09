import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { getAllPosts } from "../redux/slices/postSlice";
import PostCard from "../components/PostCard";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Access the state
  const { allPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    // Fetch posts on component mount
    dispatch(getAllPosts());
  }, [dispatch]);

  // Debug logs to inspect state changes
  console.log("***** All posts ****:", allPosts);
  console.log("Loading state:", loading);

  // Show loading indicator while fetching
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Ensure allPosts is an array
  if (!Array.isArray(allPosts)) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Data format issue detected</Text>
      </View>
    );
  }

  // Render posts or a message if no posts are available
  return (
    <ScrollView className="p-4">
      {allPosts.length > 0 ? (
        allPosts.map((post) => (
          <TouchableOpacity
            key={post.Id}
            onPress={() =>
              router.push({
                pathname: "/postDetails",
                params: { postId: post.Id },
              })
            }
          >
            <PostCard post={post} />
          </TouchableOpacity>
        ))
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No posts available</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Home;
