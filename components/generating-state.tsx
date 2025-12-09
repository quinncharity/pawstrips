"use client"

import { useEffect, useState } from "react"
import { Dog, Sparkles, Palette, Wand2 } from "lucide-react"

const steps = [
  { icon: Dog, text: "Analyzing your adorable pup..." },
  { icon: Palette, text: "Mixing cartoon colors..." },
  { icon: Wand2, text: "Adding comic magic..." },
  { icon: Sparkles, text: "Creating your masterpiece..." },
]

export function GeneratingState() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Animated background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-accent/30 animate-pulse" />
        </div>

        {/* Icon container */}
        <div className="relative w-20 h-20 rounded-full bg-card border-4 border-primary flex items-center justify-center shadow-lg animate-bounce-in">
          <CurrentIcon className="w-10 h-10 text-primary animate-wiggle" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl font-serif text-foreground animate-pulse">{steps[currentStep].text}</p>
        <p className="text-sm text-muted-foreground mt-2">This usually takes 15-30 seconds</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep ? "bg-primary w-6" : index < currentStep ? "bg-primary/60" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
