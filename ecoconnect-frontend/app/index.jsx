import { Link } from "expo-router";
import React from "react";
import { View, StyleSheet, Text } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Hello world!!</Text>
      <Link href="/profile" style={{ color: "black" }}>
        Go To Profile
      </Link>
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
});

export default App;
