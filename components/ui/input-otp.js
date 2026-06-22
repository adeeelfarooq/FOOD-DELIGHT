"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function InputOTP({ value, onChange, length = 6, className }) {
  const [focusedIndex, setFocusedIndex] = React.useState(0)

  const handleKeyDown = (event) => {
    const input = event.target
    const index = parseInt(input.name)

    if (event.key === "Backspace") {
      if (index > 0) {
        setFocusedIndex(index - 1)
      }
    } else if (event.key.length === 1 && /^[0-9]$/.test(event.key)) {
      if (index < length - 1) {
        setFocusedIndex(index + 1)
      }
    }
  }

  const handleChange = (event) => {
    const { value: inputValue, name } = event.target
    const index = parseInt(name)

    // Only allow numbers
    const newValue = inputValue.replace(/[^0-9]/g, "")

    // Update the value at the current position
    const digits = value.split("")
    digits[index] = newValue

    // Join the digits back together
    const updatedValue = digits.join("")

    // Trigger the change handler
    onChange(updatedValue)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          name={index.toString()}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus={index === focusedIndex}
        />
      ))}
    </div>
  )
}
