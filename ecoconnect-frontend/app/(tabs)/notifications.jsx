import React, { useState } from "react";
import { Text, FlatList, SafeAreaView, TouchableOpacity } from "react-native";

const initialNotifications = [
  {
    id: "1",
    title: "Garbage Collection Schedule Change",
    description:
      "Due to the upcoming holiday, the garbage collection schedule has been adjusted. Check the updated schedule.",
    time: "1 hour ago",
  },
  {
    id: "2",
    title: "New Recycling Guidelines",
    description:
      "We have updated our recycling guidelines to include new recyclable materials. Learn more to help improve waste management.",
    time: "3 hours ago",
  },
  {
    id: "3",
    title: "Community Cleanup Event",
    description:
      "Join us for the community cleanup event this Saturday. Volunteers are welcome, and refreshments will be provided.",
    time: "1 day ago",
  },
  {
    id: "4",
    title: "Illegal Dumping Report",
    description:
      "A recent illegal dumping report was resolved successfully. Thanks to those who contributed.",
    time: "2 days ago",
  },
];

const Notifications = () => {
  const [notifications] = useState(initialNotifications);

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      className="p-4 bg-white shadow-lg rounded-lg mb-4"
      onPress={() => console.log(`Notification Clicked: ${item.id}`)}
    >
      <Text className="text-lg font-bold text-primary mb-2">{item.title}</Text>
      <Text className="text-sm text-gray-700 mb-2">{item.description}</Text>
      <Text className="text-xs text-gray-500">{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ListHeaderComponent={() => (
          <Text className="text-2xl font-bold mb-4">Notifications</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Notifications;
