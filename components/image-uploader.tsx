"use client"

import type React from "react"

import { useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Camera, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  uploadedImage: string | null
  onImageUpload: (imageBase64: string) => void
  onRemoveImage: () => void
  disabled?: boolean
}

export function ImageUploader({ uploadedImage, onImageUpload, onRemoveImage, disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        onImageUpload(base64)
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const file = event.dataTransfer.files?.[0]
      if (!file || !file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        onImageUpload(base64)
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <Card className="shadow-lg border-2 overflow-hidden">
      <CardHeader className="bg-secondary/30 py-4 -mt-6 -mx-px rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="w-5 h-5 text-primary" />
          Upload Your Pup&apos;s Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {uploadedImage ? (
          <div className="relative group">
            <div className="comic-panel aspect-square">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Your uploaded dog"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              onClick={onRemoveImage}
              disabled={disabled}
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="mt-3 text-center text-sm text-muted-foreground">
              ✅ Looking good! Your pup is ready to be a star.
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-3 border-dashed border-primary/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 aspect-square flex flex-col items-center justify-center gap-4"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            aria-label="Upload image"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drop your dog&apos;s photo here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent" disabled={disabled}>
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
          aria-label="File input"
        />
      </CardContent>
    </Card>
  )
}
