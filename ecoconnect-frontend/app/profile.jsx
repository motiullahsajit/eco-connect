import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy URL for fetching user data
    const apiUrl = "https://jsonplaceholder.typicode.com/users/1";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {userData && (
        <View>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Dummy image URL
            style={styles.image}
          />
          <Text style={styles.text}>Name: {userData.name}</Text>
          <Text style={styles.text}>Email: {userData.email}</Text>
          <Text style={styles.text}>Phone: {userData.phone}</Text>
          <Text style={styles.text}>Website: {userData.website}</Text>
          <Text style={styles.text}>Company: {userData.company.name}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default Profile;
