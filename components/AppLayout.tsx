// components/AppLayout.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const [drawerAnim] = useState(new Animated.Value(-width));
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerVisible(true));
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerVisible(false));
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (drawerVisible) {
            closeDrawer();
            return true;
          }
          return false; // permite navegación entre pantallas internas
        }
      );
      return () => backHandler.remove();
    }, [drawerVisible])
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Icon name="menu" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      {drawerVisible && (
        <Pressable style={styles.overlay} onPress={closeDrawer} />
      )}

      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#a855f7" />
          <Text style={styles.drawerText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
    elevation: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 5,
  },
});
