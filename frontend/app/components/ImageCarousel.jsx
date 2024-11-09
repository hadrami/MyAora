import React from "react";
import { ScrollView, Image, TouchableOpacity } from "react-native";

const ImageCarousel = ({ images, onImagePress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => onImagePress(image)}>
          <Image
            source={{ uri: image }}
            style={{
              width: 150,
              height: 150,
              marginRight: 10,
              borderRadius: 8,
            }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ImageCarousel;
