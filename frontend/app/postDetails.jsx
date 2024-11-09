import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { getPostById } from "../app/redux/slices/postSlice";
import ImageCarousel from "../app/components/ImageCarousel";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentPost, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!currentPost) {
    return (
      <View>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Image Carousel */}
      {currentPost.images && currentPost.images.length > 0 && (
        <ImageCarousel images={currentPost.images} />
      )}

      {/* Post Details */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {currentPost.title}
        </Text>
        <Text style={{ marginTop: 8 }}>{currentPost.description}</Text>
      </View>
    </ScrollView>
  );
};

export default PostDetails;
