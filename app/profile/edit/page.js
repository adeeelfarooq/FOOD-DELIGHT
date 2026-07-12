"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function EditProfile() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Set initial values
    if (user) {
      setName(user.displayName || "")
    }

    setIsLoading(false)
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) return

    setIsSaving(true)

    try {
      // Update profile in Firebase Auth
      await updateProfile(user, {
        displayName: name,
      })

      // Update profile in Firestore
      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          name,
        })
      } catch (error) {
        // If Firestore update fails, we still continue since Auth update succeeded
        console.error("Failed to update Firestore profile:", error)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="container px-4 py-6 pb-24 md:pb-6">
      <Header title="Edit Profile" />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-orange-red-500 hover:bg-orange-red-600" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
