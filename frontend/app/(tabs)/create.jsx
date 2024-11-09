import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For the "X" remove icon
import CustomButton from "../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/slices/postSlice";
import { Picker } from "@react-native-picker/picker"; // Picker for category and status
import { categories } from "../../constants"; // Assuming categories are imported
import { useRouter } from "expo-router";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("available");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState();

  const router = useRouter();
  const dispatch = useDispatch();

  // Ensure user and userId are defined
  const { user } = useSelector((state) => state.auth);
  console.log("the user in the creat screen:", user);
  const userId = user?.Id || ""; // Fallback to empty string if undefined
  console.log("the userId in the creat:", userId);
  // Pick images from the gaIdllery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  // Remove image from selected list
  const removeImage = (uri) => {
    setImages(images.filter((imageUri) => imageUri !== uri));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true); // Set loading state
    setErrorMessage(""); // Clear any previous errors
    const Id = "";

    const postData = {
      Id,
      title,
      description,
      images,
      category,
      location,
      status,
      userId,
    };

    try {
      // Dispatch the action to create the post
      console.log("postData in the screen:", postData);
      await dispatch(createPost(postData)).unwrap(); // Unwrap to catch errors properly

      // Navigate to the profile screen after successful creation
      router.push("/profile");
    } catch (error) {
      // Handle error and display a message to the user
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[83vh] px-4 my-6">
            <Text className="text-2xl text-white font-semibold mt-10">
              Create a Post
            </Text>

            <View>
              {/* Title Field */}
              <View className="space-y-2 mt-10">
                <Text className="text-base text-gray-100 font-pmedium">
                  Title
                </Text>
                <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex-row items-center">
                  <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={title}
                    placeholder="Enter title"
                    placeholderTextColor="#7B7B8B"
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              {/* Description Field (multiline) */}
              <Text className="text-base text-gray-100 font-pmedium mt-7 mb-2">
                Description
              </Text>
              <View className="border-2 border-black-200 w-full h-auto px-4 py-2 bg-black-100 rounded-2xl">
                <TextInput
                  className="text-base text-gray-100 font-pmedium"
                  value={description}
                  placeholder="Enter description"
                  placeholderTextColor="#7B7B8B"
                  onChangeText={setDescription}
                  multiline={true}
                />
              </View>

              {/* Image Picker */}
              <View className="mb-4">
                <Text className="text-lg mb-2">Images</Text>
                <CustomButton title="Pick Images" handlePress={pickImage} />
                <ScrollView horizontal className="mt-2">
                  {images.map((uri, index) => (
                    <View key={index} className="relative mr-2">
                      <Image
                        source={{ uri }}
                        className="w-24 h-24 rounded-lg"
                      />
                      <TouchableOpacity
                        className="absolute top-1 right-1 bg-red-500 rounded-full"
                        onPress={() => removeImage(uri)}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className="border-2 border-black-200 bg-primary rounded-2xl mb-4">
                <Picker
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value)}
                  style={{ color: "white", backgroundColor: "#primaryColor" }} // Direct inline styles for Picker
                >
                  <Picker.Item
                    label="Select category"
                    value=""
                    enabled={false}
                    style={{ color: "white", backgroundColor: "#primaryColor" }} // Inline styling for items
                  />
                  {categories.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.name}
                      value={item.name}
                      style={{
                        color: "white",
                        backgroundColor: "#primaryColor",
                      }} // Apply white text and primary background color
                    />
                  ))}
                </Picker>
              </View>

              {/* Title Field */}
              <View className="space-y-2 mt-10">
                <Text className="text-base text-gray-100 font-pmedium">
                  Location
                </Text>
                <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex-row items-center">
                  <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={location}
                    placeholder="Enter title"
                    placeholderTextColor="#7B7B8B"
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              <View className="border-2 border-black-200 bg-primary rounded-2xl mb-4">
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                  style={{ color: "white", backgroundColor: "#primaryColor" }} // Direct inline styles for Picker
                >
                  <Picker.Item
                    label="Select status"
                    value=""
                    enabled={false}
                    style={{ color: "white", backgroundColor: "#primaryColor" }} // Inline styling for items
                  />
                  <Picker.Item
                    label="Available"
                    value="available"
                    style={{ color: "white", backgroundColor: "#primaryColor" }}
                  />
                  <Picker.Item
                    label="Sold Out"
                    value="sold out"
                    style={{ color: "white", backgroundColor: "#primaryColor" }}
                  />
                </Picker>
              </View>

              <View>
                {/* Show error message if there is any */}
                {errorMessage && (
                  <Text className="text-red-500">{errorMessage}</Text>
                )}
                <CustomButton title="Create Post" handlePress={handleSubmit} />
                {/* Show loading spinner or submit button */}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Create;
