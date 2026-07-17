"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth , db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function EditProfile() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    const loadUserData = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setName(user.displayName || userData.fullName || "")
          setPhone(userData.phone || "")
        } else {
          setName(user.displayName || "")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) return
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name is required",
      })
      return
    }

    setIsSaving(true)

    try {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      })

      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          fullName: name.trim(),
          phone: phone.trim(),
          updatedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Failed to update Firestore profile:", error)
      }

      refreshUser()

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
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

      <div className="max-w-md mx-auto animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="h-[50px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled className="h-[50px] bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="h-[50px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-[50px] bg-orange-red-500 hover:bg-orange-red-600 mt-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  )
}