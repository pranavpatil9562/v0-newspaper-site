"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"


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
  const [showTerms, setShowTerms] = useState(false)


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
  // 👇 Add this useEffect
useEffect(() => {
  // Automatically scroll the newspaper area into view when the site loads
  if (containerRef.current) {
    containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}, [])


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY }
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current && zoom > 1 && containerRef.current) {
      const maxPanX = (containerRef.current.clientWidth * (zoom - 1)) / 2
      const maxPanY = (containerRef.current.clientHeight * (zoom - 1)) / 2

      let newPanX = e.clientX - dragStartRef.current.x
      let newPanY = e.clientY - dragStartRef.current.y

      newPanX = Math.max(-maxPanX, Math.min(maxPanX, newPanX))
      newPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY))

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
      const newZoom = Math.min(Math.max(touchStartZoomRef.current * scale, 1), 3)
      setZoom(newZoom)
    } else if (isDraggingRef.current && zoom > 1 && e.touches.length === 1 && containerRef.current) {
      const maxPanX = (containerRef.current.clientWidth * (zoom - 1)) / 2
      const maxPanY = (containerRef.current.clientHeight * (zoom - 1)) / 2

      let newPanX = e.touches[0].clientX - dragStartRef.current.x
      let newPanY = e.touches[0].clientY - dragStartRef.current.y

      newPanX = Math.max(-maxPanX, Math.min(maxPanX, newPanX))
      newPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY))

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
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1))
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      // Check if fullscreen API is supported
      if (containerRef.current.requestFullscreen) {
        if (!document.fullscreenElement) {
          await containerRef.current.requestFullscreen().catch((error) => {
            console.error("Fullscreen request failed:", error)
            // Fallback to modal fullscreen on iOS
            setFullscreen(true)
          })
        } else {
          await document.exitFullscreen().catch((error) => {
            console.error("Fullscreen exit failed:", error)
          })
        }
      } else {
        setFullscreen(!fullscreen)
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
      // Fallback to modal fullscreen
      setFullscreen(!fullscreen)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div
          ref={containerRef}
          className={`relative bg-muted overflow-hidden flex items-center justify-center cursor-${zoom > 1 ? "grab" : "default"} active:cursor-grabbing ${
            fullscreen ? "fixed inset-0 z-50 aspect-auto rounded-none w-screen h-screen" : "rounded-lg aspect-[8.5/11]"
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
            className={`relative w-full h-full flex items-center justify-center ${
              zoom > 1 ? "overflow-hidden" : "overflow-hidden"
            }`}
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition:
                isDraggingRef.current || touchStartDistanceRef.current > 0
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white z-10"
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
            {/* About + Latest Editions (tight layout, no gap) */}
<div className="w-full border-t pt-4 md:pt-6">
<div className="flex flex-col md:flex-row justify-between items-start md:items-stretch md:gap-0 gap-4">

    
    {/* About */}
<div className="w-full md:w-1/2 px-2 md:px-3 flex flex-col justify-center">

      <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
        ಮಾನಿಕ್ಯದ ಮಿಂಚು | MANIKYADA MINCHU
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
        ಕನ್ನಡಿಗರ ಕನ್ನಡ ದಿನಪತ್ರಿಕೆ — ಬೀದರದಿಂದ ಪ್ರಕಟವಾಗುವ 
        <strong> ಮಾನಿಕ್ಯದ ಮಿಂಚು </strong> ಸ್ಥಳೀಯ, ರಾಜ್ಯ, ರಾಷ್ಟ್ರೀಯ ಹಾಗೂ ಅಂತರರಾಷ್ಟ್ರೀಯ 
        ಸುದ್ದಿಗಳನ್ನು ನಿಖರವಾಗಿ ಹಾಗೂ ಪ್ರಾಮಾಣಿಕವಾಗಿ ತಲುಪಿಸುವ ಪ್ರಯತ್ನದಲ್ಲಿದೆ. ರಾಜಕೀಯ, 
        ವ್ಯಾಪಾರ, ಕ್ರೀಡೆ, ಶಿಕ್ಷಣ ಹಾಗೂ ಸಮಾಜಮುಖಿ ವಿಷಯಗಳಲ್ಲಿ ನಿಖರವಾದ ವರದಿ ನೀಡುವ ಪತ್ರಿಕೆ.
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Honest. Local. Trusted Journalism.
      </p>
    </div>

    {/* Latest Editions */}
<div className="w-full md:w-1/2 px-2 md:px-3 flex flex-col justify-center">

<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 md:mb-4">
  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-0">
    Latest Editions
  </h3>
</div>

      <ul className="space-y-0.5 text-xs md:text-sm text-muted-foreground">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          return (
            <li
              key={i}
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() =>
                (window.location.href = `/newspaper/${date.toISOString().split("T")[0]}`)
              }
            >
              {formattedDate}
            </li>
          )
        })}
      </ul>
    </div>
  </div>
</div>




              {/* ✅ Terms & Conditions Toggle (English + Kannada) */}
<div className="max-w-4xl mx-auto mt-6 w-full">
  <button
    onClick={() => setShowTerms(!showTerms)}
    className="flex items-center justify-between w-full bg-foreground/5 hover:bg-foreground/10 transition-colors px-4 py-3 rounded-lg font-semibold text-foreground"
  >
    <span>📜 Terms & Conditions / ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು</span>
    {showTerms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>

  <div
    className={`transition-all duration-500 ease-in-out overflow-hidden ${
      showTerms ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
    }`}
  >
    <div className="bg-background border border-foreground/10 rounded-lg shadow-sm p-4 text-sm text-foreground/80 leading-relaxed">
      <p className="font-semibold mb-2 text-lg text-center">
        🗞️ MANIKYADA MINCHU — Terms & Conditions
      </p>

      {/* English Version */}
      <div className="space-y-2">
        <p>
          1. All news and information published in <strong>MANIKYADA MINCHU</strong> are for public
          awareness and informational purposes only.
        </p>
        <p>
          2. The publication is owned and managed by <strong>Manikesh Patil</strong>.
        </p>
        <p>
          3. Reproduction or distribution of any content without prior written permission from the
          owner is strictly prohibited.
        </p>
        <p>
          4. While every effort is made to ensure the accuracy of information, <strong>MANIKYADA
          MINCHU</strong> is not responsible for any inadvertent errors or omissions.
        </p>
        <p>
          5. The views expressed by contributors or advertisers are their own and do not necessarily
          reflect those of <strong>MANIKYADA MINCHU</strong>.
        </p>
        <p>
          6. By accessing or reading this newspaper, you agree to these terms.
        </p>
      </div>

      <hr className="my-4 border-foreground/10" />

      {/* Kannada Version */}
      <div className="space-y-2 font-[Kannada] text-[15px] leading-relaxed">
        <p className="font-semibold mb-1">🗞️ ಮಾನಿಕ್ಯದ ಮಿಂಚು — ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು</p>
        <p>
          ೧. <strong>ಮಾನಿಕ್ಯದ ಮಿಂಚು</strong> ಪತ್ರಿಕೆಯಲ್ಲಿ ಪ್ರಕಟವಾಗುವ ಎಲ್ಲಾ ಸುದ್ದಿ ಮತ್ತು ಮಾಹಿತಿಗಳು
          ಸಾರ್ವಜನಿಕ ಜಾಗೃತಿ ಮತ್ತು ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ.
        </p>
        <p>
          ೨. ಈ ಪತ್ರಿಕೆಯ ಮಾಲೀಕರು ಮತ್ತು ನಿರ್ವಹಣಾಧಿಕಾರಿ <strong>ಮನಿಕೇಶ್ ಪಾಟೀಲ</strong>.
        </p>
        <p>
          ೩. ಮಾಲೀಕರ ಪೂರ್ವಾನುಮತಿಯಿಲ್ಲದೆ ಯಾವುದೇ ವಿಷಯವನ್ನು ನಕಲು ಮಾಡುವುದು ಅಥವಾ ಹಂಚಿಕೊಳ್ಳುವುದು
          ಕಾನೂನುಬಾಹಿರ.
        </p>
        <p>
          ೪. ಪತ್ರಿಕೆಯಲ್ಲಿ ಪ್ರಕಟವಾಗುವ ಮಾಹಿತಿಯ ನಿಖರತೆಯ ಬಗ್ಗೆ ಎಲ್ಲಾ ಪ್ರಯತ್ನಗಳನ್ನೂ ಮಾಡಲಾಗುತ್ತದೆ,
          ಆದಾಗ್ಯೂ <strong>ಮಾನಿಕ್ಯದ ಮಿಂಚು</strong> ಯಾವುದೇ ತಪ್ಪುಗಳು ಅಥವಾ ಬಿಟ್ಟಿರುವ ವಿಷಯಗಳಿಗಾಗಿ
          ಹೊಣೆಗಾರರಾಗಿರುವುದಿಲ್ಲ.
        </p>
        <p>
          ೫. ಲೇಖಕರು ಅಥವಾ ಜಾಹೀರಾತು ದಾರರು ವ್ಯಕ್ತಪಡಿಸುವ ಅಭಿಪ್ರಾಯಗಳು ಅವರದೇ ಆಗಿದ್ದು,
          <strong>ಮಾನಿಕ್ಯದ ಮಿಂಚು</strong> ಪತ್ರಿಕೆಯ ನಿಲುವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುವುದಿಲ್ಲ.
        </p>
        <p>
          ೬. ಈ ಪತ್ರಿಕೆಯನ್ನು ಓದುವ ಅಥವಾ ಪ್ರವೇಶಿಸುವ ಮೂಲಕ ನೀವು ಈ ಷರತ್ತುಗಳಿಗೆ ಒಪ್ಪುತ್ತೀರಿ.
        </p>
      </div>

      <p className="mt-4 text-right text-xs italic text-foreground/60">
        © {new Date().getFullYear()} MANIKYADA MINCHU | All Rights Reserved
      </p>
    </div>
  </div>
</div>

          </>
        )}
      </div>
    </>
  )
}
