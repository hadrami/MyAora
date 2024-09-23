import React, { useState } from "react";
import { View, TextInput, Button, Text, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/slices/postSlice";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("available");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log;
  const Id = "";
  const userId = user.Id;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Enable multiple image selection
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleSubmit = () => {
    const postData = {
      Id,
      title,
      description,
      images,
      status,
      userId,
    };
    dispatch(createPost(postData));
  };

  return (
    <ScrollView className="p-4">
      <TextInput
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
        className="border p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Post Description"
        value={description}
        onChangeText={setDescription}
        className="border p-2 rounded mb-4"
        multiline
      />
      <View className="mb-4">
        <Text className="text-lg mb-2">Images</Text>
        <Button title="Pick Images" onPress={pickImage} />
        <ScrollView horizontal className="mt-2">
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} className="w-24 h-24 mr-2" />
          ))}
        </ScrollView>
      </View>
      <TextInput
        placeholder="Status (e.g., available, sold out)"
        value={status}
        onChangeText={setStatus}
        className="border p-2 rounded mb-4"
      />
      <View className="mt-5">
        <CustomButton
          title="Sign In"
          handlePress={handleSubmit}
          containerStyles="mt-7"
        />
      </View>
    </ScrollView>
  );
};

export default Create;
