"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, History, User } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function BottomNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const cart = useCart()
  const cartItems = cart?.cartItems ?? []

  const authPages = ["/signin", "/signup", "/forgot-password", "/"]

  if (authPages.includes(pathname)) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1f2937] border-t border-[#e5e7eb] dark:border-[#374151] py-2 flex justify-around md:hidden z-10">
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-0.5 hover:bg-transparent ${
          pathname === "/home" ? "text-orange-red-500" : "text-[#6b7280] dark:text-[#9ca3af]"
        }`}
        onClick={() => router.push("/home")}
      >
        <Home className="h-6 w-6" />
        <span className="text-[11px]">Home</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-0.5 hover:bg-transparent ${
          pathname === "/orders" || pathname.startsWith("/orders/") ? "text-orange-red-500" : "text-[#6b7280] dark:text-[#9ca3af]"
        }`}
        onClick={() => router.push("/orders")}
      >
        <History className="h-6 w-6" />
        <span className="text-[11px]">Orders</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-0.5 relative hover:bg-transparent ${
          pathname === "/cart" ? "text-orange-red-500" : "text-[#6b7280] dark:text-[#9ca3af]"
        }`}
        onClick={() => router.push("/cart")}
      >
        <ShoppingCart className="h-6 w-6" />
        {(cartItems?.length ?? 0) > 0 && (
          <span className="absolute -top-0.5 right-1 bg-orange-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
        <span className="text-[11px]">Cart</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-0.5 hover:bg-transparent ${
          pathname === "/profile" || pathname.startsWith("/profile/") ? "text-orange-red-500" : "text-[#6b7280] dark:text-[#9ca3af]"
        }`}
        onClick={() => router.push("/profile")}
      >
        <User className="h-6 w-6" />
        <span className="text-[11px]">Profile</span>
      </Button>
    </div>
  )
}