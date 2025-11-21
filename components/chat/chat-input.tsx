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
  Mic,
  Paperclip,
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

  // Detect mobile device (for any mobile-specific logic if needed)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
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
        "shadow-lg shadow-black/5 chat-input-container p-0",
        className
      )}
      style={{
        padding: "0px !important",
      }}
    >
      <div className="flex gap-2 md:gap-3 max-w-full items-center">
        {/* Desktop/Tablet Layout (>= 768px or forceDesktop) */}
        <div
          className={cn(
            "gap-2 md:gap-3 lg:gap-4 flex-1 items-center",
            forceDesktop ? "flex" : "hidden md:flex"
          )}
        >
          {/* Message Input Container */}
          <div className="flex-1 relative min-w-0">
            <div
              className={cn(
                "relative rounded-2xl md:rounded-3xl transition-all duration-200",
                "bg-muted/30 hover:bg-muted/40",
                "border border-border/30 hover:border-border/50",
                "focus-within:border-primary/50 focus-within:bg-background/90",
                "focus-within:shadow-sm focus-within:shadow-primary/10"
              )}
            >
              {/* Left: Emoji Picker - Inside input field */}
              <div className="absolute left-1.5 md:left-2 lg:left-3 top-1/2 -translate-y-1/2 z-10">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
                />
              </div>

              {/* Text Input */}
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "w-full min-h-[44px] md:min-h-[48px] lg:min-h-[52px] max-h-40 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground/60 text-sm md:text-base lg:text-lg leading-relaxed",
                  "py-2.5 md:py-3 lg:py-4 pl-11 md:pl-12 lg:pl-14 pr-12 md:pr-14 lg:pr-16 font-medium",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 rounded-2xl md:rounded-3xl"
                )}
                rows={1}
                style={{
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />

              {/* Right: Send Button - Inside input field */}
              <div className="absolute right-1.5 md:right-2 lg:right-3 top-1/2 -translate-y-1/2 z-10">
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || disabled}
                  size="sm"
                  className={cn(
                    "w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 p-0 rounded-full transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    message.trim()
                      ? [
                          "bg-gradient-to-br from-primary via-primary to-primary/90",
                          "hover:from-primary/95 hover:via-primary/90 hover:to-primary/80",
                          "text-primary-foreground border-0",
                          "hover:rotate-12",
                          "shadow-primary/25 hover:shadow-primary/40",
                        ]
                      : [
                          "bg-muted/60",
                          "text-muted-foreground/60 cursor-not-allowed",
                          "border border-border/20 opacity-60",
                        ],
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send
                    className={cn(
                      "h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 transition-all duration-200",
                      message.trim()
                        ? "text-primary-foreground"
                        : "text-muted-foreground/50"
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout (< 768px and not forceDesktop) */}
        <div
          className={cn(
            "flex items-end gap-2 flex-1 relative",
            forceDesktop ? "hidden" : "flex md:hidden"
          )}
        >
          {/* Center: Input Container */}
          <div className="flex-1 relative min-w-0">
            <div
              className={cn(
                "relative rounded-2xl transition-all duration-200",
                "bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)]",
                "border border-[rgba(255,255,255,0.1)]",
                "focus-within:border-[rgba(255,255,255,0.2)] focus-within:bg-[rgba(255,255,255,0.08)]",
                "backdrop-blur-md"
              )}
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Left: Emoji Picker - Inside input field */}
              <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 z-10">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  className="w-7 h-7"
                />
              </div>

              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send Message"
                disabled={disabled}
                className={cn(
                  "mobile-chat-input w-full min-h-[44px] max-h-32 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-white/50 text-white text-sm leading-relaxed",
                  "py-2.5 pl-10 pr-20 rounded-2xl",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20"
                )}
                rows={1}
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />

              {/* Right: Icons Container - Microphone, Paperclip, Send */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center">
                {/* Microphone Icon */}
                <div
                  className="w-7 h-7 p-0 hover:bg-transparent flex items-center justify-center"
                  onClick={() => {
                    // Handle microphone click
                  }}
                >
                  <Mic className="h-5 w-5 text-white/70" />
                </div>

                {/* Paperclip Icon */}
                <div
                  className="w-7 h-7 p-0 hover:bg-transparent flex items-center justify-center"
                  onClick={() => {
                    // Handle attachment click
                  }}
                >
                  <Paperclip className="h-5 w-5 text-white/70" />
                </div>

                {/* Send Button */}
                <div
                  onClick={handleSend}
                  className={cn(
                    "flex items-center justify-center",
                    "w-7 h-7 p-0 rounded-full transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    message.trim()
                      ? [
                          "bg-gradient-to-br from-primary via-primary to-primary/90",
                          "hover:from-primary/95 hover:via-primary/90 hover:to-primary/80",
                          "text-primary-foreground border-0",
                          "hover:rotate-12",
                          "shadow-primary/25 hover:shadow-primary/40",
                        ]
                      : [
                          "bg-transparent",
                          "text-white/50 cursor-not-allowed",
                          "border-0 opacity-60",
                        ],
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      message.trim()
                        ? "text-primary-foreground"
                        : "text-white/50"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
