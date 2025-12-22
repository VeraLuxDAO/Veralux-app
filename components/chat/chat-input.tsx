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
  onSendMessage: (content: string, images?: File[]) => void;
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if ((trimmedMessage || selectedImages.length > 0) && !disabled) {
      onSendMessage(trimmedMessage || "", selectedImages.length > 0 ? selectedImages : undefined);
      setMessage("");
      setSelectedImages([]);
      setImagePreviews([]);
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageFiles: File[] = [];
    Array.from(files).forEach((file) => {
      // Only accept image files
      if (file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    });

    if (imageFiles.length > 0) {
      const newPreviews: string[] = [];
      let loadedCount = 0;

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            loadedCount++;
            if (loadedCount === imageFiles.length) {
              setImagePreviews((prev) => [...prev, ...newPreviews]);
              setSelectedImages((prev) => [...prev, ...imageFiles]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="px-3 pt-3 pb-2 flex gap-2 overflow-x-auto">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 group"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
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
                "focus-within:bg-[rgba(229,247,253,0.06)]"
              )}
              style={{
                backgroundColor: "rgba(229, 247, 253, 0.04)",
              }}
            >
              {/* Left: Emoji Picker - Inside input field */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  trigger={
                    <button
                      className="w-4 h-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex items-center justify-center transition-colors cursor-pointer"
                      title="Emoji"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                  }
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
                  "w-full min-h-[36px] max-h-40 resize-none border-0 bg-transparent",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "leading-relaxed",
                  "py-[10px] pl-10 pr-20 font-medium",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 rounded-2xl md:rounded-3xl",
                  "placeholder:text-[#9BB6CC99]"
                )}
                rows={1}
                style={{
                  fontSize: "14px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  color: "#9BB6CC99",
                  fontFamily: "'Geist'",
                }}
              />

              {/* Right: Action Buttons - Inside input field */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
                {/* Voice Message Button */}
                <button
                  onClick={() => {
                    // Handle voice message recording
                    console.log("Voice message recording");
                    // TODO: Implement voice recording logic
                  }}
                  className="w-4 h-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex items-center justify-center transition-colors cursor-pointer"
                  title="Voice message"
                >
                  <Mic className="h-4 w-4" />
                </button>

                {/* Upload File Button - Telegram style Paperclip */}
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-4 h-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex items-center justify-center transition-colors cursor-pointer"
                    title="Attach image"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={(!message.trim() && selectedImages.length === 0) || disabled}
                  className={cn(
                    "w-4 h-4 p-0 rounded-full transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    (message.trim() || selectedImages.length > 0)
                      ? [
                          "bg-transparent hover:bg-white/10",
                          "text-[#9BB6CC99]",
                        ]
                      : [
                          "bg-transparent",
                          "text-[#9BB6CC99] opacity-60 cursor-not-allowed",
                        ],
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <Send
                    className={cn(
                      "h-4 w-4 transition-all duration-200"
                    )}
                  />
                </button>
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
            {/* Hidden file input for mobile */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
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
                title="Attach image"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
              </div>

              {/* Send */}
              <div
                onClick={handleSend}
                className={cn(
                  "h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 flex-shrink-0 flex items-center justify-center cursor-pointer",
                  (!message.trim() && selectedImages.length === 0) && "opacity-60 cursor-not-allowed",
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
