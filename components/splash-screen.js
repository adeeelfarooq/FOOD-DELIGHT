"use client"

import Image from "next/image"

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-red-50 dark:bg-[#111827] px-5">
      <div className="relative h-[130px] w-[130px] mb-6 animate-scale-in">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          alt="FoodDelight logo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <h1
        className="text-3xl font-bold text-orange-red-500 mb-2 tracking-widest animate-fade-in"
        style={{ animationDelay: "500ms" }}
      >
        FOODDELIGHT
      </h1>

      <p
        className="text-base text-muted-foreground mb-6 animate-fade-in"
        style={{ animationDelay: "500ms" }}
      >
        Delicious food at your doorstep
      </p>

      <div className="h-8 w-8 rounded-full border-4 border-orange-red-200 border-t-orange-red-500 animate-spin" />
    </div>
  )
}