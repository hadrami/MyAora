import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "./redux/store"; //

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <Provider store={store}>
      <Stack>
        {/* Main Screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />{" "}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />{" "}
        {/* Additional Screens */}
        <Stack.Screen name="postDetails" options={{ title: "Post Details" }} />
        <Stack.Screen
          name="(tabs)/contractScreen"
          options={{ title: "Contract Screen" }}
        />
        <Stack.Screen name="bookmark" options={{ title: "Bookmarks" }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
