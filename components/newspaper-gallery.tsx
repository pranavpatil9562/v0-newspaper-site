"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewspaperGalleryProps {
  images: string[]
}

export default function NewspaperGallery({ images }: NewspaperGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-[8.5/11] flex items-center justify-center">
          {images[currentIndex] && (
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Newspaper page ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="sm" onClick={goToPrevious} disabled={images.length <= 1}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground text-center">
            Page {currentIndex + 1} of {images.length}
          </div>

          <Button variant="outline" size="sm" onClick={goToNext} disabled={images.length <= 1}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-12 h-16 rounded border-2 transition-colors ${
                index === currentIndex ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`Go to page ${index + 1}`}
            >
              <span className="text-xs font-medium">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
