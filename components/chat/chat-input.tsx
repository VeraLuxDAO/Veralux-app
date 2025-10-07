"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  Send,
  Smile,
  Sticker,
  MoreHorizontal,
  X,
} from "lucide-react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <div className="flex gap-1 sm:gap-2 max-w-full items-center">
        {/* Desktop Layout (>= 450px) */}
        <div className="hidden min-[450px]:flex gap-1 sm:gap-2 flex-1 items-center">
          {/* Media Button (Left) */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 p-0 rounded-full media-button chat-input-action group"
            disabled={disabled}
          >
            <ImagePlus className="h-5 w-5 sm:h-5 sm:w-5 text-primary group-hover:text-primary/80 transition-colors" />
          </Button>

          {/* Message Input Container */}
          <div className="flex-1 relative min-w-0">
            <div
              className={cn(
                "flex items-end bg-muted/40 rounded-3xl transition-all duration-200 border border-border/20",
                isExpanded && "rounded-3xl",
                "focus-within:border-primary/30 focus-within:bg-muted/60 focus-within:shadow-sm"
              )}
            >
              {/* Text Input */}
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
                  "placeholder:text-muted-foreground/60 text-base sm:text-base leading-6 py-3.5 sm:py-4 pl-5 sm:pl-6 pr-3 sm:pr-4",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 font-normal rounded-3xl overflow-hidden"
                )}
                rows={1}
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />

              {/* Right Side Actions */}
              <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-3 py-2 flex-shrink-0">
                {/* Emoji Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 sm:w-9 sm:h-9 p-0 chat-input-action group"
                  disabled={disabled}
                >
                  <Smile className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>

                {/* GIF/Stickers Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 sm:w-9 sm:h-9 p-0 chat-input-action group"
                  disabled={disabled}
                >
                  <Sticker className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout (< 450px) */}
        <div className="flex min-[450px]:hidden items-end gap-3 flex-1 relative">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 w-10 h-10 p-0 rounded-full chat-input-action group"
            disabled={disabled}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreHorizontal className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>

          {/* Mobile Actions Menu */}
          {showMobileMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-2xl shadow-lg p-2 flex gap-2 z-50 mobile-actions-menu">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full media-button chat-input-action group"
                disabled={disabled}
                onClick={() => setShowMobileMenu(false)}
              >
                <ImagePlus className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full chat-input-action group"
                disabled={disabled}
                onClick={() => setShowMobileMenu(false)}
              >
                <Smile className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full chat-input-action group"
                disabled={disabled}
                onClick={() => setShowMobileMenu(false)}
              >
                <Sticker className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-muted/80"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}

          {/* Mobile Message Input Container */}
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
                  "flex-1 min-h-[48px] max-h-32 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground/60 text-base leading-6 py-3.5 px-5",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 font-normal rounded-3xl overflow-hidden"
                )}
                rows={1}
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />
            </div>
          </div>
        </div>

        {/* Send Button (Always visible) */}
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

      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 min-[450px]:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}
