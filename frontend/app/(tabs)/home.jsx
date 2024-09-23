import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/slices/postSlice";
import PostCard from "../components/postCard";

const Home = () => {
  const dispatch = useDispatch();
  const { allPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <ScrollView className="p-4">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        allPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </ScrollView>
  );
};

export default Home;
