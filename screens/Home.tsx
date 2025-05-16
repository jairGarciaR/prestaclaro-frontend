// screens/Home.tsx
import React, { useCallback } from "react";
import { View, Text, StyleSheet, Image, BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HomeScreen() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>INICIO</Text>
          </View>

          <Image
            source={require("../assets/logo_banco_bienestar.jpeg")}
            style={styles.logo}
          />

          <Text style={styles.description}>
            TE DAMOS LA BIENVENIDA A LA PÁGINA PRINCIPAL DE BANCO PROSPERA DONDE
            PODRÁS COTIZAR TODO TIPO DE PRÉSTAMOS A INTERESES MUY BAJOS. ¿QUÉ
            ESPERAS?
          </Text>

          <BottomNavbar onNavigate={(screen) => navigation.navigate(screen)} />
        </View>
      </AppLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  header: {
    backgroundColor: "#c4b5fd",
    width: "100%",
    paddingVertical: 64,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 24,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  description: {
    color: "#581c87",
    fontSize: 30,
    textAlign: "center",
    lineHeight: 32,
    textTransform: "uppercase",
    paddingHorizontal: 10,
  },
});
