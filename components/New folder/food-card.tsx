"use client"

import type React from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface FoodCardProps {
  food: FoodItem
}

export default function FoodCard({ food }: FoodCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    addToCart({
      ...food,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${food.name} added to your cart`,
    })
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/food/${food.id}`)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={food.image || "/placeholder.svg?height=200&width=300"}
          alt={food.name}
          fill
          className="object-cover"
          priority={true}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-1">{food.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 h-10">{food.description}</p>
          </div>
          <div className="text-orange-500 font-semibold">${food.price.toFixed(2)}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-orange-500 hover:bg-orange-600" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
