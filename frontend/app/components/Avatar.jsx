import React from "react";
import { View, Text, Image } from "react-native";

const Avatar = ({ user }) => {
  console.log("***User of the avatar***:", user);

  if (!user) return null; // Return null if user object is undefined

  return (
    <View className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
      {user.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          className="h-full w-full rounded-full"
        />
      ) : (
        <Text className="text-lg font-bold">
          {user.username ? user.username.charAt(0).toUpperCase() : "?"}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
