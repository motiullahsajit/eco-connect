import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialArticles = [
  {
    id: "1",
    title: "Composting Techniques",
    description: "Learn how to compost at home with simple techniques.",
    image: "https://via.placeholder.com/400x300",
    type: "Article",
    content: "Composting is a great way to reduce waste...",
  },
  {
    id: "2",
    title: "Recycling Guidelines",
    description: "Understand and follow effective recycling guidelines.",
    image: "https://via.placeholder.com/400x300",
    type: "Infographic",
    content: "Recycling involves separating waste materials...",
  },
  {
    id: "3",
    title: "Waste Management Practices",
    description: "Best practices for effective waste management.",
    image: "https://via.placeholder.com/400x300",
    type: "Video",
    content: "Watch this video to learn about waste management...",
  },
  {
    id: "4",
    title: "Quizzes on Waste Management",
    description: "Test your knowledge with our waste management quiz.",
    image: "https://via.placeholder.com/400x300",
    type: "Quiz",
    content: "Take this quiz to assess your knowledge on waste management...",
  },
];

const EcoHub = () => {
  const [articles] = useState(initialArticles);

  const handleShare = (title, content) => {
    // Logic for sharing content (e.g., using Expo Sharing API)
    // Placeholder function
    alert(`Sharing: ${title}\n\n${content}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center mb-6">
          <Text className="text-md text-gray-100">
            Educational Resources on Waste Management
          </Text>
        </View>

        <View className="space-y-6">
          {articles.map((article) => (
            <View
              key={article.id}
              className="bg-white p-5 rounded-2xl shadow-lg"
            >
              <Image
                source={{ uri: article.image }}
                className="w-full h-40 mb-3 rounded-2xl"
                resizeMode="cover"
              />
              <View className="mb-4">
                <Text className="text-2xl font-bold text-primary mb-1">
                  {article.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {article.description}
                </Text>
                <Text className="text-xs bg-secondary text-white px-2 py-1 rounded-full w-max">
                  {article.type}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleShare(article.title, article.content)}
                className="bg-primary p-2 rounded-lg shadow-md"
              >
                <Text className="text-center text-white font-bold">Share</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EcoHub;
