"use client"

import { Ionicons } from "@expo/vector-icons"
import { formatDistanceToNow } from "date-fns"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore" // ✅ use onSnapshot
import { MotiView } from "moti"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { db } from "../lib/firebase.native"

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    if (!user) return

    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, orderBy("createdAt", "desc"))

    // ✅ Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        fetchedOrders.push({
          id: doc.id,
          createdAt: data.createdAt,
          deliveryAddress: data.deliveryAddress,
          items: data.items || [],
          status: data.status || "Pending",
          totalAmount: data.totalAmount || 0,
          userId: data.userId,
        })
      })
      setOrders(fetchedOrders)
      setIsLoading(false)
    }, (error) => {
      console.error("Error fetching orders:", error)
      setIsLoading(false)
    })

    return () => unsubscribe() // Cleanup listener on unmount
  }, [user])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "#10b981"
      case "processing": return "#3b82f6"
      case "cancelled": return "#ef4444"
      default: return "#f59e0b"
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recently"
    try {
      if (typeof timestamp.toDate === "function") return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
      if (timestamp instanceof Date) return formatDistanceToNow(timestamp, { addSuffix: true })
      if (typeof timestamp === "string" || typeof timestamp === "number") return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
      return "Recently"
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Recently"
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}>Your Orders</Text>
      </View>

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: index * 120 }}
            >
              <TouchableOpacity
                style={[styles.orderCard, { backgroundColor: isDark ? "#1f2937" : "#ffffff" }]}
                onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
                activeOpacity={0.7}
              >
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderId, { color: isDark ? "#ffffff" : "#111827" }]}>
                    Order #{item.id.slice(0, 8)}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.orderTime}>
                  <Ionicons name="time-outline" size={16} color={isDark ? "#9ca3af" : "#6b7280"} style={styles.timeIcon} />
                  <Text style={[styles.timeText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
                    {formatTimestamp(item.createdAt)}
                  </Text>
                </View>
                <View style={[styles.orderDetails, { borderTopColor: isDark ? "#374151" : "#e5e7eb" }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Items</Text>
                    <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>{item.items?.length || 0}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Total</Text>
                    <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                      ${typeof item.totalAmount === "number" ? item.totalAmount.toFixed(2) : "0.00"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          )}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.emptyContainer}
        >
          <Ionicons name="bag-handle-outline" size={64} color={isDark ? "#374151" : "#d1d5db"} />
          <Text style={[styles.emptyText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            You haven't placed any orders yet
          </Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </MotiView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 20, fontWeight: "bold" },
  ordersList: { padding: 16 },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: "600" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#ffffff", fontSize: 12, fontWeight: "500" },
  orderTime: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  timeIcon: { marginRight: 4 },
  timeText: { fontSize: 14 },
  orderDetails: { borderTopWidth: 1, paddingTop: 12 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: "500" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  emptyText: { fontSize: 18, marginVertical: 16 },
  browseButton: { backgroundColor: "#f97316", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  browseButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "500" },
})
