"use client"

import { CartProvider } from "@/context/cart-context"

export function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>
}
