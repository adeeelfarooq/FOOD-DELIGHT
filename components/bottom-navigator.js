"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, History, User } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function BottomNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const { cartItems } = useCart()

  // Hide bottom navigator on authentication pages
  const authPages = ["/signin", "/signup", "/forgot-password", "/"]

  // Check if current path exactly matches any auth page path
  if (authPages.includes(pathname)) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex justify-around md:hidden z-10">
      <Button
        variant="ghost"
        className={`flex flex-col items-center ${pathname === "/home" ? "text-orange-red-500" : ""}`}
        onClick={() => router.push("/home")}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center ${pathname === "/orders" || pathname.startsWith("/orders/") ? "text-orange-red-500" : ""}`}
        onClick={() => router.push("/orders")}
      >
        <History className="h-5 w-5" />
        <span className="text-xs mt-1">Orders</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center relative ${pathname === "/cart" ? "text-orange-red-500" : ""}`}
        onClick={() => router.push("/cart")}
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-1/4 bg-orange-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
        <span className="text-xs mt-1">Cart</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center ${pathname === "/profile" || pathname.startsWith("/profile/") ? "text-orange-red-500" : ""}`}
        onClick={() => router.push("/profile")}
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Button>
    </div>
  )
}