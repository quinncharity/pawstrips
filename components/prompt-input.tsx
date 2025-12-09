"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Pencil, Lightbulb } from "lucide-react"

interface PromptInputProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  disabled?: boolean
}

const examplePrompts = [
  "A superhero adventure where my dog saves the city from a giant squirrel",
  "A day at the beach with sandcastles and seagulls",
  "My dog becomes a famous chef in Paris",
  "A space mission to the moon with astronaut dogs",
]

export function PromptInput({ prompt, onPromptChange, disabled = false }: PromptInputProps) {
  return (
    <Card className="shadow-lg border-2 overflow-hidden h-full">
      <CardHeader className="bg-accent/30 py-4 -mt-6 -mx-px rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pencil className="w-5 h-5 text-primary" />
          Describe Your Story
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[calc(100%-4rem)]">
        <div className="flex-1 space-y-3">
          <Label htmlFor="prompt" className="text-sm font-medium">
            What adventure should your dog have?
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., My dog discovers a magical portal in the backyard that leads to a world made entirely of treats..."
            className="min-h-[150px] resize-none border-2 focus:border-primary transition-colors text-base"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Be as detailed as you like! Include characters, settings, and plot points.
          </p>
        </div>

        {/* Example prompts */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Lightbulb className="w-4 h-4" />
            Need inspiration?
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => onPromptChange(example)}
                disabled={disabled}
                className="text-xs px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-full transition-colors disabled:opacity-50"
              >
                {example.slice(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
