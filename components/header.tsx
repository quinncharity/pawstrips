import { Dog, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="py-6 px-4 border-b-4 border-foreground bg-card shadow-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Dog className="w-10 h-10 text-primary" />
            <Zap className="w-4 h-4 text-accent absolute -top-1 -right-1 fill-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-wider text-foreground">PawStrips</h1>
        </div>
        <p className="text-center mt-2 text-muted-foreground font-medium">
          Transform your furry friend into a comic star! ✨
        </p>
      </div>
    </header>
  )
}
