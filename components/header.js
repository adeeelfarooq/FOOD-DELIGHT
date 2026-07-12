"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, History, User, ShoppingCart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header({ title, showBackButton = true }) {
  const router = useRouter()
  const pathname = usePathname()

  const shouldShowBackButton = showBackButton && pathname !== "/home"

  const navLinks = [
    { href: "/home", icon: Home },
    { href: "/orders", icon: History },
    { href: "/cart", icon: ShoppingCart },
    { href: "/profile", icon: User },
  ]

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        {shouldShowBackButton && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Desktop-only navigation (hidden on mobile, BottomNavigator handles mobile) */}
     {/* Desktop-only navigation (hidden on mobile, BottomNavigator handles mobile) */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks
            .filter(({ href }) => !(pathname === href || pathname.startsWith(href + "/")))
            .map(({ href, icon: Icon }) => (
              <Button key={href} variant="outline" size="icon" onClick={() => router.push(href)}>
                <Icon className="h-5 w-5" />
              </Button>
            ))}
        </nav>
      </div>
    </div>
  )
}