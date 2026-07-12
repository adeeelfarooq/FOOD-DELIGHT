"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: name,
      })

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      })

      router.push("/home")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "There was a problem creating your account",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12 bg-orange-50/50 dark:bg-transparent">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-3 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <div className="relative h-20 w-20 mb-1.5">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="FoodDelight logo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-xl font-bold tracking-wide">FOODDELIGHT</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5 animate-fade-in-down">
          <h1 className="text-2xl font-bold text-orange-red-500 text-center">Create Account</h1>
          <div className="absolute right-6 top-6">
            <ThemeToggle />
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-3">
          <div className="animate-slide-in-left" style={{ animationDelay: "200ms" }}>
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[50px] border-orange-red-500"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: "400ms" }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[50px] border-orange-red-500"
              required
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[50px] border-orange-red-500"
              required
            />
          </div>

          <div className="animate-scale-in" style={{ animationDelay: "800ms" }}>
            <Button
              type="submit"
              className="w-full h-[50px] bg-orange-red-500 hover:bg-orange-red-600 text-base font-bold mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>

          <div className="text-center pt-2 animate-fade-in" style={{ animationDelay: "1000ms" }}>
            <Link href="/signin" className="text-orange-red-500 hover:underline">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}