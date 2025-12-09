"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Key, Eye, EyeOff, Check, ExternalLink } from "lucide-react"

const STORAGE_KEY = "vercel-ai-gateway-key"

interface ApiKeyInputProps {
  onKeySet: (key: string) => void
}

export function ApiKeyInput({ onKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing key on mount
  useEffect(() => {
    const storedKey = sessionStorage.getItem(STORAGE_KEY)
    if (storedKey) {
      setApiKey(storedKey)
      onKeySet(storedKey)
    }
    setIsLoading(false)
  }, [onKeySet])

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem(STORAGE_KEY, apiKey.trim())
      onKeySet(apiKey.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && apiKey.trim()) {
      handleSaveKey()
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="bg-accent/30 text-center">
          <div className="mx-auto mb-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif tracking-wide">
            Enter Your API Key
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            PawStrips uses the Vercel AI Gateway. Enter your API key to get started.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium">
              Vercel AI Gateway API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your API key..."
                className="pr-10 border-2 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="w-full py-5 text-lg font-serif tracking-wide shadow-md hover:shadow-lg transition-all"
          >
            <Check className="w-5 h-5 mr-2" />
            Start Creating Comics
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Your API key is stored only in this browser session and is never saved on our servers.
            </p>
            <a
              href="https://vercel.com/docs/ai-gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              Get a Vercel AI Gateway API Key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    const storedKey = sessionStorage.getItem(STORAGE_KEY)
    if (storedKey) {
      setApiKey(storedKey)
    }
  }, [])

  const clearApiKey = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setApiKey(null)
  }

  return { apiKey, setApiKey, clearApiKey }
}

