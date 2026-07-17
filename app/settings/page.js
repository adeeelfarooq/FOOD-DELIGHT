"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"

export default function Settings() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initialData, setInitialData] = useState(null)

  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const address = userData.address || {}

          setInitialData({
            phone: userData.phone || "",
            address: {
              street: address.street || "",
              city: address.city || "",
              state: address.state || "",
              postalCode: address.postalCode || "",
            },
          })

          setPhone(userData.phone || "")
          setStreet(address.street || "")
          setCity(address.city || "")
          setState(address.state || "")
          setPostalCode(address.postalCode || "")
        } else {
          setInitialData({ phone: "", address: { street: "", city: "", state: "", postalCode: "" } })
        }
      } catch (error) {
        console.error("Error loading user settings:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserSettings()
  }, [user, toast])

  const hasChanges = () => {
    if (!initialData) return false
    return (
      phone.trim() !== initialData.phone ||
      street.trim() !== initialData.address.street ||
      city.trim() !== initialData.address.city ||
      state.trim() !== initialData.address.state ||
      postalCode.trim() !== initialData.address.postalCode
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    if (!phone.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      })
      return
    }

    try {
      setSaving(true)
      await setDoc(
        doc(db, "users", user.uid),
        {
          phone: phone.trim(),
          address: {
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

      setInitialData({
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        },
      })

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return <LoadingScreen />
  }

  const canSave = hasChanges() && !saving

  return (
    <div className="container px-4 py-6 pb-24 ">
      <Header title="Settings" />

      <div className="max-w-md mx-auto animate-fade-in-up">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="Street address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="space-y-2 flex-[0.6]">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2 flex-[0.4]">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSave}
            className={`w-full h-[52px] text-base font-semibold ${
              canSave ? "bg-orange-red-500 hover:bg-orange-red-600" : "bg-muted-foreground/40 hover:bg-muted-foreground/40"
            }`}
          >
            {saving ? "Saving..." : initialData?.phone || initialData?.address?.street ? "Update Settings" : "Save Settings"}
          </Button>
        </form>
      </div>
    </div>
  )
}