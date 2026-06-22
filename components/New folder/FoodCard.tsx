"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface FoodCardProps {
  food: FoodItem
  onPress: () => void
  isDark: boolean
}

export default function FoodCard({ food, onPress, isDark }: FoodCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart({
      ...food,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${food.name} added to your cart`,
      type: "success",
    })
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? "#1f2937" : "#ffffff" }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={[styles.description, { color: isDark ? "#9ca3af" : "#6b7280" }]} numberOfLines={2}>
              {food.description}
            </Text>
          </View>
          <Text style={styles.price}>${food.price.toFixed(2)}</Text>
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
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
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
    fontSize: 14,
    lineHeight: 20,
    height: 40,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f97316",
  },
  addButton: {
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
