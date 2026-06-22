"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { useTheme } from "../context/ThemeContext"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../lib/firebase"

export default function CartScreen({ navigation }: any) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const { isDark } = useTheme()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before placing an order",
        type: "error",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      // Format items for Firestore
      const orderItems = cartItems.map((item) => ({
        foodItem: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description || "",
          category: item.category || "Other",
        },
        quantity: item.quantity,
      }))

      // Save the order to Firestore
      const orderData = {
        userId: user?.uid,
        items: orderItems,
        totalAmount: cartTotal + 2.99, // Including delivery fee
        status: "Pending",
        createdAt: serverTimestamp(),
        deliveryAddress: null, // You can add address functionality later
      }

      const orderRef = await addDoc(collection(db, "orders"), orderData)
      const orderId = orderRef.id

      // Clear the cart
      clearCart()

      // Navigate to order confirmation
      navigation.navigate("OrderConfirmation", { orderId })
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        type: "error",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}>Your Cart</Text>
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
              <View key={item.id} style={[styles.cartItem, { borderBottomColor: isDark ? "#374151" : "#e5e7eb" }]}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: isDark ? "#ffffff" : "#111827" }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, { borderColor: isDark ? "#374151" : "#e5e7eb" }]}
                    onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Ionicons name="remove" size={16} color={isDark ? "#ffffff" : "#111827"} />
                  </TouchableOpacity>
                  <Text style={[styles.quantity, { color: isDark ? "#ffffff" : "#111827" }]}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={[styles.quantityButton, { borderColor: isDark ? "#374151" : "#e5e7eb" }]}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={isDark ? "#ffffff" : "#111827"} />
                  </TouchableOpacity>
                </View>
                <View style={styles.itemActions}>
                  <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.orderSummary, { borderTopColor: isDark ? "#374151" : "#e5e7eb" }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDark ? "#ffffff" : "#111827" }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                ${cartTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDark ? "#ffffff" : "#111827" }]}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, { color: isDark ? "#ffffff" : "#111827" }]}>$2.99</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: isDark ? "#ffffff" : "#111827" }]}>Total</Text>
              <Text style={styles.totalValue}>${(cartTotal + 2.99).toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.placeOrderButton, isPlacingOrder && styles.disabledButton]}
              onPress={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.placeOrderText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color={isDark ? "#374151" : "#d1d5db"} />
          <Text style={[styles.emptyCartText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Your cart is empty</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#6b7280",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    width: 30,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  itemActions: {
    alignItems: "flex-end",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f97316",
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
  orderSummary: {
    padding: 16,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  placeOrderButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyCartText: {
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
