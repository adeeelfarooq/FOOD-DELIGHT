"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, ShoppingBag, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function Profile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
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

  // Get initials for avatar
  const getInitials = () => {
    if (!user.displayName) return "U"
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      <Header title="Profile" />

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-orange-red-100 text-orange-red-800">{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/orders")}>            <ShoppingBag className="mr-2 h-4 w-4" />
            Order History
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile/edit")}>            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
