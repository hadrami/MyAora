import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPostById, updateExistingPost } from "./redux/slices/postSlice";
import CustomButton from "./components/CustomButton";

const EditPost = () => {
  const { postId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentPost, loading } = useSelector((state) => state.posts);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId)).then((action) => {
        if (action.payload) {
          setTitle(action.payload.title);
          setDescription(action.payload.description);
          setImages(action.payload.images || []);
        }
      });
    }
  }, [postId]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }
    console.log("****** EDIT THIS ID:", postId);
    console.log("****** EDIT INfo THIS ID:", title, description);

    try {
      const updatedData = {
        title,
        description,
        images,
      };

      await dispatch(updateExistingPost({ postId, updatedData })).unwrap();
      Alert.alert("Success", "Post updated successfully.");

      router.push("/profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update post.");
    }
  };

  if (loading || !currentPost) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView className="p-4">
      <Text className="font-bold text-2xl mb-4">Edit Post</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="border p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        className="border p-2 rounded mb-4"
        multiline
      />

      <CustomButton title="Add Images" handlePress={handleImagePicker} />
      <ScrollView horizontal className="mt-4">
        {images.map((uri, index) => (
          <View key={index} className="relative mr-2">
            <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
            <TouchableOpacity
              onPress={() => handleRemoveImage(uri)}
              className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
            >
              <Text style={{ color: "white" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <CustomButton title="Update Post" handlePress={handleSubmit} />
    </ScrollView>
  );
};

export default EditPost;
