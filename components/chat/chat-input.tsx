"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Message in current circle channel",
  disabled = false,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      // Expand if content is more than one line
      setIsExpanded(textareaRef.current.scrollHeight > 40);
    }
  };

  return (
    <div className={cn("bg-background p-4 sm:p-5 safe-area-bottom", className)}>
      <div className="flex items-end gap-3 sm:gap-4 max-w-full">
        {/* Message Input Container */}
        <div className="flex-1 relative min-w-0">
          <div
            className={cn(
              "flex items-end bg-muted/40 rounded-3xl transition-all duration-200 border border-border/20",
              isExpanded && "rounded-3xl",
              "focus-within:border-primary/30 focus-within:bg-muted/60 focus-within:shadow-sm"
            )}
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "flex-1 min-h-[48px] sm:min-h-[52px] max-h-32 resize-none border-0 bg-transparent",
                "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/60 text-base sm:text-base leading-6 py-3.5 sm:py-4 px-5 sm:px-6",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20 font-normal rounded-3xl"
              )}
              rows={1}
              style={{ fontSize: "16px" }} // Prevent zoom on iOS
            />
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className={cn(
            "flex-shrink-0 w-12 h-12 sm:w-13 sm:h-13 p-0 rounded-full transition-all duration-200",
            "active:scale-95 disabled:scale-100 disabled:opacity-50",
            message.trim()
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl border-0"
              : "bg-muted/60 text-muted-foreground cursor-not-allowed border border-border/30"
          )}
        >
          <Send className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
