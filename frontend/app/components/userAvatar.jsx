import React from "react";
import { View, Text, Image } from "react-native";

const UserAvatar = ({ username, avatar }) => {
  if (avatar) {
    return (
      <Image
        source={{ uri: avatar }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
    );
  }
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "gray",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>{initial}</Text>
    </View>
  );
};

export default UserAvatar;
