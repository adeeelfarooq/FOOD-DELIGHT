"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Only start the timer if authentication has been checked
    if (!loading) {
      const timer = setTimeout(() => {
        // Only redirect if the user is still on this page
        if (window.location.pathname === "/") {
          if (user) {
            router.push("/home")
          } else {
            router.push("/signin")
          }
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Show splash screen while loading and after loading completes
  return <SplashScreen />
}
