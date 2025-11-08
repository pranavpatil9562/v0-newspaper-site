"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewspaperGalleryProps {
  images: string[]
}

export default function NewspaperGallery({ images }: NewspaperGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const touchStartDistanceRef = useRef(0)
  const touchStartZoomRef = useRef(1)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
  }, [currentIndex])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY }
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current && zoom > 1) {
      const newPanX = e.clientX - dragStartRef.current.x
      const newPanY = e.clientY - dragStartRef.current.y
      setPanX(newPanX)
      setPanY(newPanY)
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)
      touchStartDistanceRef.current = distance
      touchStartZoomRef.current = zoom
    } else if (e.touches.length === 1 && zoom > 1) {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY }
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)

      const scale = distance / touchStartDistanceRef.current
      const newZoom = touchStartZoomRef.current * scale
      setZoom(Math.min(Math.max(newZoom, 1), 3))
    } else if (isDraggingRef.current && zoom > 1 && e.touches.length === 1) {
      const newPanX = e.touches[0].clientX - dragStartRef.current.x
      const newPanY = e.touches[0].clientY - dragStartRef.current.y
      setPanX(newPanX)
      setPanY(newPanY)
    }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1))
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
          className={`relative bg-muted overflow-hidden flex items-center justify-center cursor-${zoom > 1 ? "grab" : "default"} active:cursor-grabbing ${
            fullscreen ? "fixed inset-0 z-50 aspect-auto rounded-none" : "rounded-lg aspect-[8.5/11]"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={imageRef}
            className={`relative w-full h-full flex items-center justify-center transition-transform duration-200 ${
              zoom > 1 ? "overflow-hidden" : "overflow-hidden"
            }`}
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            {images[currentIndex] && (
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Newspaper page ${currentIndex + 1}`}
                fill
                className="object-contain select-none"
                priority
                draggable={false}
              />
            )}
          </div>

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

              <div className="absolute top-4 left-4 flex gap-2 bg-black/50 rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="text-white hover:bg-black/70 h-9 w-9"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <div className="flex items-center justify-center px-3 text-white text-sm font-medium min-w-12">
                  {Math.round(zoom * 100)}%
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="text-white hover:bg-black/70 h-9 w-9"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
              </div>

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
