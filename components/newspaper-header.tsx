"use client"

export default function NewspaperHeader() {
  return (
    <div className="w-full border-b-4 border-foreground bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Visiting Card Image */}
          <div className="w-full max-w-2xl">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-08%20at%2012.56.25-O0DXv2mr5Jonqcki3l0C8xxVZSq5c7.jpeg"
              alt="MANIKYADA MINCHU - Press Card"
              className="w-full h-auto shadow-2xl rounded-lg border-2 border-foreground/20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
