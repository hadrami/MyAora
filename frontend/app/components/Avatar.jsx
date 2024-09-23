import React from "react";
import { View, Text, Image } from "react-native";

export const Avatar = ({ user }) => {
  return (
    <View className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
      {user.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          className="h-full w-full rounded-full"
        />
      ) : (
        <Text className="text-lg font-bold">{user.username.charAt(0)}</Text>
      )}
    </View>
  );
};
