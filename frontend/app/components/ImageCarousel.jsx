import React from "react";
import { ScrollView, Image } from "react-native";

export const ImageCarousel = ({ images }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-2"
    >
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          className="h-40 w-40 mr-2 rounded-lg"
        />
      ))}
    </ScrollView>
  );
};
