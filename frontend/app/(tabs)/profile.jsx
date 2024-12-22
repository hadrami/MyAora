import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { getUserPosts } from "../redux/slices/authSlice";
import PostCard from "../components/postCard";
import Avatar from "../components/Avatar";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, posts } = useSelector((state) => state.auth);

  useEffect(() => {
    if (posts.length === 0 && user) {
      dispatch(getUserPosts(user.Id));
    }
  }, [dispatch, user, posts]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white p-4 shadow rounded-b-lg mb-4">
          <View className="flex-row items-center">
            <Avatar user={user} size={70} />
            <View className="ml-4">
              <Text className="text-xl font-bold">{user?.username}</Text>
              <Text className="text-gray-600">{posts.length} Posts</Text>
            </View>
          </View>
        </View>
        <View className="px-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Your Posts
          </Text>
          {posts.length > 0 ? (
            posts.map((post) => (
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
            <Text className="text-center text-gray-500">No posts yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
