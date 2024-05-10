import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { InfoBox } from "../../components";

const imgbbKey = "a9e96cffb01065e5efdb260580e31b2a";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phoneNumber || "");
  const [newAvatar, setNewAvatar] = useState(user?.avatar || "");

  const logout = async () => {
    // await signOut();
    setUser(null);
    setIsLogged(false);

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
    const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
    imgData.append("image", {
      uri,
      type: "image/jpeg",
      name: "profile_image.jpg",
    });

    try {
      const imgUploadResponse = await axios.post(url, imgData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imgUrl = imgUploadResponse.data.data.url;
      setNewAvatar(imgUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Image upload failed. Please try again.");
    }
  };

  const handleUpdateProfile = () => {
    if (!newName || !newPhoneNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const updatedUser = {
      ...user,
      name: newName,
      phoneNumber: newPhoneNumber,
      avatar: newAvatar,
    };

    setUser(updatedUser);
    setModalVisible(false);
  };

  const renderHeader = () => (
    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity onPress={logout} className="w-full items-end mb-6">
        <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-24 h-24 border-4 border-primary rounded-full flex justify-center items-center mb-4"
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: newAvatar }}
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-primary">{newName}</Text>
      <Text className="text-lg text-gray-500">{user?.username}</Text>
      <Text className="text-lg text-gray-500">{user?.email}</Text>
      <Text className="text-lg text-gray-500">{newPhoneNumber}</Text>

      <View className="mt-5 flex flex-row justify-center items-center">
        <InfoBox
          title={posts.length || 0}
          subtitle="Reports/Posts"
          titleStyles="text-xl"
          containerStyles="mr-10"
        />
        <InfoBox title="1.2k" subtitle="Reports" titleStyles="text-xl" />
      </View>
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
                {newAvatar
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"}
              </Text>
            </TouchableOpacity>
            {newAvatar && (
              <Image
                source={{ uri: newAvatar }}
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
