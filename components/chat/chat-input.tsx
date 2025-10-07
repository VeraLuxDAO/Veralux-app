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
    <div className={cn("bg-background p-3 sm:p-4 safe-area-bottom", className)}>
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Add/Attachment Button */}
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full hover:bg-muted active:scale-95 transition-transform"
          disabled={disabled}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div
            className={cn(
              "flex items-end bg-muted rounded-2xl transition-all duration-200 border border-transparent",
              isExpanded && "rounded-3xl",
              "focus-within:border-primary/20 focus-within:bg-muted/80"
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
                "flex-1 min-h-[36px] sm:min-h-[40px] max-h-32 resize-none border-0 bg-transparent",
                "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground text-sm leading-5 py-2 sm:py-2.5 px-3 sm:px-4",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20"
              )}
              rows={1}
            />

            {/* Input Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 sm:w-8 sm:h-8 p-0 hover:bg-background/80 rounded-full active:scale-95 transition-transform"
                disabled={disabled}
              >
                <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 sm:w-8 sm:h-8 p-0 hover:bg-background/80 rounded-full active:scale-95 transition-transform"
                disabled={disabled}
              >
                <Smile className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
            "flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full transition-all duration-200",
            "active:scale-95 disabled:scale-100",
            message.trim()
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
