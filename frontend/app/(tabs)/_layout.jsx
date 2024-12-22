import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center pt-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 24, height: 24 }} // Adjust icon size for consistency
      />
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: focused ? "600" : "400", // Semi-bold for active, regular for inactive
          textAlign: "center",
        }}
        numberOfLines={1} // Ensures the text stays on one line
        ellipsizeMode="tail" // Handles overflow gracefully
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0A172C", // Dark blue for active tab
          tabBarInactiveTintColor: "#E5E7EC", // Light gray for inactive tab
          tabBarStyle: {
            height: 70, // Slightly reduced height for a compact appearance
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#ccc",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
