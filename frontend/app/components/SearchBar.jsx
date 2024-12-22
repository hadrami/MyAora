import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim().length >= 3) {
      router.push(`/search/${query.trim()}`); // Navigate to the dynamic search route
    } else {
      alert("Search query must be at least three characters long.");
    }
  };

  return (
    <View className="flex-row items-center p-2 bg-gray-100 rounded-lg">
      <TextInput
        placeholder="Search posts..."
        value={query}
        onChangeText={setQuery}
        className="flex-1 border border-gray-300 p-2 rounded-lg"
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

export default SearchBar;
