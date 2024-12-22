import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../config/firebaseAdmin";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "../redux/slices/authSlice";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaVerifier = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    try {
      if (phone.length < 8) {
        Alert.alert("Error", "Phone number must be at least 8 digits long.");
        return;
      }

      setIsSubmitting(true);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      Alert.alert("OTP Sent", "Please check your phone for the OTP.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (otp.length !== 6 || newPassword.length < 6) {
        Alert.alert("Error", "Invalid OTP or password length.");
        return;
      }

      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential); // Verify OTP

      await dispatch(resetUserPassword({ phone, newPassword })).unwrap();

      Alert.alert("Success", "Password reset successfully.");
      router.push("/signin");
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", error || "Failed to reset password.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Text className="text-2xl text-white font-semibold mt-10">
            Forgot Password
          </Text>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={auth.app.options}
          />

          {!otpSent ? (
            <>
              <FormField
                title="Phone Number"
                value={phone}
                handleChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <CustomButton
                title="Send OTP"
                handlePress={handleSendOtp}
                isLoading={isSubmitting}
              />
            </>
          ) : (
            <>
              <FormField
                title="Enter OTP"
                value={otp}
                handleChangeText={setOtp}
                keyboardType="numeric"
              />
              <FormField
                title="New Password"
                value={newPassword}
                handleChangeText={setNewPassword}
                secureTextEntry
              />
              <CustomButton
                title="Reset Password"
                handlePress={handleResetPassword}
                isLoading={isSubmitting}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
