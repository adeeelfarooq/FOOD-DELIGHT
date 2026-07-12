"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/home")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-down">
          <div className="relative h-[90px] w-[90px] mb-3">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="FoodDelight logo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-2xl font-bold text-orange-red-500 tracking-widest">FOODDELIGHT</h1>
          <p className="text-base text-muted-foreground mt-1">Welcome back!</p>
        </div>

        {/* Title + theme toggle */}
        <div
          className="flex items-center justify-between mb-2 animate-fade-in-down"
          style={{ animationDelay: "400ms" }}
        >
          <h2 className="text-2xl font-bold">Sign In</h2>
          <ThemeToggle />
        </div>
        <p
          className="text-base text-muted-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          Enter your email and password to access your account
        </p>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "750ms" }}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[50px]"
              required
            />
          </div>

          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "900ms" }}>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-orange-red-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[50px]"
              required
            />
          </div>

          <div className="animate-scale-in" style={{ animationDelay: "1100ms" }}>
            <Button
              type="submit"
              className="w-full h-[50px] bg-orange-red-500 hover:bg-orange-red-600 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <div className="text-center text-sm animate-fade-in" style={{ animationDelay: "1300ms" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-orange-red-500 font-medium hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}