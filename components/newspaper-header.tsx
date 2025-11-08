"use client"

export default function NewspaperHeader() {
  return (
    <div className="w-full border-b-4 border-foreground bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Title - Bilingual */}
        <div className="grid grid-cols-2 gap-8 mb-6 items-center">
          {/* English Side */}
          <div className="text-center border-r-2 border-foreground/20 pr-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">MANIKYADA</h1>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">MINCHU</h1>
          </div>

          {/* Kannada Side */}
          <div className="text-center pl-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">ಮಣಿಕ್ಯದ</h1>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">ಮಿಂಚು</h1>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 bg-foreground/10 my-6"></div>

        {/* Editor and Meta Info */}
        <div className="grid grid-cols-2 gap-8">
          {/* English Side */}
          <div className="border-r-2 border-foreground/20 pr-8 flex items-center justify-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-widest uppercase">Editor</p>
              <p className="text-lg font-bold">MANIKESH PATIL</p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-foreground/30 flex items-center justify-center bg-foreground/5 flex-shrink-0 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-08%20at%2015.48.28-JsHSOaY6FttZJy5695hG1YzLWe9u0S.jpeg"
                alt="Editor Manikesh Patil"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Kannada Side */}
          <div className="pl-8 flex items-center justify-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-widest">ಸಂಪಾದಕ</p>
              <p className="text-lg font-bold">ಮಣಿಕೇಶ ಪಾಟೀಲ್</p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-foreground/30 flex items-center justify-center bg-foreground/5 flex-shrink-0 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-08%20at%2015.48.28-JsHSOaY6FttZJy5695hG1YzLWe9u0S.jpeg"
                alt="ಸಂಪಾದಕ ಮಣಿಕೇಶ ಪಾಟೀಲ್"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
