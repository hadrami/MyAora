import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { useState } from "react";
import { images } from "../../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { signin } from "../redux/slices/authSlice";
import { getAllPosts } from "../redux/slices/postSlice";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [CountryCode, setCountryCode] = useState("MR");
  const [callingCode, setCallingCode] = useState("+222"); // Default calling code
  const [withFlag, setWithFlag] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState();
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, user } = useSelector((state) => state.auth); // Access error and status from Redux

  const handleSignIn = async () => {
    setIsSubmiting(true);
    const fullPhoneNumber = `${callingCode}${phone}`;
    if (phone.length < 8 || password.length < 6) {
      Alert.alert("Error", "Phone or password length issue");
      setIsSubmiting(false);
      return;
    }

    try {
      await dispatch(signin({ phone: fullPhoneNumber, password })).unwrap();
      if (user) {
        Alert.alert("Success", "Logged in successfully.");
        await dispatch(getAllPosts());
        router.push("/home");
      }
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full justify-center
       min-h-[83vh] px-4 my-6"
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text
            className="text-2xl text-white 
          text-semibold
           mt-10 
          font-psemibold"
          >
            Sign In to Aora
          </Text>
          <Text className="text-base text-gray-100 font-pmedium mt-7 mb-2">
            Phone
          </Text>
          <View
            className="border-2 border-black-200 w-full h-16 px-4
         bg-black-100 rounded-2xl flex-row
          focus:border-secondary-100 items-center"
          >
            <CountryPicker
              countryCode={CountryCode}
              withFilter
              withFlag={withFlag}
              withCallingCode
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(`+${country.callingCode[0]}`);
              }}
              disabled={isSubmiting}
            />
            <View
              className="h-[50px] w-[1px]
                   bg-slate-700 mx-2 opacity-50"
            />

            <TextInput
              className="flex-1 text-base text-gray-100 font-pmedium"
              value={phone}
              placeholder=""
              placeholderTextColor="#7B7B8B"
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isSubmiting}
            />
          </View>
          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-7"
            secureTextEntry={true}
            disabled={isSubmiting}
          />
          <View className="mt-5">
            <CustomButton
              title="Sign In"
              handlePress={handleSignIn}
              containerStyles="mt-7"
              isLoading={isSubmiting}
            />
          </View>

          <View className="justify-center pt-5 flex-row gap-2 ">
            <Text
              className="text-lg
             text-gray-100 font-pregular"
            >
              Don't have an account?
            </Text>
            <Link
              href="/signup"
              className="text-lg
            font-psemibold text-secondary"
            >
              Sign UP
            </Link>
          </View>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Forgot your password?
            </Text>
            <Link
              href="/forgotPassword"
              className="text-lg font-semibold text-secondary"
            >
              Reset it here
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
