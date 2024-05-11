import React, { useState } from "react";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

const imgbbKey = "a9e96cffb01065e5efdb260580e31b2a";

const Profile = () => {
  const { user, setUser, logout } = useGlobalContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phoneNumber || "");
  const [newPhotoUrl, setNewPhotoUrl] = useState(
    user?.photoUrl || "https://via.placeholder.com/150"
  );

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToImgbb(result.assets[0].uri);
    }
  };

  const uploadImageToImgbb = async (uri) => {
    const imgData = new FormData();
    imgData.append("image", {
      uri,
      type: "image/jpeg",
      name: "profile_image.jpg",
    });

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        imgData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data && response.data.data && response.data.data.url) {
        setNewPhotoUrl(response.data.data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Image upload failed. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!newName || !newPhoneNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      // const response = await axios.put(
      //   "http://192.168.137.148:8080/profile",
      //   {
      //     name: newName,
      //     phoneNumber: newPhoneNumber,
      //     photoUrl: newPhotoUrl,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${user?.token}`,
      //     },
      //   }
      // );

      // if (response.status === 200) {
      setUser({
        ...user,
        name: newName,
        phoneNumber: newPhoneNumber,
        photoUrl: newPhotoUrl,
      });
      Alert.alert("Success", "Profile updated successfully.");
      setModalVisible(false);
      // } else {
      //   throw new Error(response.data.message || "Failed to update profile.");
      // }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred during profile update."
      );
    }
  };

  const renderHeader = () => (
    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full items-end mb-6"
      >
        <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-24 h-24 border-4 border-primary rounded-full flex justify-center items-center mb-2"
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: newPhotoUrl }}
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-gray-500">{user?.name}</Text>
      <Text className="text-lg text-gray-500">{user?.username}</Text>
      <Text className="text-lg text-gray-500">{user?.email}</Text>
      <Text className="text-lg text-gray-500">{user?.phoneNumber}</Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderHeader()}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="p-6 bg-white rounded-lg w-11/12">
            <Text className="text-2xl font-bold mb-4 text-center">
              Update Profile
            </Text>
            <TextInput
              className="border mb-4 p-3 rounded-lg"
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              className="border mb-4 p-3 rounded-lg"
              placeholder="Phone Number"
              value={newPhoneNumber}
              keyboardType="phone-pad"
              onChangeText={setNewPhoneNumber}
            />
            <TouchableOpacity
              className="bg-primary p-2 rounded-lg mb-4"
              onPress={pickImage}
            >
              <Text className="text-center text-white">
                {newPhotoUrl !== "https://via.placeholder.com/150"
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"}
              </Text>
            </TouchableOpacity>
            {newPhotoUrl && (
              <Image
                source={{ uri: newPhotoUrl }}
                className="w-24 h-24 rounded-lg mb-4 self-center"
                resizeMode="cover"
              />
            )}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="p-3 bg-gray-400 rounded-lg flex-1 mr-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 bg-primary rounded-lg flex-1 ml-2"
                onPress={handleUpdateProfile}
              >
                <Text className="text-white text-center">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
