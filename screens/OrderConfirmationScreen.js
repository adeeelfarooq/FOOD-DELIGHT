"use client"

import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { MotiView } from 'moti'; // ✅ import Moti
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../lib/firebase";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderId } = route.params
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId))

        if (orderDoc.exists()) {
          const data = orderDoc.data()
          setOrderDetails({
            id: orderDoc.id,
            status: data.status || "Pending",
            totalAmount: data.totalAmount || 0,
            items: data.items || [],
            createdAt: data.createdAt,
          })
        } else {
          navigation.navigate("HomeTab")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, navigation])

  const deliveryTime = Math.floor(Math.random() * 20) + 25

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      {/* ✅ Wrap content in MotiView for fade-in */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
          </View>

          <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}>Thank You!</Text>

          <Text style={[styles.subtitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            Your order has been placed successfully
          </Text>

          <View style={[styles.orderDetails, { backgroundColor: isDark ? "#1f2937" : "#f9fafb" }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Order ID:</Text>
              <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>{orderId?.slice(0, 8)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Status:</Text>
              <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                {orderDetails?.status || "Pending"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Items:</Text>
              <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                {orderDetails?.items?.length || 0}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Total:</Text>
              <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                ${typeof orderDetails?.totalAmount === "number" ? orderDetails.totalAmount.toFixed(2) : "0.00"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Estimated Delivery:</Text>
              <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>{deliveryTime} minutes</Text>
            </View>
          </View>

          <Text style={[styles.message, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            Your delicious food is being prepared and will be on its way soon.
          </Text>

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ordersButton, { borderColor: isDark ? "#374151" : "#e5e7eb" }]}
            onPress={() => navigation.navigate("OrdersTab")}
          >
            <Text style={[styles.ordersButtonText, { color: isDark ? "#ffffff" : "#111827" }]}>View All Orders</Text>
          </TouchableOpacity>
        </View>
      </MotiView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  iconContainer: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: "center" },
  orderDetails: { width: "100%", borderRadius: 12, padding: 16, marginBottom: 24 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  detailLabel: { fontSize: 16 },
  detailValue: { fontSize: 16, fontWeight: "500" },
  message: { fontSize: 16, textAlign: "center", marginBottom: 32, paddingHorizontal: 20 },
  homeButton: { backgroundColor: "#f97316", borderRadius: 8, paddingVertical: 16, width: "100%", alignItems: "center", marginBottom: 12 },
  homeButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  ordersButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 16, width: "100%", alignItems: "center" },
  ordersButtonText: { fontSize: 16, fontWeight: "600" },
})
