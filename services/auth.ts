// services/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const EXPIRATION_KEY = "token_expiration";

export const AuthService = {
  async saveToken(token: string) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      const decoded: any = jwtDecode(token);
      if (decoded.exp) {
        const expirationDate = new Date(decoded.exp * 1000).toISOString();
        await AsyncStorage.setItem(EXPIRATION_KEY, expirationDate);
      }
    } catch (e) {
      console.error("Error al guardar el token", e);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error("Error al obtener el token", e);
      return null;
    }
  },

  async getUserId(): Promise<string | null> {
    const token = await this.getToken();
    if (!token) {
      console.log("No hay token en storage.");
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expirado.");
        await this.removeToken();
        return null;
      }

      if (!decoded.userId) {
        console.log("userId no existe en el token.");
        return null;
      }

      return decoded.userId;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        await this.removeToken();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async getTokenExpiration(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(EXPIRATION_KEY);
    } catch (e) {
      console.error("Error al obtener expiración", e);
      return null;
    }
  },
};
