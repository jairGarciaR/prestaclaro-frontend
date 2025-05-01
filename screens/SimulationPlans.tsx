// screens/SimulationPlans.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import BottomNavbar from "../components/BottomNavbar";

const { height } = Dimensions.get("window");
const INTEREST_RATE = 0.02;
const TERMS = [1, 3, 6, 9, 12, 18, 24];

export default function SimulationPlansScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const amount = route.params?.amount ? parseFloat(route.params.amount) : 0;

  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [installments, setInstallments] = useState<{
    [term: number]: { total: number; interest: number };
  }>({});

  useEffect(() => {
    const newInstallments: {
      [term: number]: { total: number; interest: number };
    } = {};

    TERMS.forEach((term) => {
      const r = INTEREST_RATE;
      const cuota = (amount * r) / (1 - Math.pow(1 + r, -term));
      const total = cuota * term;
      const interest = total - amount;

      newInstallments[term] = {
        total: parseFloat(total.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
      };
    });

    setInstallments(newInstallments);
  }, [amount]);

  const handleNext = () => {
    if (selectedTerm) {
      const total = installments[selectedTerm].total;
      const monthlyPayment = total / selectedTerm;

      navigation.navigate("LoanDetails", {
        amount,
        selectedTerm,
        monthlyPayment,
        total,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SIMULACIÓN</Text>

      <View style={styles.box}>
        <Text style={styles.title}>Elige un plan</Text>

        {TERMS.map((term) => (
          <View key={term} style={styles.rowWrapper}>
            <View style={styles.row}>
              <RadioButton
                value={term.toString()}
                status={selectedTerm === term ? "checked" : "unchecked"}
                onPress={() => setSelectedTerm(term)}
                color="#581c87"
              />
              <Text style={styles.label}>
                {term} mensualidad{term > 1 ? "es" : ""}
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                value={`$${installments[term]?.total.toFixed(2) || ""}`}
              />
            </View>
            <Text style={styles.interestText}>
              Interés: ${installments[term]?.interest.toFixed(2) || ""}
            </Text>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <BottomNavbar onNavigate={(screen) => navigation.navigate(screen)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#a78bfa",
    width: "100%",
    textAlign: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  box: {
    width: "90%",
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 16,
  },
  rowWrapper: {
    marginBottom: 14,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#581c87",
    flex: 1,
  },
  input: {
    width: 110,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    color: "#581c87",
    backgroundColor: "#fff",
  },
  interestText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "right",
    marginRight: 4,
  },
  button: {
    backgroundColor: "#a78bfa",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 32,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
