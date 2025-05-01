// components/BottomNavbar.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  onNavigate?: (screen: string) => void;
}

const BottomNavbar: React.FC<Props> = ({ onNavigate }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => onNavigate?.("Home")}>
        <Icon name="home-outline" size={44} color="#a855f7" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate?.("Simulate")}>
        <Icon name="cash-outline" size={44} color="#a855f7" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate?.("History")}>
        <Icon name="book-outline" size={44} color="#a855f7" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 12,
    zIndex: 10,
    elevation: 10,
  },
});

export default BottomNavbar;
