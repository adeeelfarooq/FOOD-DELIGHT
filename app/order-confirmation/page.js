"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import LoadingScreen from "@/components/loading-screen"
import { ThemeToggle } from "@/components/theme-toggle"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function OrderConfirmation() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Redirect if no order ID
    if (!loading && !orderId) {
      router.push("/home")
      return
    }

    const fetchOrderDetails = async () => {
      if (!orderId) return

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId))

        if (orderDoc.exists()) {
          const data = orderDoc.data()
          setOrderDetails({
            id: orderDoc.id,
            status: data.status || "Pending",
            totalAmount: data.totalAmount || 0,
            items: data.items || [],
            createdAt: data.createdAt,
          })
        } else {
          // Order not found
          router.push("/home")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [user, loading, router, orderId])

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  // Generate a random delivery time between 25-45 minutes
  const deliveryTime = Math.floor(Math.random() * 20) + 25

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <p className="text-muted-foreground mt-2">Your order has been placed successfully</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{orderId?.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{orderDetails?.status || "Pending"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-medium">{orderDetails?.items?.length || 0}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">
                ${typeof orderDetails?.totalAmount === "number" ? orderDetails.totalAmount.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span className="font-medium">{deliveryTime} minutes</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Your delicious food is being prepared and will be on its way soon.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full bg-orange-red-500 hover:bg-orange-red-600" onClick={() => router.push("/home")}>
            Back to Home
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/orders")}>
            View All Orders
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
