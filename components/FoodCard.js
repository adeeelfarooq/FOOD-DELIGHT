"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"

export default function FoodCard({ item, onPress, isDark }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = () => {
    addToCart({
      ...item,
      quantity: 1,
    })

    showToast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
      type: "success",
    })
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? "#1f2937" : "#ffffff" }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {item && item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="image-outline" size={48} color="#9ca3af" />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.description, { color: isDark ? "#9ca3af" : "#6b7280" }]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={16} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '47%',
  },
  image: {
    width: "100%",
    height: 150,
    aspectRatio: 1,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    height: 36,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f97316",
    marginTop: 2,
  },
  addButton: {
    marginTop: 4,
    backgroundColor: "#f97316",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
  },
})