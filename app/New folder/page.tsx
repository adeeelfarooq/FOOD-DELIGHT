"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Wait for authentication to be checked
    if (!loading) {
      // Redirect based on authentication status after a short delay
      const timer = setTimeout(() => {
        if (user) {
          router.push("/home")
        } else {
          router.push("/signin")
        }
      }, 2000) // 2 seconds delay to show splash screen

      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  return <SplashScreen />
}
