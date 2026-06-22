"use client"
import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"

export default function SplashScreen() {
  const { isDark } = useTheme()

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate logo (scale up)
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start()

    // Animate text (fade in)
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#111827" : "#fff7ed" }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        {/* Using a free food logo from internet */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" }} // 🍔 Food logo
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.title, { color: "#f97316", opacity: textOpacity }]}>
        FOODDELIGHT
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { color: isDark ? "#9ca3af" : "#6b7280", opacity: textOpacity }]}>
        Delicious food at your doorstep
      </Animated.Text>

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
    width: 130,
    height: 130,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
})
