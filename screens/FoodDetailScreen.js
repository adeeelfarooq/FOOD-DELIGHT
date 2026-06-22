"use client"

import { Ionicons } from "@expo/vector-icons"
import { MotiText, MotiView } from "moti"
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useCart } from "../context/CartContext"
import { useTheme } from "../context/ThemeContext"
import { useToast } from "../context/ToastContext"

export default function FoodDetailScreen({ route, navigation }) {
  const { foodId } = route.params
  const [food, setFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { isDark } = useTheme()

  useEffect(() => {
    const sampleFoodItems = [
      {
        id: "1",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
        price: 8.99,
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Burgers",
        image
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

    const foundFood = sampleFoodItems.find((item) => item.id === foodId)

    if (foundFood) {
      setFood(foundFood)
    } else {
      showToast({
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
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        description: food.description,
        category: food.category,
        quantity,
      })
      showToast({
        title: "Added to Cart",
        description: `${food.name} has been added to your cart`,
        type: "success",
      })
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#111827"} />
      </SafeAreaView>
    )
  }

  if (!food) {
    return null
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      <ScrollView style={styles.content}>
        {/* Animate Food Image */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600 }}
        >
          <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />
        </MotiView>

        <View style={styles.details}>
          {/* Animate Texts */}
          <MotiText
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 200, duration: 500 }}
            style={[styles.name, { color: isDark ? "#ffffff" : "#111827" }]}
          >
            {food.name}
          </MotiText>

          <MotiText
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 300, duration: 500 }}
            style={[styles.price, { color: isDark ? "#ffffff" : "#111827" }]}
          >
            ${food.price.toFixed(2)}
          </MotiText>

          <MotiText
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 400, duration: 500 }}
            style={[styles.description, { color: isDark ? "#9ca3af" : "#6b7280" }]}
          >
            {food.description}
          </MotiText>

          <MotiText
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 500, duration: 500 }}
            style={[styles.category, { color: isDark ? "#9ca3af" : "#6b7280" }]}
          >
            Category: {food.category}
          </MotiText>

          {/* Quantity Selector */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 600, duration: 400 }}
            style={styles.quantityContainer}
          >
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: isDark ? "#9ca3af" : "#6b7280" }]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={24} color={isDark ? "#ffffff" : "#111827"} />
            </TouchableOpacity>
            <Text style={[styles.quantityText, { color: isDark ? "#ffffff" : "#111827" }]}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: isDark ? "#9ca3af" : "#6b7280" }]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={24} color={isDark ? "#ffffff" : "#111827"} />
            </TouchableOpacity>
          </MotiView>

          {/* Animate Add to Cart Button */}
          <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800, type: "spring" }}
          >
            <TouchableOpacity
              style={[styles.addToCartButton, { backgroundColor: isDark ? "#ffffff" : "#111827" }]}
              onPress={handleAddToCart}
            >
              <Text style={[styles.addToCartText, { color: isDark ? "#111827" : "#ffffff" }]}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

  },
  details: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  addToCartButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
