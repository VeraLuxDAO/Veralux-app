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
    <div
      className={cn(
        "bg-background p-3 sm:p-4 safe-area-bottom border-t border-border/50",
        className
      )}
    >
      <div className="flex items-end gap-3 sm:gap-4 max-w-full">
        {/* Add/Attachment Button */}
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 p-0 rounded-full hover:bg-muted/80 active:scale-95 transition-all duration-200 border border-transparent hover:border-border/50"
          disabled={disabled}
        >
          <Plus className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
        </Button>

        {/* Message Input Container */}
        <div className="flex-1 relative min-w-0">
          <div
            className={cn(
              "flex items-end bg-muted/60 rounded-2xl transition-all duration-200 border border-border/30",
              isExpanded && "rounded-3xl",
              "focus-within:border-primary/40 focus-within:bg-muted/80 focus-within:shadow-sm"
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
                "flex-1 min-h-[44px] sm:min-h-[48px] max-h-32 resize-none border-0 bg-transparent",
                "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/70 text-base sm:text-base leading-6 py-3 sm:py-3.5 px-4 sm:px-5",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20 font-normal"
              )}
              rows={1}
              style={{ fontSize: "16px" }} // Prevent zoom on iOS
            />

            {/* Input Actions */}
            <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 sm:w-9 sm:h-9 p-0 hover:bg-background/80 rounded-full active:scale-95 transition-all duration-200"
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 sm:w-9 sm:h-9 p-0 hover:bg-background/80 rounded-full active:scale-95 transition-all duration-200"
                disabled={disabled}
              >
                <Smile className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className={cn(
            "flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 p-0 rounded-full transition-all duration-200",
            "active:scale-95 disabled:scale-100 disabled:opacity-50",
            message.trim()
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl border-0"
              : "bg-muted/60 text-muted-foreground cursor-not-allowed border border-border/30"
          )}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
