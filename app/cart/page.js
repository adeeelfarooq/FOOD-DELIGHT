"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"
// No need for Firestore imports as we're using temporary storage

export default function Cart() {
  const { cartItems = [], updateQuantity, removeFromCart, clearCart, cartTotal = 0 } = useCart() || {}
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Add some items to your cart before placing an order",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      // Generate a random order ID
      const orderId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Store order in temporary array (this would normally be stored in a more persistent state)
      const orderData = {
        id: orderId,
        userId: user?.uid,
        items: cartItems,
        totalAmount: cartTotal + 2.99, // Including delivery fee
        status: "Pending",
        createdAt: new Date(),
      }
      
      // In a real app, you might want to store this in localStorage or a more persistent state
      // For now, we'll just log it to console
      console.log("Order placed:", orderData);
      
      // Clear the cart
      clearCart()
      
      // Navigate to home page with success message
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      })
      
      router.push('/home')
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place your order. Please try again.",
      })
      setIsPlacingOrder(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      <Header title="Your Cart" />

      {cartItems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=100&width=100"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1)
                      } else {
                        removeFromCart(item.id)
                      }
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[60px]">
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="w-full flex justify-between">
              <span className="font-medium">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="w-full flex justify-between">
              <span className="font-medium">Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <Separator />
            <div className="w-full flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${(cartTotal + 2.99).toFixed(2)}</span>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
       <div className="text-center py-12 animate-fade-in">
          <div className="mb-4 text-lg text-muted-foreground">Your cart is empty</div>
          <Button onClick={() => router.push("/home")}>
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  )
}