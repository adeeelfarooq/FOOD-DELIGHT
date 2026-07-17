"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Reset email sent",
        description: "Check your email for a link to reset your password",
      })
      router.push("/signin")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset email",
      })
    } finally {
      setIsLoading(false)
    }
  }

 return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 animate-scale-in">
          <div className="relative h-[90px] w-[90px] mb-3">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="FoodDelight logo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2 animate-fade-in-down">
          <h1 className="text-2xl font-bold text-orange-red-500">Reset Password</h1>
          <ThemeToggle />
        </div>
        <p
          className="text-muted-foreground mb-6 animate-fade-in-down"
          style={{ animationDelay: "150ms" }}
        >
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4 text-left">
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[50px] border-orange-red-500"
              required
            />
          </div>

          <div className="animate-scale-in" style={{ animationDelay: "500ms" }}>
            <Button
              type="submit"
              className="w-full h-[50px] bg-orange-red-500 hover:bg-orange-red-600 text-base font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="text-center pt-2 animate-fade-in" style={{ animationDelay: "700ms" }}>
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="text-orange-red-500 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}