"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
}

export default function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const processFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length > 0) {
      onFilesSelected(imageFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    processFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload newspaper pages"
      />
      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
      <p className="font-medium text-foreground">Drag and drop images here or click to browse</p>
      <p className="text-sm text-muted-foreground mt-1">Support for JPG, PNG, and other image formats</p>
    </div>
  )
}
