import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, getUserPosts } from "../redux/slices/authSlice";
import PostCard from "../components/postCard";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, posts, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserProfile(user.Id));
    dispatch(getUserPosts(user.Id));
  }, [dispatch]);

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold">{user?.username}'s Profile</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </ScrollView>
  );
};

export default Profile;
