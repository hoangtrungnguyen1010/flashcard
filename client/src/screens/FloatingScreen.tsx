import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FloatingScreen = () => {
  return (
    <View style={styles.floatingContainer}>
      <Text style={styles.text}>This is a Floating Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    top: 100,
    left: 50,
    width: 200,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FloatingScreen;
