import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth } from "../../config/firebaseAdmin"; // Make sure to point to your config file
import {
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
//import auth from "../../config/firebaseAdmin";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { images } from "../../constants";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";
import { checkUsernameAv, checkPhoneAv } from "../services/authService";
import { signup } from "../redux/slices/authSlice"; // Importing the signup action from Redux

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [CountryCode, setCountryCode] = useState("MR");
  const [callingCode, setCallingCode] = useState("+222"); // Default calling code
  const [withFlag, setWithFlag] = useState(true);
  const recaptchaVerifier = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.auth);

  const handleSendOtp = async () => {
    try {
      if (phone.length < 8) {
        Alert.alert("Error", "Phone number must be at least 8 digits long.");
        setIsSubmitting(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(true);

      const fullPhoneNumber = `${callingCode}${phone}`;
      setPhone(fullPhoneNumber);

      const checkUsername = await checkUsernameAv(username);
      const checkPhone = await checkPhoneAv(phone);

      if (!checkPhone.isAvailable) {
        Alert.alert("Error", "This phone number is already taken");
        setIsSubmitting(false);

        return;
      }

      if (!checkUsername.isAvailable) {
        Alert.alert("Error", "This username is already taken");
        setIsSubmitting(false);

        return;
      }

      // ReCaptcha should be invoked before sending the OTP
      const phoneProvider = signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifier.current
      );
      const confirmationResult = await phoneProvider;

      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true); // This will now trigger the OTP input to be displayed
      Alert.alert("OTP Sent", "Please check your phone for the OTP.");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Error sending OTP");
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid OTP code.");
      return;
    }

    const Fullphone = `${callingCode}${phone}`;
    setIsSubmitting(true);

    try {
      // Verify the OTP on the frontend
      const mycredential = PhoneAuthProvider.credential(verificationId, otp);

      await signInWithCredential(auth, mycredential); // Firebase OTP verification

      // Send the verified data to backend

      // Proceed with sign-up
      await dispatch(signup({ username, Fullphone, password })).unwrap();
      Alert.alert("Success", "User signed up successfully");
      router.push("/signin");
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[83vh] px-4 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[35px]"
            />
            <Text className="text-2xl text-white font-semibold mt-10">
              Sign Up to Aora
            </Text>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={auth.app.options}
            />

            {!otpSent ? (
              <>
                {/* Username Field */}
                <FormField
                  title="Username"
                  value={username}
                  handleChangeText={setUsername}
                  otherStyles="mt-10"
                  keyboardType="default"
                  disabled={isSubmitting}
                />

                {/* Phone Field */}
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
                    disabled={isSubmitting}
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
                    editable={!isSubmitting}
                  />
                </View>

                {/* Password Field */}
                <FormField
                  title="Password"
                  value={password}
                  handleChangeText={setPassword}
                  otherStyles="mt-7"
                  secureTextEntry={true}
                  disabled={isSubmitting}
                />

                {/* Send OTP Button */}
                <View className="mt-5">
                  <CustomButton
                    title="Sign Up"
                    handlePress={handleSendOtp}
                    containerStyles="mt-7"
                    isLoading={isSubmitting}
                  />
                </View>
              </>
            ) : (
              <>
                {/* OTP Field */}
                <FormField
                  title="Enter OTP "
                  value={otp}
                  handleChangeText={setOtp}
                  otherStyles="mt-10"
                  keyboardType="default"
                  disabled={true}
                />

                {/* Verify OTP Button */}
                <View className="mt-5">
                  <CustomButton
                    title="Signup"
                    handlePress={handleSignup}
                    containerStyles="mt-7"
                    isLoading={isSubmitting}
                  />
                </View>
              </>
            )}

            {!isSubmitting && (
              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-gray-100 font-regular">
                  Have an account already?
                </Text>
                <Link
                  href="/signin"
                  className="text-lg font-semibold text-secondary"
                >
                  Sign In
                </Link>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
