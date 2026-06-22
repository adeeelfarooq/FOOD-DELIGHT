"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"
import { useTheme } from "../context/ThemeContext"

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function FoodDetailScreen({ route, navigation }: any) {
  const { foodId } = route.params
  const [food, setFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { isDark } = useTheme()

  useEffect(() => {
    // Sample food items data
    const sampleFoodItems = [
      {
        id: "1",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
        price: 8.99,
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Burgers",
      },
      {
        id: "2",
        name: "Margherita Pizza",
        description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil",
        price: 12.99,
        image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Pizza",
      },
      {
        id: "3",
        name: "Chicken Caesar Salad",
        description: "Crisp romaine lettuce with grilled chicken, parmesan, and Caesar dressing",
        price: 9.99,
        image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Salads",
      },
      {
        id: "4",
        name: "Spicy Ramen Bowl",
        description: "Authentic Japanese ramen with spicy broth, egg, and tender pork",
        price: 11.99,
        image: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Asian",
      },
      {
        id: "5",
        name: "Chocolate Brownie Sundae",
        description: "Warm chocolate brownie topped with vanilla ice cream and hot fudge",
        price: 6.99,
        image: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Desserts",
      },
      {
        id: "6",
        name: "Veggie Wrap",
        description: "Fresh vegetables, hummus, and feta cheese wrapped in a spinach tortilla",
        price: 7.99,
        image: "https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Vegetarian",
      },
    ]

    // Find the food item with the matching ID
    const foundFood = sampleFoodItems.find((item) => item.id === foodId)

    if (foundFood) {
      setFood(foundFood)
    } else {
      toast({
        title: "Error",
        description: "Food item not found",
        type: "error",
      })
      navigation.goBack()
    }

    setIsLoading(false)
  }, [foodId, navigation, toast])

  const handleAddToCart = () => {
    if (food) {
      addToCart({
        ...food,
        quantity,
      })

      toast({
        title: "Added to cart",
        description: `${quantity} x ${food.name} added to your cart`,
        type: "success",
      })
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  if (!food) {
    return null
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#111827"} />
          </TouchableOpacity>
        </View>

        {/* Food Image */}
        <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />

        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: isDark ? "#ffffff" : "#111827" }]}>{food.name}</Text>
            <Text style={styles.price}>${food.price.toFixed(2)}</Text>
          </View>

          <Text style={[styles.description, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{food.description}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor: isDark ? "#374151" : "#e5e7eb" }]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={isDark ? "#ffffff" : "#111827"} />
              </TouchableOpacity>
              <Text style={[styles.quantity, { color: isDark ? "#ffffff" : "#111827" }]}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor: isDark ? "#374151" : "#e5e7eb" }]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={isDark ? "#ffffff" : "#111827"} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.totalPrice, { color: isDark ? "#ffffff" : "#111827" }]}>
              ${(food.price * quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f97316",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  addButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
})
