import React, { useState } from "react";
import { Link, router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import axios from "axios";

import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post("http://192.168.137.148:8080/login", {
        email: form.email,
        password: form.password,
      });

      if (response.data) {
        setUser(response.data);
        setIsLogged(true);

        Alert.alert("Success", "User signed in successfully");
        router.replace("/home");
      } else {
        throw new Error("Failed to sign in");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        error.response
          ? error.response.data.message
          : "An error occurred during login."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Eco Connect
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(email) => setForm({ ...form, email })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(password) => setForm({ ...form, password })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
