import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";

const features = [
  {
    id: "1",
    name: "Eco Forum",
    description: "Engage in community discussions on waste management.",
    screen: "/eco-forum",
    image: "https://www.iswa.org/wp-content/uploads/2024/01/ecowaste-1.jpg",
  },
  {
    id: "2",
    name: "Eco Hub",
    description: "Learn and share educational content on waste management.",
    screen: "/eco-hub",
    image:
      "https://lirp.cdn-website.com/7c70a9c0/dms3rep/multi/opt/recycling_system-en-396w.jpg",
  },
  {
    id: "3",
    name: "Volunteer Hub",
    description: "Find and register for volunteer opportunities.",
    screen: "/volunteer-hub",
    image:
      "https://img.freepik.com/premium-vector/volunteer-activity-garbage-collection-save-world-concpet-vector-illustration-volunteers-young-people-with-garbage-bags-volunteering-working-environmental-cleanup_28629-2963.jpg",
  },
];

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center mb-6">
          <Image
            source={images.logo}
            className="w-20 h-20 mb-4"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome to Eco Connect
          </Text>
          <Text className="text-md text-gray-100">
            Where environmental awareness meets community engagement
          </Text>
        </View>

        <View className="space-y-6">
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => router.push(feature.screen)}
              className="bg-white p-4 rounded-xl shadow-lg flex-row items-center"
              style={{ elevation: 3 }}
            >
              <Image
                source={{ uri: feature.image }}
                className="w-24 h-24 mr-4 rounded-xl"
              />
              <View className="flex-1">
                <Text className="text-xl font-bold text-primary">
                  {feature.name}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {feature.description}
                </Text>
              </View>
              <Text className="text-primary font-bold text-lg">{">"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
