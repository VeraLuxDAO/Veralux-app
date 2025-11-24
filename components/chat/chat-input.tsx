"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  };

  const handleEmojiSelect = (emoji: string) => {
    // For mobile Input, just append emoji to the end
    setMessage((prev) => prev + emoji);
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

        {/* Mobile Layout (< 768px and not forceDesktop) - Matching Private Room Design */}
        <div
          className={cn(
            "flex items-center flex-1 relative",
            forceDesktop ? "hidden" : "flex md:hidden"
          )}
        >
          {/* Input Container - Matching Private Room Style */}
          <div className="flex w-full items-center rounded-full bg-[#E5F7FD0A] border border-white/10 px-3 gap-2">
            {/* Emoji Picker */}
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              trigger={
                <div
                  className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 cursor-pointer"
                  title="Emoji"
                >
                  <Smile className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
                </div>
              }
            />

            {/* Input Field */}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send Message"
              disabled={disabled}
              className="flex-1 h-6 bg-[#E5F7FD0A] border-none text-[#9BB6CC99] text-[14px] placeholder:text-[#9BB6CC99] focus:ring-0 focus-visible:ring-0 px-2 py-0 shadow-none"
              autoComplete="off"
              style={{ fontFamily: "'Geist'", fontSize: "14px !important" }}
            />

            {/* Right icon group: Mic, Paperclip, Send */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mic */}
              <div
                className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 flex items-center justify-center cursor-pointer"
                title="Voice message"
                style={{ maxWidth: "16px !important", maxHeight: "16px !important" }}
                onClick={() => {
                  // Handle microphone click
                }}
              >
                <Mic className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
              </div>

              {/* Paperclip */}
              <div
                className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 flex items-center justify-center cursor-pointer"
                title="Attach file"
                onClick={() => {
                  // Handle attachment click
                }}
              >
                <Paperclip className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
              </div>

              {/* Send */}
              <div
                onClick={handleSend}
                className={cn(
                  "h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 flex-shrink-0 flex items-center justify-center cursor-pointer",
                  !message.trim() && "opacity-60 cursor-not-allowed",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                title="Send message"
              >
                <Send className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3 text-[#9BB6CC99]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
