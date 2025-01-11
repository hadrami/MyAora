import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getPostById,
  updateExistingPost,
  deletePost,
} from "../app/redux/slices/postSlice";
import { convertTimestampToDate } from "../app/hooks/timestampReader";
import { FontAwesome } from "@expo/vector-icons";
import ImageCarousel from "../app/components/ImageCarousel";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("Post ID for Post Details: " + postId);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    location: "",
    status: "Available",
    images: [],
  });

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await dispatch(getPostById(postId)).unwrap();
        console.log("Fetched post:", JSON.stringify(fetchedPost, null, 2));

        setPost(fetchedPost);
        setFormData({
          Id: postId,
          title: fetchedPost.title || "",
          price: fetchedPost.price || "",
          category: fetchedPost.category || "",
          description: fetchedPost.description || "",
          location: fetchedPost.location || "",
          status: fetchedPost.status || "Available",
          images: fetchedPost.images || [],
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch post details.");
        router.push("/profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [dispatch, postId, router]);

  // Toggle edit mode
  const handleEditToggle = () => setIsEditing(!isEditing);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle image deletion
  const handleDeleteImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  // Save post changes
  const handleSaveChanges = async () => {
    try {
      // Ensure the updated post data is sent as a complete object
      const updatedPost = {
        Id: formData.Id,
        title: formData.title,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        images: formData.images,
      };

      console.log("Updated post data before sending:", updatedPost);

      await dispatch(
        updateExistingPost({ postId: formData.Id, updatedData: updatedPost })
      ).unwrap();

      Alert.alert("Success", "Post updated successfully.");
      setIsEditing(false);
      router.push("/profile");
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  // Handle post deletion
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deletePost(postId)).unwrap();
              Alert.alert("Success", "Post deleted successfully.");
              router.push("/profile");
            } catch (error) {
              Alert.alert("Error", "Failed to delete the post.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-100 p-4">
      <View className="bg-white shadow rounded-lg p-4">
        {/* Image Carousel */}
        <ImageCarousel images={formData.images} />

        {/* Title */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.title}
            onChangeText={(value) => handleInputChange("title", value)}
          />
        ) : (
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {post.title}
          </Text>
        )}

        {/* Status */}
        <Text
          className={`text-sm font-semibold mb-4 ${
            formData.status === "Available" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formData.status}
        </Text>

        {/* Price */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.price}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("price", value)}
          />
        ) : (
          <Text className="text-gray-600 mb-2">Price: ${post.price}</Text>
        )}

        {/* Date */}
        <Text className="text-gray-600 mb-2">
          Date: {convertTimestampToDate(post.createdAt)}
        </Text>

        {/* Description */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
          />
        ) : (
          <Text className="text-gray-700 mb-4">{post.description}</Text>
        )}

        {/* Location */}
        {isEditing ? (
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={formData.location}
            onChangeText={(value) => handleInputChange("location", value)}
          />
        ) : (
          <Text className="text-gray-600 mb-2">Location: {post.location}</Text>
        )}

        {/* User Contact */}
        <View className="flex-row items-center justify-start mt-4 space-x-4">
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${user.phone}`)}
            className="p-2 bg-gray-100 rounded-full"
          >
            <FontAwesome name="phone" size={20} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://wa.me/${user.phone}`)}
            className="p-2 bg-gray-100 rounded-full"
          >
            <FontAwesome name="whatsapp" size={20} color="green" />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        {post.userId === user.Id && (
          <View className="flex-row justify-between mt-6 space-x-4">
            {isEditing ? (
              <>
                <TouchableOpacity
                  onPress={handleSaveChanges}
                  className="bg-green-500 p-4 rounded"
                >
                  <FontAwesome name="save" size={20} color="white" />
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEditToggle}
                  className="bg-gray-400 p-4 rounded"
                >
                  <FontAwesome name="times" size={20} color="white" />
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleEditToggle}
                  className="bg-blue-500 p-4 rounded"
                >
                  <FontAwesome name="pencil" size={20} color="white" />
                  <Text className="text-white">Modify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-red-500 p-4 rounded"
                >
                  <FontAwesome name="trash" size={20} color="white" />
                  <Text className="text-white">Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PostDetails;
