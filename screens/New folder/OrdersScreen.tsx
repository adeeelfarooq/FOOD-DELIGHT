"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { formatDistanceToNow } from "date-fns"

interface FoodItem {
  category: string
  description: string
  id: string
  image: string
  name: string
  price: number
}

interface OrderItem {
  foodItem: FoodItem
  quantity: number
}

interface Order {
  id: string
  createdAt: any
  deliveryAddress: string | null
  items: OrderItem[]
  status: string
  totalAmount: number
  userId?: string
}

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        // Create a query against the orders collection
        const ordersRef = collection(db, "orders")
        const q = query(ordersRef, orderBy("createdAt", "desc"))

        // Execute the query
        const querySnapshot = await getDocs(q)

        // Map the documents to our Order interface
        const fetchedOrders: Order[] = []
        querySnapshot.forEach((doc) => {
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
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#10b981" // green
      case "processing":
        return "#3b82f6" // blue
      case "cancelled":
        return "#ef4444" // red
      default:
        return "#f59e0b" // yellow/amber
    }
  }

  // Format the timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Recently"

    try {
      // Handle Firestore timestamp
      if (typeof timestamp.toDate === "function") {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
      }

      // Handle date objects
      if (timestamp instanceof Date) {
        return formatDistanceToNow(timestamp, { addSuffix: true })
      }

      // Handle timestamps stored as strings or numbers
      if (typeof timestamp === "string" || typeof timestamp === "number") {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
      }

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
          renderItem={({ item }) => (
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
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                  style={styles.timeIcon}
                />
                <Text style={[styles.timeText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
                  {formatTimestamp(item.createdAt)}
                </Text>
              </View>
              <View style={[styles.orderDetails, { borderTopColor: isDark ? "#374151" : "#e5e7eb" }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Items</Text>
                  <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                    {item.items?.length || 0}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Total</Text>
                  <Text style={[styles.detailValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                    ${typeof item.totalAmount === "number" ? item.totalAmount.toFixed(2) : "0.00"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-handle-outline" size={64} color={isDark ? "#374151" : "#d1d5db"} />
          <Text style={[styles.emptyText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            You haven't placed any orders yet
          </Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ordersList: {
    padding: 16,
  },
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  orderTime: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
  },
  orderDetails: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 16,
  },
  browseButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
})
