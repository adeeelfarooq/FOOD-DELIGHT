"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext({})

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}, ref) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("select", onSelect)
    setApi?.(api)

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect, setApi])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
        opts,
        plugins,
        setApi,
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className="relative" ref={carouselRef}>
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

Carousel.displayName = "Carousel"

function CarouselContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("group relative flex", className)}
      {...props}
    />
  )
}

CarouselContent.displayName = "CarouselContent"

function CarouselItem({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative min-w-0 flex-none transition-all will-change-transform [&:not(:first-child)]:ml-6 group-hover:[&:not(:first-child)]:ml-0",
        className
      )}
      {...props}
    />
  )
}

CarouselItem.displayName = "CarouselItem"

function CarouselPrevious({ className, variant = "outline", size = "icon", ...props }, ref) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 h-8 w-8",
        orientation === "vertical" && "rotate-90",
        !canScrollPrev && "opacity-50 cursor-default",
        className
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

CarouselPrevious.displayName = "CarouselPrevious"

function CarouselNext({ className, variant = "outline", size = "icon", ...props }, ref) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 h-8 w-8",
        orientation === "vertical" && "rotate-90",
        !canScrollNext && "opacity-50 cursor-default",
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
}
