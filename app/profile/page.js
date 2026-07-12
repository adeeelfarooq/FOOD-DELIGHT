"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function Profile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/signin")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      })
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6 min-h-[calc(100vh-2rem)] flex flex-col">
      <Header title="Profile" />

      <div className="flex flex-col items-center max-w-sm mx-auto w-full animate-fade-in flex-1 justify-center">
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-24 w-24 mb-3 rounded-full overflow-hidden">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="w-full space-y-2.5">
          <Button
            variant="secondary"
            className="w-full h-[52px] text-base"
            onClick={() => router.push("/profile/edit")}
          >
            Edit Profile
          </Button>
          <Button
            variant="secondary"
            className="w-full h-[52px] text-base"
            onClick={() => router.push("/orders")}
          >
            My Orders
          </Button>
          <Button
            variant="secondary"
            className="w-full h-[52px] text-base"
            onClick={() => router.push("/settings")}
          >
            Settings
          </Button>
          <Button variant="destructive" className="w-full h-[52px] text-base mt-5" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}