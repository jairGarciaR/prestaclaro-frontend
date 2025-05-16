// screens/Login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../services/auth";
import LottieView from "lottie-react-native";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Campos requeridos", "Completa todos los campos.");
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.17:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AuthService.saveToken(data.token);

        // navegación se moverá a Home después de animación
      } else {
        setLoading(false);
        Alert.alert("Error", data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require("../assets/animations/Pago-movil.json")}
          autoPlay
          loop={false}
          style={{ width: 400, height: 400, marginBottom: 20 }}
          onAnimationFinish={() =>
            navigation.reset({ index: 0, routes: [{ name: "Home" }] })
          }
        />
        <Text style={styles.loading}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BANCO{"\n"}PROSPERA</Text>

      <Image
        source={require("../assets/logo_banco_bienestar.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#fff"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password.trim()}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#fff"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}> ¿No tienes una cuenta? Regístrate </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 24,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 24,
  },
  input: {
    width: "80%",
    padding: 14,
    marginVertical: 8,
    backgroundColor: "#a78bfa",
    borderRadius: 50,
    paddingLeft: 20,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#a78bfa",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 50,
    marginTop: 16,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#7c3aed",
    marginTop: 16,
    textDecorationLine: "underline",
  },
  loading: {
    fontSize: 20,
    color: "#581c87",
    marginTop: 12,
  },
});
