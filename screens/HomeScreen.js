"use client"

import { Ionicons } from "@expo/vector-icons"
import { MotiView } from "moti"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import FoodCard from "../components/FoodCard"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function HomeScreen({ navigation }) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [foodItems, setFoodItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [headerLoaded, setHeaderLoaded] = useState(false)

  useEffect(() => {
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

    setFoodItems(sampleFoodItems)
    setFilteredItems(sampleFoodItems)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(foodItems)
    } else {
      const filtered = foodItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery, foodItems])

  const firstName = user?.displayName?.split(" ")[0] || "User"

  const handleFoodItemPress = (item) => {
    navigation.navigate("FoodDetail", { item })
  }

  const renderFoodItem = ({ item }) => (
    <FoodCard
      item={item}
      onPress={() => handleFoodItemPress(item)}
      isDark={isDark}
    />
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#111827" : "#ffffff" }]}>
      {/* Animate Header & Search Bar */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
        onDidAnimate={() => setHeaderLoaded(true)}
      >
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={isDark ? "#ffffff" : "#111827"}
            />
            <View style={styles.greetingTextContainer}>
              <Text style={[styles.greeting, { color: isDark ? "#ffffff" : "#111827" }]}>
                Hello, {firstName}
              </Text>
              <Text style={[styles.subGreeting, { color: isDark ? "#ffffff" : "#111827" }]}>
                What would you like to eat today?
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={24}
              color={isDark ? "#ffffff" : "#111827"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: isDark ? "#1f2937" : "#f3f4f6" }]}
            placeholder="Search for food..."
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </MotiView>

      {isLoading || !headerLoaded ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#111827"} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          key="2columns"
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  greetingContainer: { flexDirection: "row", alignItems: "center" },
  greetingTextContainer: { marginLeft: 8 },
  greeting: { fontSize: 20, fontWeight: "bold" },
  subGreeting: { fontSize: 16, color: "#6B7280" },
  themeToggle: { padding: 8 },
  searchContainer: { padding: 16 },
  searchInput: { height: 40, borderRadius: 8, paddingHorizontal: 16, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 8, paddingBottom: 24 },
})
