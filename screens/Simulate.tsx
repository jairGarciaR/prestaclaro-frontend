// screens/Simulate.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardEvent,
  Dimensions,
} from "react-native";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function SimulateScreen() {
  const [amount, setAmount] = useState("");
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../assets/Fondo_cotizaciones.jpeg")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.staticContent}>
            <Text style={styles.header}>COTIZACIÓN</Text>

            <View style={styles.box}>
              <Text style={styles.label}>CANTIDAD DESEADA</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.symbol}>$</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("SimulationPlans", { amount })
                }
              >
                <Text style={styles.buttonText}>Cotizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>

      {!keyboardVisible && (
        <BottomNavbar onNavigate={(screen) => navigation.navigate(screen)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: height,
  },
  scrollContainer: {
    minHeight: height,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 100,
  },
  box: {
    width: "88%",
    backgroundColor: "#f1f5f9",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    letterSpacing: 2,
    color: "#581c87",
    marginBottom: 16,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a78bfa",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  symbol: {
    fontSize: 24,
    color: "#581c87",
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: "white",
  },
  button: {
    backgroundColor: "#a78bfa",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  staticContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 100,
  },
});
