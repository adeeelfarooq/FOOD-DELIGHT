"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"

interface FoodItem {
  category: string
  description: string
  id: string
  image: string
  name: string
  price: number
}

interface OrderItem {
  foodItem: FoodItem
  quantity: number
}

interface Order {
  id: string
  createdAt: any // Firestore timestamp
  deliveryAddress: string | null
  items: OrderItem[]
  status: string
  totalAmount: number
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    const fetchOrderDetails = async () => {
      if (!params.id) return

      try {
        const orderDoc = await getDoc(doc(db, "orders", params.id))

        if (orderDoc.exists()) {
          const data = orderDoc.data()

          // Verify this order belongs to the current user (if userId exists in your schema)
          // if (data.userId && data.userId !== user?.uid) {
          //   router.push("/orders")
          //   return
          // }

          setOrder({
            id: orderDoc.id,
            createdAt: data.createdAt,
            deliveryAddress: data.deliveryAddress,
            items: data.items || [],
            status: data.status || "Pending",
            totalAmount: data.totalAmount || 0,
          })
        } else {
          // Order not found
          router.push("/orders")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrderDetails()
    }
  }, [user, loading, router, params.id])

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  if (!order) {
    return null
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  // Format the timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Date unavailable"

    try {
      // Handle Firestore timestamp
      if (typeof timestamp.toDate === "function") {
        return format(timestamp.toDate(), "PPP 'at' p")
      }

      // Handle date objects
      if (timestamp instanceof Date) {
        return format(timestamp, "PPP 'at' p")
      }

      // Handle timestamps stored as strings or numbers
      if (typeof timestamp === "string" || typeof timestamp === "number") {
        return format(new Date(timestamp), "PPP 'at' p")
      }

      return "Date unavailable"
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Date unavailable"
    }
  }

  // Calculate subtotal (without delivery fee)
  const deliveryFee = 2.99
  const subtotal = Math.max(0, order.totalAmount - deliveryFee)

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      <Header title="Order Details" />

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{formatTimestamp(order.createdAt)}</p>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.foodItem?.image || "/placeholder.svg?height=100&width=100"}
                    alt={item.foodItem?.name || `Item ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.foodItem?.name || `Item ${index + 1}`}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${typeof item.foodItem?.price === "number" ? item.foodItem.price.toFixed(2) : "0.00"} ×{" "}
                    {item.quantity || 1}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    $
                    {typeof item.foodItem?.price === "number" && typeof item.quantity === "number"
                      ? (item.foodItem.price * item.quantity).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No items in this order</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    </div>
  )
}
