import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loadToken } from "../app/redux/slices/authSlice";
import { getUserInfo } from "../app/services/authService";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "./components/CustomButton";

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        const { uid } = jwtDecode(savedToken);
        const user = await getUserInfo(uid);
        dispatch(signIn.fulfilled({ token: savedToken, user }));
      }
    };
    loadUserData();
  }, [dispatch]);

  // Redirect based on token and user state
  useEffect(() => {
    if (token && user) {
      router.push("home"); // Navigate to your main screen if authenticated
    }
  }, [token, user]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View
          className="w-full flex justify-center 
        items-center h-full px-4"
        >
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px]  w-full h-[298px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text
              className="text-3xl text-white 
            font-bold text center"
            >
              Discover Endless {"\n"}
              Possibilities With {""}
              <Text className="text-secondary-200">Aoura</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px]
            absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text
            className="text-sm font-pregular
            text-gray-100 mt-7 text-center"
          >
            Where creativity limitless exploration with Aora
          </Text>
          <CustomButton
            title="Continue with Phone"
            handlePress={() => router.push("signin")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
