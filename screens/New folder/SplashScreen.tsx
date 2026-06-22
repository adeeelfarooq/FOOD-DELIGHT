"use client"
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native"
import { useTheme } from "../context/ThemeContext"

export default function SplashScreen() {
  const { isDark } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#111827" : "#fff7ed" }]}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={[styles.title, { color: isDark ? "#f97316" : "#f97316" }]}>FoodDelight</Text>
      <Text style={[styles.subtitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Delicious food at your doorstep</Text>
      <ActivityIndicator size="large" color="#f97316" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
})
