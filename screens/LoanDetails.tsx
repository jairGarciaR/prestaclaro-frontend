import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { AuthService } from "../services/auth";
import { useEffect } from "react";

const { height } = Dimensions.get("window");

export default function LoanDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { amount, selectedTerm, total } = route.params || {};

  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";
  const monthlyPayment = total / selectedTerm;
  const formattedMonthly = monthlyPayment.toFixed(2);
  const formattedTotal = total.toFixed(2);

  const lottieRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    if (animationDone && postSuccess) {
      const timeout = setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [animationDone, postSuccess]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userId = await AuthService.getUserId();
      if (!userId) {
        alert("Sesión expirada, inicia sesión de nuevo.");
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }

      const payload = {
        userId,
        amount: parseFloat(formattedAmount),
        months: selectedTerm,
        monthlyFee: parseFloat(formattedMonthly),
        totalToPay: parseFloat(formattedTotal),
      };

      const response = await fetch("http://192.168.0.17:3000/api/simulador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setPostSuccess(true);
      } else {
        alert("No se pudo guardar la cotización.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la cotización.");
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/Fondo_detalles.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.header}>DETALLES</Text>
          <Text style={styles.header}>DE LA</Text>
          <Text style={styles.header}>COTIZACIÓN</Text>

          {isLoading ? (
            <View style={styles.lottieContainer}>
              <LottieView
                ref={lottieRef}
                source={require("../assets/animations/Cotizacion-guardada.json")}
                autoPlay
                loop={false}
                style={{ width: 300, height: 300 }}
                onAnimationFinish={() => {
                  setAnimationDone(true);
                }}
              />
              <Text style={styles.loadingText}>Guardando cotización...</Text>
            </View>
          ) : (
            <View style={styles.detailsBox}>
              <Text style={styles.label}>MONTO SOLICITADO</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="dollar"
                  size={18}
                  color="#581c87"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={formattedAmount}
                  placeholder="0.00"
                  placeholderTextColor="#581c87"
                  textAlign="center"
                />
              </View>

              <Text style={styles.label}>CANTIDAD A PAGAR POR MES</Text>
              <View style={styles.inputWrapperblank}>
                <Icon
                  name="dollar"
                  size={18}
                  color="#581c87"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={formattedMonthly}
                  placeholder="0.00"
                  placeholderTextColor="#581c87"
                />
              </View>

              <View style={styles.row}>
                <Icon
                  name="calendar"
                  size={24}
                  color="#581c87"
                  style={styles.iconLeft}
                />
                <TextInput
                  style={styles.inputMeses}
                  editable={false}
                  value={`${selectedTerm}`}
                />
                <Text style={styles.labelMeses}>MESES</Text>
              </View>

              <Text style={styles.label}>TOTAL A PAGAR</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="dollar"
                  size={18}
                  color="#581c87"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={formattedTotal}
                  placeholder="0.00"
                  placeholderTextColor="#581c87"
                  textAlign="center"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>

      <BottomNavbar onNavigate={(screen) => navigation.navigate(screen)} />
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
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  detailsBox: {
    width: "88%",
    backgroundColor: "#f1f5f9",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#581c87",
    marginTop: 16,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#a78bfa",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8b4fe",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    width: "75%",
  },
  inputWrapperblank: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    width: "50%",
  },
  icon: {
    marginLeft: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#581c87",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  iconLeft: {
    marginRight: 10,
  },
  inputMeses: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  labelMeses: {
    marginLeft: 10,
    fontSize: 16,
    color: "#581c87",
    letterSpacing: 1,
  },
  lottieContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#581c87",
    fontWeight: "bold",
    marginTop: 12,
  },
});
