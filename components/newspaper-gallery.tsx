"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewspaperGalleryProps {
  images: string[]
}

export default function NewspaperGallery({ images }: NewspaperGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

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

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!fullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div
          ref={containerRef}
          className={`relative bg-muted overflow-hidden flex items-center justify-center ${
            fullscreen ? "fixed inset-0 z-50 aspect-auto rounded-none" : "rounded-lg aspect-[8.5/11]"
          }`}
        >
          {images[currentIndex] && (
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Newspaper page ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          )}

          {fullscreen && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                disabled={images.length <= 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                disabled={images.length <= 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                <Minimize2 className="w-6 h-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                Page {currentIndex + 1} of {images.length}
              </div>
            </>
          )}
        </div>

        {!fullscreen && (
          <>
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

            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="w-full bg-transparent">
              <Maximize2 className="w-4 h-4 mr-2" />
              Full Screen
            </Button>

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
          </>
        )}
      </div>
    </>
  )
}
