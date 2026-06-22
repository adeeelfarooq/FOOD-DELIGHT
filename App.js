import "react-native-get-random-values";

import { NavigationContainer } from "@react-navigation/native";


import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import MainNavigator from "./navigation/MainNavigator";

export default function App() {
  return (

    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <NavigationContainer>
                <MainNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}