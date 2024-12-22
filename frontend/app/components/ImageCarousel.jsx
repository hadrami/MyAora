// ImageCarousel.js
import React from "react";
import { ScrollView, Image } from "react-native";

const ImageCarousel = ({ images }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {images.map((image, index) => (
      <Image
        key={index}
        source={{ uri: image }}
        style={{
          width: 150,
          height: 150,
          marginRight: 10,
          borderRadius: 8,
        }}
      />
    ))}
  </ScrollView>
);

export default ImageCarousel;
