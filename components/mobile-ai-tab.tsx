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
      {/* AI Tab Button */}
      <div
        className={cn(
          "mobile-ai-tab fixed right-0 top-1/2 transform -translate-y-1/2 z-40 md:hidden",
          className
        )}
      >
        <Button
          onClick={handleToggle}
          className={cn(
            "ai-tab-button h-12 w-8 rounded-l-xl rounded-r-none",
            "bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            "text-primary-foreground shadow-lg transition-all duration-300",
            "flex flex-col items-center justify-center space-y-1",
            isOpen && "-translate-x-80"
          )}
        >
          <>
            <Bot className="h-4 w-4" />
            <span className="text-xs font-medium">AI</span>
          </>
        </Button>
      </div>

      {/* AI Chat Slide Out */}
      <div
        className={cn(
          "mobile-ai-slideout fixed right-16 top-0 h-full w-80 max-w-[90vw] z-30 md:hidden",
          "transform transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <AIChatBar
          isOpen={isOpen}
          onClose={handleClose}
          className="h-full w-full rounded-none border-r border-border"
        />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
