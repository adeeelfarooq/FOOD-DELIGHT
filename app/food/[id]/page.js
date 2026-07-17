"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
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
  const { addToCart } = useCart() || {}

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
      if (typeof addToCart !== "function") {
        console.error("Cart is not ready yet")
        return
      }

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
    <div className="container px-4 py-6 pb-24">
      <Header title={food.name} />

      <Card className="overflow-hidden animate-scale-in max-w-xl mx-auto">
        <div className="relative h-48 sm:h-56 w-full rounded-b-2xl overflow-hidden">
          <Image
            src={food.image}
            alt={food.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="p-5 space-y-3">
          <div
            className="flex justify-between items-start animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <h1 className="text-xl font-bold">{food.name}</h1>
            <div className="text-lg font-semibold text-orange-red-500">${food.price.toFixed(2)}</div>
          </div>

          <p
            className="text-sm text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            {food.description}
          </p>

          <div className="pt-2">
            <div
              className="flex items-center justify-between animate-fade-in-up"
              style={{ animationDelay: "500ms" }}
            >
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div
                className="text-lg font-semibold animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                ${(food.price * quantity).toFixed(2)}
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <Button className="w-full mt-4" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}