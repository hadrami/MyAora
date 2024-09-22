import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary
    rounded-xl h-[50px] flex flex-row justify-center 
    items-center
     ${containerStyles}${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <Text
          className={`text-primary 
      font-psemibold 
      text-lg ${textStyles} `}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
