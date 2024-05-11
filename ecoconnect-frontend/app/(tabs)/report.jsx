import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Switch,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const initialReports = [
  {
    id: "1",
    type: "Overflowing Bin",
    details: "The bin at the main street is overflowing.",
    image: "https://media.sciencephoto.com/e8/00/04/41/e8000441-800px-wm.jpg",
    location: "Main Street",
    anonymous: false,
  },
  {
    id: "2",
    type: "Littering",
    details: "Littering near the central park.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw7MQrue9v92cvpDQUtCqUVLAETrj1wqGR8CAITZjGtw&s",
    location: "Central Park",
    anonymous: true,
  },
];

const Report = () => {
  const [reports, setReports] = useState(initialReports);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reportType, setReportType] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const imgbbKey = "a9e96cffb01065e5efdb260580e31b2a";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      uploadImageToImgbb(imageUri);
    }
  };

  const uploadImageToImgbb = async (uri) => {
    const imgData = new FormData();
    const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
    imgData.append("image", {
      uri,
      type: "image/jpeg",
      name: "report_image.jpg",
    });

    try {
      const imgUploadResponse = await axios.post(url, imgData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imgUrl = imgUploadResponse.data.data.url;
      setImage(imgUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Image upload failed. Please try again.");
    }
  };

  const handleAddReport = () => {
    if (!reportType || !details || !location) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const newReport = {
      id: (reports.length + 1).toString(),
      type: reportType,
      details: details,
      image: image || "https://via.placeholder.com/150",
      location: location,
      anonymous: isAnonymous,
    };

    setReports([...reports, newReport]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setReportType("");
    setDetails("");
    setImage(null);
    setLocation("");
    setIsAnonymous(false);
  };

  const renderReport = ({ item }) => (
    <View className="p-4 bg-white shadow-lg rounded-lg mb-4">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-lg mr-4"
          resizeMode="cover"
        />
        <View>
          <Text className="text-lg font-bold text-primary">{item.type}</Text>
          <Text className="text-sm text-gray-600">
            Location: {item.location}
          </Text>
        </View>
      </View>
      <Text className="text-sm text-gray-700 mb-2">{item.details}</Text>
      <Text className="text-sm text-gray-500">
        Anonymous: {item.anonymous ? "Yes" : "No"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        ListHeaderComponent={() => (
          <Text className="text-2xl font-bold mb-4">Your Reports</Text>
        )}
      />

      <TouchableOpacity
        className="p-4 bg-secondary rounded-lg mt-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-lg font-bold text-center">Add Report</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="p-4 bg-white rounded-lg w-11/12">
            <Text className="text-2xl font-bold mb-4">Add New Report</Text>

            <TextInput
              className="border mb-4 p-2 rounded-lg"
              placeholder="Report Type"
              value={reportType}
              onChangeText={setReportType}
            />
            <TextInput
              className="border mb-4 p-2 rounded-lg"
              placeholder="Details"
              value={details}
              onChangeText={setDetails}
              multiline
            />
            <TextInput
              className="border mb-4 p-2 rounded-lg"
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity
              className="bg-primary p-2 rounded-lg mb-4"
              onPress={pickImage}
            >
              <Text className="text-center text-white">
                {image ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                className="w-24 h-24 rounded-lg mb-4"
                resizeMode="cover"
              />
            )}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm">Report Anonymously</Text>
              <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="p-2 bg-gray-400 rounded-lg flex-1 mr-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-primary rounded-lg flex-1 ml-2"
                onPress={handleAddReport}
              >
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Report;
