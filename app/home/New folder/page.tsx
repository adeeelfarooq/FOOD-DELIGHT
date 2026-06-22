"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import FoodCard from "@/components/food-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import LoadingScreen from "@/components/loading-screen"
import { ThemeToggle } from "@/components/theme-toggle" // Updated import

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function Home() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()
  const { cartItems } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Use sample food items instead of fetching from Firestore
    const sampleFoodItems: FoodItem[] = [
      {
        id: "1",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
        price: 8.99,
        image: "/placeholder.svg?height=400&width=400&text=Cheeseburger",
        category: "Burgers",
      },
      {
        id: "2",
        name: "Margherita Pizza",
        description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil",
        price: 12.99,
        image: "/placeholder.svg?height=400&width=400&text=Pizza",
        category: "Pizza",
      },
      {
        id: "3",
        name: "Chicken Caesar Salad",
        description: "Crisp romaine lettuce with grilled chicken, parmesan, and Caesar dressing",
        price: 9.99,
        image: "/placeholder.svg?height=400&width=400&text=Salad",
        category: "Salads",
      },
      {
        id: "4",
        name: "Spicy Ramen Bowl",
        description: "Authentic Japanese ramen with spicy broth, egg, and tender pork",
        price: 11.99,
        image: "/placeholder.svg?height=400&width=400&text=Ramen",
        category: "Asian",
      },
      {
        id: "5",
        name: "Chocolate Brownie Sundae",
        description: "Warm chocolate brownie topped with vanilla ice cream and hot fudge",
        price: 6.99,
        image: "/placeholder.svg?height=400&width=400&text=Dessert",
        category: "Desserts",
      },
      {
        id: "6",
        name: "Veggie Wrap",
        description: "Fresh vegetables, hummus, and feta cheese wrapped in a spinach tortilla",
        price: 7.99,
        image: "/placeholder.svg?height=400&width=400&text=Wrap",
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user?.displayName?.split(" ")[0] || "User"} 👋</h1>
          <p className="text-muted-foreground">What would you like to eat today?</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="relative" onClick={() => router.push("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for food..."
          className="pl-10"
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
