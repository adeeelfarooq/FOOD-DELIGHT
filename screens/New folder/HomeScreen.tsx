"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import FoodCard from "../components/FoodCard"

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Sample food items data
    const sampleFoodItems: FoodItem[] = [
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

    setFoodItems(sampleFoodItems)
    setFilteredItems(sampleFoodItems)
    setIsLoading(false)
  }, [])

  // Filter food items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(foodItems)
    } else {
      const filtered = foodItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery, foodItems])

  const firstName = user?.displayName?.split(" ")[0] || "User"

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: isDark ? "#ffffff" : "#111827" }]}>Hi, {firstName} 👋</Text>
          <Text style={[styles.subGreeting, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            What would you like to eat today?
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color={isDark ? "#ffffff" : "#111827"} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={isDark ? "#9ca3af" : "#6b7280"} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: isDark ? "#1f2937" : "#f9fafb",
              color: isDark ? "#ffffff" : "#111827",
              borderColor: isDark ? "#374151" : "#e5e7eb",
            },
          ]}
          placeholder="Search for food..."
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Food Items List */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FoodCard
              food={item}
              onPress={() => navigation.navigate("FoodDetail", { foodId: item.id })}
              isDark={isDark}
            />
          )}
          contentContainerStyle={styles.foodList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            No food items found. Try a different search.
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subGreeting: {
    fontSize: 16,
  },
  themeToggle: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  foodList: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
})
