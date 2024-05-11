import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialEvents = [
  {
    id: "1",
    title: "Community Clean-Up Drive",
    description: "Join us for a clean-up drive to beautify the community.",
    image: "https://i.ytimg.com/vi/1d-IQGcD6yg/maxresdefault.jpg",
    date: "25th May 2024",
    location: "Main Street Park",
  },
  {
    id: "2",
    title: "Recycling Campaign",
    description:
      "Participate in our recycling campaign and promote eco-friendly practices.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiEfMK8MOta_KFHds7wD93eV6pyCkdRtkdC0yrMwNgfA&s",
    date: "10th June 2024",
    location: "Central Park",
  },
  {
    id: "3",
    title: "Waste Management Awareness Workshop",
    description:
      "Attend this workshop to learn about waste management practices.",
    image:
      "https://cdn.cseindia.org/large/2021-08-09/0.75503400_1628496890_solid-wastebanners.jpg",
    date: "20th June 2024",
    location: "Eco Hub Auditorium",
  },
];

const VolunteerHub = () => {
  const [events] = useState(initialEvents);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  const registerVolunteer = () => {
    if (volunteerName && volunteerEmail && volunteerPhone) {
      alert(
        `Registered for ${selectedEvent.title}\nName: ${volunteerName}\nEmail: ${volunteerEmail}\nPhone: ${volunteerPhone}`
      );
      setVolunteerName("");
      setVolunteerEmail("");
      setVolunteerPhone("");
      closeModal();
    } else {
      alert("Please fill all the fields.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center mb-6">
          <Text className="text-md text-gray-100">
            Upcoming Waste Management Events
          </Text>
        </View>

        <View className="space-y-6">
          {events.map((event) => (
            <View key={event.id} className="bg-white p-5 rounded-2xl shadow-xl">
              <Image
                source={{ uri: event.image }}
                className="w-full h-40 mb-3 rounded-2xl"
                resizeMode="cover"
              />
              <View className="mb-4">
                <Text className="text-2xl font-bold text-primary mb-1">
                  {event.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {event.description}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                    {event.date}
                  </Text>
                  <Text className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                    {event.location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => openModal(event)}
                className="bg-primary p-3 rounded-lg shadow-lg"
              >
                <Text className="text-center text-white font-bold">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Volunteer Registration Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
            <Text className="text-2xl font-bold text-primary mb-4">
              Volunteer Registration
            </Text>
            {selectedEvent && (
              <View className="mb-4">
                <Text className="text-xl font-bold">{selectedEvent.title}</Text>
                <Text className="text-sm text-gray-600 mb-2">
                  {selectedEvent.date}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  {selectedEvent.location}
                </Text>
              </View>
            )}
            <TextInput
              value={volunteerName}
              onChangeText={setVolunteerName}
              placeholder="Name"
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <TextInput
              value={volunteerEmail}
              onChangeText={setVolunteerEmail}
              placeholder="Email"
              keyboardType="email-address"
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <TextInput
              value={volunteerPhone}
              onChangeText={setVolunteerPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={closeModal}
                className="bg-gray-400 p-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={registerVolunteer}
                className="bg-primary p-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VolunteerHub;
