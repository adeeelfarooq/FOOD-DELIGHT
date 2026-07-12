"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase.native"
import { useToast } from "../context/ToastContext"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

// 🚀 Moti imports
import { MotiView, MotiText } from "moti"

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* 🚀 App Logo + Name */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800 }}
            style={styles.brandContainer}
          >
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 200, duration: 600 }}
              style={styles.brandName}
            >
              FOODDELIGHT
            </MotiText>
            <Text style={[styles.brandSubtitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
              Welcome back!
            </Text>
          </MotiView>

          {/* Header (Sign In text + Theme toggle) */}
          <View style={styles.header}>
            <MotiText
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 400, duration: 600 }}
              style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}
            >
              Sign In
            </MotiText>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={24}
                color={isDark ? "#ffffff" : "#111827"}
              />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, duration: 600 }}
            style={[styles.description, { color: isDark ? "#9ca3af" : "#6b7280" }]}
          >
            Enter your email and password to access your account
          </MotiText>

          {/* Form */}
          <View style={styles.form}>
            {/* Email input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 750, duration: 600 }}
              style={styles.inputGroup}
            >
              <Text style={[styles.label, { color: isDark ? "#ffffff" : "#111827" }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                    color: isDark ? "#ffffff" : "#111827",
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                  },
                ]}
                placeholder="your.email@example.com"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </MotiView>

            {/* Password input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 900, duration: 600 }}
              style={styles.inputGroup}
            >
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: isDark ? "#ffffff" : "#111827" }]}>Password</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                    color: isDark ? "#ffffff" : "#111827",
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </MotiView>

            {/* Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1100, type: "spring" }}
            >
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Sign In</Text>}
              </TouchableOpacity>
            </MotiView>

            {/* Footer */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1300, duration: 600 }}
              style={styles.footer}
            >
              <Text style={[styles.footerText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: "center" },

  // 🚀 Brand styles
  brandContainer: { alignItems: "center", marginBottom: 32 },
  logo: { width: 90, height: 90, marginBottom: 12 },
  brandName: { fontSize: 26, fontWeight: "bold", color: "#f97316", letterSpacing: 2 },
  brandSubtitle: { fontSize: 16, marginTop: 4 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold" },
  themeToggle: { padding: 8 },
  description: { fontSize: 16, marginBottom: 24 },
  form: { width: "100%" },
  inputGroup: { marginBottom: 20 },
  labelContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  forgotPassword: { fontSize: 14, color: "#f97316" },
  input: { width: "100%", height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, fontSize: 16 },
  button: { backgroundColor: "#f97316", height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, color: "#f97316", fontWeight: "500" },
})
