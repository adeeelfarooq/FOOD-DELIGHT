"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { useTheme } from "../context/ThemeContext"
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { isDark } = useTheme()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (!user) {
      showToast({
        title: "Login Required",
        description: "You need to log in before placing an order.",
        type: "error",
      })
      navigation.navigate("Login")
      return
    }

    if (cartItems.length === 0) {
      showToast({
        title: "Empty Cart",
        description: "Add some items to your cart before placing an order.",
        type: "error",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          phone: "",
          address: { street: "", city: "", state: "", postalCode: "" },
        })

        showToast({
          title: "Profile Incomplete",
          description: "Please update your address and phone number in Settings.",
          type: "warning",
        })
        navigation.navigate("Settings")
        setIsPlacingOrder(false)
        return
      }

      const userData = userDoc.data()

      if (!userData?.phone || !userData?.address?.street) {
        showToast({
          title: "Missing Info",
          description: "Please update your delivery address and phone number in Settings.",
          type: "warning",
        })
        navigation.navigate("Settings")
        setIsPlacingOrder(false)
        return
      }

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

      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "Customer",
        phone: userData.phone,
        items: orderItems,
        totalAmount: cartTotal + 2.99,
        status: "Pending",
        createdAt: serverTimestamp(),
        deliveryAddress: {
          ...userData.address,
          fullAddress: `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.postalCode}`,
        },
      }

      const orderRef = await addDoc(collection(db, "orders"), orderData)
      const orderId = orderRef.id

      clearCart()
      showToast({
        title: "Order Placed",
        description: "Your order was placed successfully!",
        type: "success",
      })
      navigation.navigate("OrderConfirmation", { orderId })
    } catch (error) {
      console.error("Error placing order:", error)
      showToast({
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
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}>
          Your Cart
        </Text>
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
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? "#ffffff" : "#111827" }]}>
                Subtotal:
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                ${cartTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? "#ffffff" : "#111827" }]}>
                Delivery Fee:
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                $2.99
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? "#ffffff" : "#111827" }]}>
                Total:
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? "#ffffff" : "#111827" }]}>
                ${parseFloat(cartTotal.toFixed(2)) + 2.99}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.placeOrderButton, { backgroundColor: isDark ? "#ffffff" : "#111827" }]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color={isDark ? "#111827" : "#ffffff"} />
            ) : (
              <Text style={[styles.placeOrderText, { color: isDark ? "#111827" : "#ffffff" }]}>
                Place Order
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <Text style={[styles.emptyText, { color: isDark ? "#ffffff" : "#111827" }]}>
            Your cart is empty
          </Text>
          <TouchableOpacity
            style={[styles.continueShoppingButton, { backgroundColor: isDark ? "#ffffff" : "#111827" }]}
            onPress={() => navigation.navigate("HomeTab")}
          >
            <Text style={[styles.continueShoppingText, { color: isDark ? "#111827" : "#ffffff" }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 24, fontWeight: "bold" },
  cartItems: { flex: 1 },
  cartItem: { flexDirection: "row", padding: 16, borderBottomWidth: 1 },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 16 },
  itemName: { fontSize: 16, fontWeight: "500" },
  itemPrice: { fontSize: 14, color: "#6B7280" },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  quantityButton: { borderWidth: 1, borderRadius: 4, padding: 8, marginHorizontal: 4 },
  totalSection: { padding: 16, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 16, fontWeight: "500" },
  placeOrderButton: { padding: 16, alignItems: "center", borderRadius: 8, margin: 16 },
  placeOrderText: { fontSize: 16, fontWeight: "bold" },
  emptyCart: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  emptyText: { fontSize: 18, marginBottom: 16 },
  continueShoppingButton: { padding: 12, borderRadius: 8 },
  continueShoppingText: { fontSize: 16, fontWeight: "500" },
})
