"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header({ title, showBackButton = true }) {
  const router = useRouter()
  const pathname = usePathname()

  const shouldShowBackButton = showBackButton && pathname !== "/home"

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

      <ThemeToggle />
    </div>
  )
}