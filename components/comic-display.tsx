"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Download, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComicDisplayProps {
  images: Array<{
    base64: string;
    mediaType: string;
  }>;
  text: string;
  originalDogImage: string | null;
}

export function ComicDisplay({
  images,
  text,
  originalDogImage,
}: ComicDisplayProps) {
  const comicImage = images[0]; // Single comic strip
  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFullscreen();
      }
    };
    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isFullscreen, closeFullscreen]);

  const handleDownload = () => {
    if (!comicImage) return;
    const link = document.createElement("a");
    link.href = comicImage.base64.startsWith("data:")
      ? comicImage.base64
      : `data:${comicImage.mediaType};base64,${comicImage.base64}`;
    link.download = `pawstrips-comic.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!comicImage) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">No comic generated yet.</p>
      </div>
    );
  }

  const imageSrc = comicImage.base64.startsWith("data:")
    ? comicImage.base64
    : `data:${comicImage.mediaType};base64,${comicImage.base64}`;

  return (
    <div className="space-y-8 animate-bounce-in">
      {/* Hero Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          Comic Generated!
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-wide">
          Your Pup&apos;s Adventure
        </h2>
      </div>

      {/* Main Comic Display */}
      <div className="relative max-w-4xl mx-auto">
        {/* Comic Frame */}
        <div className="comic-frame relative">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-foreground rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-foreground rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-foreground rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-foreground rounded-br-lg" />

          {/* The Comic Strip */}
          <Card className="comic-panel overflow-hidden p-0 border-4 border-foreground shadow-xl">
            <div className="relative">
              <img
                src={imageSrc}
                alt="Your generated comic strip"
                className="w-full h-auto cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => setIsFullscreen(true)}
                title="Click to view fullscreen"
              />
              <div className="absolute inset-0 halftone-overlay pointer-events-none" />
            </div>
          </Card>
        </div>

        {/* Original Photo Badge */}
        {originalDogImage && (
          <div className="absolute -bottom-6 -right-6 md:-right-12 transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="relative">
              {/* Polaroid-style frame */}
              <div className="bg-white p-2 pb-8 rounded shadow-lg border-2 border-foreground/20">
                <img
                  src={originalDogImage}
                  alt="The star of the comic"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-sm"
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-xs font-serif text-foreground/70">
                  ⭐ The Star
                </p>
              </div>
              {/* Tape effect */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-accent/80 rounded-sm transform -rotate-2 shadow-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Story Card */}
      {text && (
        <Card className="max-w-3xl mx-auto p-8 bg-card/80 backdrop-blur border-2 shadow-lg relative overflow-hidden">
          {/* Decorative quote marks */}
          <div className="absolute top-4 left-4 text-6xl text-primary/10 font-serif leading-none select-none">
            "
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-2xl mb-4 flex items-center gap-3 text-primary">
              <span className="text-3xl">📖</span>
              The Story
            </h3>
            <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap pl-4 border-l-4 border-primary/30">
              {text}
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap pt-4">
        <Button
          size="lg"
          onClick={handleDownload}
          className="px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Comic Strip
        </Button>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Hint text */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            Press ESC or click anywhere to close
          </p>

          {/* Fullscreen image */}
          <img
            src={imageSrc}
            alt="Your generated comic strip - fullscreen"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
