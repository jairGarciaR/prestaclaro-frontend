// screens/Splash.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../services/auth";
import LottieView from "lottie-react-native";

export default function SplashScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/Pago-movil.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={async () => {
          const isAuth = await AuthService.isAuthenticated();
          navigation.reset({
            index: 0,
            routes: [{ name: isAuth ? "Home" : "Login" }],
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  animation: {
    width: 800,
    height: 800,
  },
});
