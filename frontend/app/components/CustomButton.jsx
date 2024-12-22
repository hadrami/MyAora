import { TouchableOpacity, Text } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary
        rounded-xl h-[50px] flex flex-row justify-center 
        items-center
        ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <Text
          className={`text-primary 
            font-psemibold 
            text-lg ${textStyles}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
