"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function FoodDetails({ params }) {
  const [food, setFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    // Sample food items data
    const sampleFoodItems = [
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

    // Find the food item with the matching ID
    const foundFood = sampleFoodItems.find((item) => item.id === params.id)

    if (foundFood) {
      setFood(foundFood)
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Food item not found",
      })
      router.push("/home")
    }

    setIsLoading(false)
  }, [params.id, router, toast])

  const handleAddToCart = () => {
    if (food) {
      addToCart({
        ...food,
        quantity,
      })

      toast({
        title: "Added to cart",
        description: `${quantity} x ${food.name} added to your cart`,
      })
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!food) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Food item not found</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      <Header title={food.name} />

      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={food.image || "/placeholder.svg?height=400&width=400"}
            alt={food.name}
            fill
            className="object-cover"
            priority={true}
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{food.name}</h1>
            <div className="text-xl font-semibold text-orange-red-500">${food.price.toFixed(2)}</div>
          </div>

          <p className="text-muted-foreground">{food.description}</p>

          <div className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xl font-semibold">${(food.price * quantity).toFixed(2)}</div>
            </div>

            <Button className="w-full mt-6 bg-orange-red-500 hover:bg-orange-red-600" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
