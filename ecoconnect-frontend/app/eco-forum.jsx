import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialThreads = [
  {
    id: "1",
    title: "Successful Waste Management Stories",
    tags: ["Success", "Waste Management"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKr_wYt6R7Qd28Cj49YTmz0FvvnNZXLwEm3AMQHrXbfg&s",
    body: "Share your stories about successful waste management practices.",
    posts: [
      {
        id: "p1",
        author: "Alice",
        content: "We reduced waste by 30% with composting.",
      },
      {
        id: "p2",
        author: "Bob",
        content: "Our community has a weekly clean-up event.",
      },
    ],
  },
  {
    id: "2",
    title: "Tips for Effective Recycling",
    tags: ["Recycling", "Tips"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aupCX7vL3oUvKL2e6NEDL5rPk7djcVZ4RZi2m4VUHg&s",
    body: "Discuss and share effective recycling tips.",
    posts: [
      { id: "p3", author: "Charlie", content: "Separate plastics and metals." },
      {
        id: "p4",
        author: "Dana",
        content: "Rinse containers before recycling.",
      },
    ],
  },
];

const EcoForum = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadTags, setNewThreadTags] = useState("");
  const [newThreadBody, setNewThreadBody] = useState("");
  const [newThreadImage, setNewThreadImage] = useState("");
  const [replies, setReplies] = useState({});

  const addThread = () => {
    if (!newThreadTitle || !newThreadTags || !newThreadBody || !newThreadImage)
      return;

    const newThread = {
      id: (threads.length + 1).toString(),
      title: newThreadTitle,
      tags: newThreadTags.split(",").map((tag) => tag.trim()),
      image: newThreadImage || "https://via.placeholder.com/400x300",
      body: newThreadBody,
      posts: [],
    };

    setThreads([...threads, newThread]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setNewThreadTitle("");
    setNewThreadTags("");
    setNewThreadBody("");
    setNewThreadImage("");
  };

  const handleReplyChange = (threadId, text) => {
    setReplies({ ...replies, [threadId]: text });
  };

  const addReply = (threadId) => {
    const replyText = replies[threadId];

    if (replyText) {
      const updatedThreads = threads.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            posts: [
              ...thread.posts,
              {
                id: `p${thread.posts.length + 1}`,
                author: "You",
                content: replyText,
              },
            ],
          };
        }
        return thread;
      });

      setThreads(updatedThreads);
      setReplies({ ...replies, [threadId]: "" });
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <ScrollView className="mb-4">
        {threads.map((thread) => (
          <View
            key={thread.id}
            className="mb-6 bg-white p-5 rounded-2xl shadow-lg"
          >
            <Image
              source={{ uri: thread.image }}
              className="w-full h-40 mb-3 rounded-2xl"
              resizeMode="cover"
            />
            <View className="mb-4">
              <Text className="text-2xl font-bold text-primary mb-1">
                {thread.title}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {thread.tags.map((tag, index) => (
                  <Text
                    key={index}
                    className="text-xs bg-secondary text-white px-2 py-1 rounded-full"
                  >
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
            <Text className="text-sm text-gray-800 mb-3">{thread.body}</Text>
            {thread.posts.map((post) => (
              <View key={post.id} className="mb-2 bg-gray-100 p-3 rounded-lg">
                <Text className="font-bold mb-1">{post.author}</Text>
                <Text className="text-sm text-gray-700">{post.content}</Text>
              </View>
            ))}
            <View className="flex-row items-center space-x-2 mb-3">
              <TextInput
                value={replies[thread.id] || ""}
                onChangeText={(text) => handleReplyChange(thread.id, text)}
                placeholder="Type your reply..."
                className="flex-1 bg-gray-100 p-2 rounded-lg"
              />
              <TouchableOpacity
                onPress={() => addReply(thread.id)}
                className="bg-primary p-2 rounded-lg shadow-md"
              >
                <Text className="text-center text-white font-bold">Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-secondary p-3 rounded-lg shadow-md"
      >
        <Text className="text-center text-white font-bold">Add Post</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Add New Post</Text>
            <TextInput
              placeholder="Post Title"
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <TextInput
              placeholder="Tags (comma-separated)"
              value={newThreadTags}
              onChangeText={setNewThreadTags}
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <TextInput
              placeholder="Image URL"
              value={newThreadImage}
              onChangeText={setNewThreadImage}
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <TextInput
              placeholder="Post Content"
              value={newThreadBody}
              onChangeText={setNewThreadBody}
              multiline
              className="bg-gray-100 p-3 mb-3 rounded-lg"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 p-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addThread}
                className="bg-primary p-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EcoForum;
