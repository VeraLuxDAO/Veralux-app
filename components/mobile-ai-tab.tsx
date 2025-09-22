"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatBar } from "@/components/ai-chat-bar";
import { Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileAITabProps {
  className?: string;
}

export function MobileAITab({ className }: MobileAITabProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* AI Tab Button - Hide when modal is open */}
      {!isOpen && (
        <div
          className={cn(
            "mobile-ai-tab fixed right-0 top-1/2 transform -translate-y-1/2 z-40 md:hidden",
            "transition-all duration-300 ease-in-out",
            className
          )}
        >
          <Button
            onClick={handleToggle}
            className={cn(
              "ai-tab-button h-12 w-8 rounded-l-xl rounded-r-none",
              "bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
              "text-primary-foreground shadow-lg transition-all duration-300",
              "flex flex-col items-center justify-center space-y-1"
            )}
          >
            <Bot className="h-4 w-4" />
            <span className="text-xs font-medium">AI</span>
          </Button>
        </div>
      )}

      {/* AI Chat Centered Modal with Animation - All Mobile Resolutions */}
      <div
        className={cn(
          "mobile-ai-modal fixed top-0 left-0 right-0 bottom-0 z-30 md:hidden",
          "flex items-center justify-center",
          "px-2 py-4 sm:px-4 sm:py-6",
          "transition-all duration-500 ease-in-out",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "w-full h-full",
            "max-w-[calc(100vw-1rem)] max-h-[calc(100vh-2rem)]",
            "sm:max-w-md sm:max-h-[80vh]",
            "min-h-[400px] min-w-[280px]"
          )}
        >
          <AIChatBar
            isOpen={isOpen}
            onClose={handleClose}
            className="h-full w-full rounded-xl border shadow-2xl bg-card"
          />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
    </>
  );
}
