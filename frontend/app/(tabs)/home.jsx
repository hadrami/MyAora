import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { getAllPosts } from "../redux/slices/postSlice";
import PostCard from "../components/postCard";
import SearchBar from "../components/SearchBar"; // Assuming you have a SearchBar component

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { allPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100"></View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <SearchBar placeholder="Search posts..." />
      <FlatList
        data={allPosts}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/postDetails",
                params: { postId: item.Id },
              })
            }
            className="flex-1 m-1"
          >
            <PostCard post={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-4">
            <Text>No posts available</Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;
