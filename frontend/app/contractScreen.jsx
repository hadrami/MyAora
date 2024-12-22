import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SignatureScreen } from "react-native-signature-canvas"; // Install this library
import { PDFDocument, rgb } from "pdf-lib"; // Install this library
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const ContractScreen = () => {
  const { post, seller, user } = useLocalSearchParams();
  const [parsedPost, setParsedPost] = useState(null);
  const [parsedSeller, setParsedSeller] = useState(null);
  const [parsedUser, setParsedUser] = useState(null);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (post && seller && user) {
      setParsedPost(JSON.parse(post));
      setParsedSeller(JSON.parse(seller));
      setParsedUser(JSON.parse(user));
    }
  }, [post, seller, user]);

  const handleSignature = (sig) => {
    setSignature(sig); // Save the signature as a base64 string
  };

  const generatePDF = async () => {
    if (!parsedPost || !parsedSeller || !parsedUser || !signature) {
      Alert.alert("Error", "Complete all fields and sign the contract.");
      return;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Add content to the PDF
    page.drawText("Contract Agreement", {
      x: 50,
      y: 350,
      size: 18,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Post: ${parsedPost.title}`, { x: 50, y: 320, size: 14 });
    page.drawText(`Description: ${parsedPost.description}`, {
      x: 50,
      y: 300,
      size: 12,
    });
    page.drawText(`Price: $${parsedPost.price}`, { x: 50, y: 280, size: 12 });
    page.drawText(`Seller: ${parsedSeller.username} (${parsedSeller.phone})`, {
      x: 50,
      y: 260,
      size: 12,
    });
    page.drawText(`Buyer: ${parsedUser.username} (${parsedUser.phone})`, {
      x: 50,
      y: 240,
      size: 12,
    });

    // Embed signature
    const pngImage = await pdfDoc.embedPng(signature);
    const pngDims = pngImage.scale(0.5);
    page.drawImage(pngImage, {
      x: 50,
      y: 100,
      width: pngDims.width,
      height: pngDims.height,
    });

    // Save the document
    const pdfBytes = await pdfDoc.save();
    const pdfPath = `${FileSystem.documentDirectory}contract.pdf`;

    await FileSystem.writeAsStringAsync(pdfPath, pdfBytes, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(pdfPath);
  };

  return (
    <ScrollView className="p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-4">Contract Details</Text>
      <Text className="mb-2">Post: {parsedPost?.title}</Text>
      <Text className="mb-2">Price: ${parsedPost?.price}</Text>
      <Text className="mb-2">Seller: {parsedSeller?.username}</Text>
      <Text className="mb-2">Seller Phone: {parsedSeller?.phone}</Text>
      <Text className="mb-2">Buyer: {parsedUser?.username}</Text>
      <Text className="mb-2">Buyer Phone: {parsedUser?.phone}</Text>

      {/* Signature Section */}
      <View style={{ height: 300, marginTop: 20 }}>
        <SignatureScreen
          onOK={handleSignature}
          descriptionText="Sign here"
          clearText="Clear"
          confirmText="Save"
        />
      </View>

      {/* Generate Contract Button */}
      <TouchableOpacity
        className="mt-4 bg-blue-500 py-2 px-4 rounded"
        onPress={generatePDF}
      >
        <Text className="text-white text-center">Generate Contract</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContractScreen;
