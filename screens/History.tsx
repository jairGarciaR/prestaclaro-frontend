// screens/History.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { AuthService } from "../services/auth";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function HistoryScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchQuotes = async () => {
    const userId = await AuthService.getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `http://192.168.0.17:3000/api/simulaciones?userId=${userId}`
      );
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error("Error al obtener cotizaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(
        `http://192.168.0.17:3000/api/simulaciones/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        setModalVisible(false);
      } else {
        Alert.alert("Error", "No se pudo eliminar la cotización");
      }
    } catch (err) {
      console.error("Error al eliminar cotización", err);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.itemBox}
      onPress={() => {
        setSelectedQuote(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.itemText}>Monto: $ {item.amount}</Text>
      <Text style={styles.itemText}>Meses: {item.months}</Text>
      <Text style={styles.itemText}>Mensualidad: $ {item.monthlyFee}</Text>
      <Text style={styles.itemText}>Total: $ {item.totalToPay}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/Fondo_detalles.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.header}>HISTORIAL</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#a78bfa"
              style={{ marginTop: 50 }}
            />
          ) : quotes.length === 0 ? (
            <Text style={styles.noData}>No hay cotizaciones registradas.</Text>
          ) : (
            <FlatList
              data={quotes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedQuote && (
                <>
                  <Text style={styles.modalTitle}>
                    Detalle de la Cotización
                  </Text>
                  <Text style={styles.modalText}>
                    Monto: $ {selectedQuote.amount}
                  </Text>
                  <Text style={styles.modalText}>
                    Meses: {selectedQuote.months}
                  </Text>
                  <Text style={styles.modalText}>
                    Mensualidad: $ {selectedQuote.monthlyFee}
                  </Text>
                  <Text style={styles.modalText}>
                    Total: $ {selectedQuote.totalToPay}
                  </Text>
                  <Text style={styles.modalText}>
                    Fecha:{" "}
                    {new Date(selectedQuote.createdAt).toLocaleDateString()}
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(selectedQuote.id)}
                    >
                      <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Cerrar</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    height,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  noData: {
    fontSize: 16,
    color: "#581c87",
    textAlign: "center",
    marginTop: 50,
  },
  itemBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#581c87",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: "#a78bfa",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
