import Image from "next/image"

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
      <div className="animate-pulse">
        <div className="relative h-32 w-32 mb-8">
          <Image
            src="/placeholder.svg?height=128&width=128"
            alt="Food Ordering App Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-orange-500 mb-2">FoodDelight</h1>
      <p className="text-muted-foreground">Delicious food at your doorstep</p>
    </div>
  )
}
