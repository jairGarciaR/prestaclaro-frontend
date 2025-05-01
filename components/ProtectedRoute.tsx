// components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthService } from "../services/auth";
import { useNavigation } from "@react-navigation/native";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const verify = async () => {
      const isAuth = await AuthService.isAuthenticated();
      if (!isAuth) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } else {
        setLoading(false);
      }
    };
    verify();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return <>{children}</>;
}
