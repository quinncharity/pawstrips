"use client"

import { useState, useCallback } from "react"
import useSWRMutation from "swr/mutation"
import { Header } from "./header"
import { ImageUploader } from "./image-uploader"
import { PromptInput } from "./prompt-input"
import { ComicDisplay } from "./comic-display"
import { GeneratingState } from "./generating-state"
import { ApiKeyInput, useApiKey } from "./api-key-input"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw, KeyRound } from "lucide-react"

interface ComicResult {
  text: string
  images: Array<{
    base64: string
    mediaType: string
  }>
}

async function generateComic(
  url: string,
  { arg }: { arg: { imageBase64: string; prompt: string; apiKey: string } },
): Promise<ComicResult> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to generate comic")
  }

  return response.json()
}

export function ComicGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const { apiKey, setApiKey, clearApiKey } = useApiKey()

  const {
    trigger,
    data: comicResult,
    isMutating: isGenerating,
    error,
    reset,
  } = useSWRMutation("/api/generate-comic", generateComic)

  const handleImageUpload = useCallback((imageBase64: string) => {
    setUploadedImage(imageBase64)
  }, [])

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null)
  }, [])

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim() || !apiKey) return
    await trigger({ imageBase64: uploadedImage, prompt: prompt.trim(), apiKey })
  }

  const handleReset = () => {
    setUploadedImage(null)
    setPrompt("")
    reset()
  }

  const canGenerate = uploadedImage && prompt.trim().length > 0 && !isGenerating && apiKey

  // Gate the UI behind API key entry
  if (!apiKey) {
    return <ApiKeyInput onKeySet={setApiKey} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {!comicResult ? (
          <div className="space-y-8">
            {/* API Key Status */}
            <div className="flex justify-end">
              <button
                onClick={clearApiKey}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary/30 hover:bg-secondary/50"
              >
                <KeyRound className="w-3 h-3" />
                Change API Key
              </button>
            </div>

            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                disabled={isGenerating}
              />
              <PromptInput prompt={prompt} onPromptChange={setPrompt} disabled={isGenerating} />
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="px-8 py-6 text-lg font-serif tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Comic Strip!
              </Button>
            </div>

            {/* Generating State */}
            {isGenerating && <GeneratingState />}

            {/* Error State */}
            {error && (
              <div className="text-center p-6 bg-destructive/10 rounded-lg border-2 border-destructive">
                <p className="text-destructive font-medium">
                  {error.message || "Oops! Something went wrong. Please try again."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Comic Display */}
            <ComicDisplay images={comicResult.images} text={comicResult.text} originalDogImage={uploadedImage} />

            {/* Create New Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="px-8 py-6 text-lg font-serif tracking-wide shadow-md hover:shadow-lg transition-all duration-300 bg-transparent"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Create Another Comic
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground border-t bg-card/50">
        <p className="text-sm">Made with 🐕 love • Powered by Nano Banana Pro AI</p>
      </footer>
    </div>
  )
}
