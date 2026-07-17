"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ShoppingBag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    const fetchOrders = async () => {
      if (!user) return

      try {
        // Create a query against the orders collection
        const ordersRef = collection(db, "orders")

        // If you have userId in your schema, use this query
        // const q = query(ordersRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"))

        // If you don't have userId, just get all orders (for demo purposes)
        const q = query(ordersRef, orderBy("createdAt", "desc"))

        // Execute the query
        const querySnapshot = await getDocs(q)

        // Map the documents to our Order structure
        const fetchedOrders = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedOrders.push({
            id: doc.id,
            createdAt: data.createdAt,
            deliveryAddress: data.deliveryAddress,
            items: data.items || [],
            status: data.status || "Pending",
            totalAmount: data.totalAmount || 0,
            userId: data.userId,
          })
        })

        setOrders(fetchedOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user, loading, router])

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-amber-500"
    }
  }

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recently"

    try {
      // Handle Firestore timestamp
      if (typeof timestamp.toDate === "function") {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
      }

      // Handle date objects
      if (timestamp instanceof Date) {
        return formatDistanceToNow(timestamp, { addSuffix: true })
      }

      // Handle timestamps stored as strings or numbers
      if (typeof timestamp === "string" || typeof timestamp === "number") {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
      }

      return "Recently"
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Recently"
    }
  }

  const handleOrderClick = (orderId) => {
    router.push(`/orders/${orderId}`)
  }

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="container px-4 py-6 pb-24 ">
      <Header title="Your Orders" />

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <Card
              key={order.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 120}ms` }}
              onClick={() => handleOrderClick(order.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTimestamp(order.createdAt)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Items</span>
                    <span className="text-sm font-medium">{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-sm font-medium">
                      ${typeof order.totalAmount === "number" ? order.totalAmount.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-scale-in">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => router.push("/home")} className="bg-orange-red-500 hover:bg-orange-red-600">
            Browse Menu
          </Button>
        </div>
      )}
    </div>
  )
}
