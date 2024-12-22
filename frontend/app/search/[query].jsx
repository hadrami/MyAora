import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSearchResults } from "../redux/slices/postSlice";
import PostCard from "../components/postCard";

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (query && query.length >= 3) {
      dispatch(getSearchResults(query));
    }
  }, [dispatch, query]);

  if (loading) {
    return <View className="flex-1 justify-center items-center"></View>;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      {searchResults.length > 0 ? (
        searchResults.map((post) => <PostCard key={post.Id} post={post} />)
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No matching posts found.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SearchResults;
