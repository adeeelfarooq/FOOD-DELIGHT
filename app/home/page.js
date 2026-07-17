"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import FoodCard from "@/components/food-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, History, User, CircleUserRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import LoadingScreen from "@/components/loading-screen"
import { ThemeToggle } from "@/components/theme-toggle" // Updated import

export default function Home() {
  const [foodItems, setFoodItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()
  const { cartItems = [] } = useCart() || {}
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Use sample food items instead of fetching from Firestore
    // Use sample food items instead of fetching from Firestore
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
  }, [user, loading, router, toast])

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

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
     {/* Header */}
      <div className="flex justify-between items-center mb-6 animate-fade-in-down">
        <div className="flex items-center gap-2">
          <CircleUserRound className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Hello, {user?.displayName?.split(" ")[0] || "User"}</h1>
            <p className="text-muted-foreground">What would you like to eat today?</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="relative" onClick={() => router.push("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 animate-fade-in-down" style={{ animationDelay: "150ms" }}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for food..."
          className="pl-10 h-10 border-0 bg-muted rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Food Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} food={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No food items found. Try a different search.</p>
        </div>
      )}
    </div>
  )
}