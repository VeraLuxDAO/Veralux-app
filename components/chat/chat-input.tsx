"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  ImagePlus,
  Send,
  Sticker,
  MoreHorizontal,
  X,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  forceDesktop?: boolean;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Message in current circle channel",
  disabled = false,
  className,
  forceDesktop = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 450);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleEmojiSelect = (emoji: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = message;

    // Insert emoji at cursor position
    const newValue =
      currentValue.slice(0, start) + emoji + currentValue.slice(end);
    setMessage(newValue);

    // Restore cursor position after emoji
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + emoji.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);

    // Auto-resize textarea
    setTimeout(() => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setIsExpanded(textarea.scrollHeight > 40);
      }
    }, 0);
  };

  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur-md border-t border-border/50",
        "p-3 sm:p-4 md:p-5 safe-area-bottom",
        "shadow-lg shadow-black/5 chat-input-container",
        className
      )}
    >
      <div className="flex gap-2 sm:gap-3 max-w-full items-center">
        {/* Telegram-Style Desktop Layout (>= 450px or forceDesktop) */}
        <div
          className={cn(
            "gap-3 sm:gap-4 flex-1 items-center",
            forceDesktop ? "flex" : "hidden min-[450px]:flex"
          )}
        >
          {/* Emoji Picker - Outside input field */}
          <div className="flex-shrink-0">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10"
            />
          </div>

          {/* Message Input Container */}
          <div className="flex-1 relative min-w-0">
            <div
              className={cn(
                "relative rounded-2xl sm:rounded-3xl transition-all duration-200",
                "bg-muted/30 hover:bg-muted/40",
                "border border-border/30 hover:border-border/50",
                "focus-within:border-primary/50 focus-within:bg-background/90",
                "focus-within:shadow-sm focus-within:shadow-primary/10"
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
                  "w-full min-h-[44px] xs:min-h-[48px] sm:min-h-[52px] max-h-40 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground/60 text-sm xs:text-base sm:text-lg leading-relaxed",
                  "py-2.5 xs:py-3 sm:py-4 pl-3 xs:pl-4 sm:pl-5 pr-12 xs:pr-14 sm:pr-16 font-medium",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 rounded-2xl sm:rounded-3xl mobile-search-input"
                )}
                rows={1}
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />

              {/* Right: Attachment Button */}
              <div className="absolute right-1.5 xs:right-2 sm:right-3 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 p-0 rounded-full group flex-shrink-0",
                    "hover:bg-muted/60 active:bg-muted/80",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                  onClick={() => {
                    // Handle attachment functionality
                    console.log("Attachment clicked");
                  }}
                >
                  <ImagePlus className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram-Style Mobile Layout (< 450px and not forceDesktop) */}
        <div
          className={cn(
            "flex items-end gap-2 flex-1 relative",
            forceDesktop ? "hidden" : "flex min-[450px]:hidden"
          )}
        >
          {/* Emoji Picker - Outside input field */}
          <div className="flex-shrink-0">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              className="w-8 h-8 xs:w-9 xs:h-9"
            />
          </div>

          {/* Center: Input Container (Telegram Style) */}
          <div className="flex-1 relative min-w-0">
            <div
              className={cn(
                "relative rounded-2xl transition-all duration-200",
                "bg-muted/30 hover:bg-muted/40",
                "border border-border/30 hover:border-border/50",
                "focus-within:border-primary/50 focus-within:bg-background/90",
                "focus-within:shadow-sm focus-within:shadow-primary/10"
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
                  "w-full min-h-[40px] xs:min-h-[44px] max-h-32 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground/60 text-sm xs:text-base leading-relaxed",
                  "py-2.5 xs:py-3 pl-3 xs:pl-4 pr-10 xs:pr-12 rounded-2xl mobile-search-input",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20"
                )}
                rows={1}
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />

              {/* Right: Attachment Button */}
              <div className="absolute right-1.5 xs:right-2 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-7 h-7 xs:w-8 xs:h-8 p-0 rounded-full group flex-shrink-0",
                    "hover:bg-muted/60 active:bg-muted/80",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                  onClick={() => {
                    // Handle attachment functionality
                    console.log("Attachment clicked");
                  }}
                >
                  <ImagePlus className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Send Button (Always visible) */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className={cn(
            "flex-shrink-0 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 p-0 rounded-full mobile-touch-target",
            "transition-all duration-300 ease-out transform",
            "active:scale-90 disabled:scale-100",
            "shadow-lg hover:shadow-xl disabled:shadow-sm",
            message.trim() && "send-button-active",
            message.trim()
              ? [
                  "bg-gradient-to-br from-primary via-primary to-primary/90",
                  "hover:from-primary/95 hover:via-primary/90 hover:to-primary/80",
                  "text-primary-foreground border-0",
                  "hover:scale-110 hover:rotate-12",
                  "shadow-primary/25 hover:shadow-primary/40",
                ]
              : [
                  "bg-gradient-to-br from-muted/80 to-muted/60",
                  "text-muted-foreground/60 cursor-not-allowed",
                  "border border-border/20 opacity-60",
                ]
          )}
        >
          <Send
            className={cn(
              "transition-all duration-200",
              message.trim()
                ? "h-5 w-5 sm:h-6 sm:w-6 ml-0.5 text-primary-foreground"
                : "h-5 w-5 sm:h-5 sm:w-5 ml-0.5 text-muted-foreground/50"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
