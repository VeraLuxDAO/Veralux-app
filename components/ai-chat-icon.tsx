"use client";

import * as React from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";

interface AIChatIconProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

function AIChatIconContent({
  onClick,
  isOpen,
  className = "",
}: AIChatIconProps) {
  return (
    <Button
      onClick={onClick}
      className={`ai-chat-icon fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl ${className}`}
      aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
    >
      <div className="relative">
        {isOpen ? (
          <X className="h-7 w-7 transition-all duration-300" />
        ) : (
          <MessageCircle className="h-7 w-7 transition-all duration-300" />
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse border-2 border-background"></div>
        )}
      </div>
    </Button>
  );
}

export function AIChatIcon(props: AIChatIconProps) {
  return (
    <ClientOnly
      fallback={
        <Button
          className="ai-chat-icon fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl"
          disabled
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      }
    >
      <AIChatIconContent {...props} />
    </ClientOnly>
  );
}
