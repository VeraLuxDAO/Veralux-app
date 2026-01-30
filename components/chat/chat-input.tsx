"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { ArrowUp, X, Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string, images?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  forceDesktop?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Message in current circle channel",
  disabled = false,
  className,
  forceDesktop = false,
  value,
  onChange,
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

  const isControlled = typeof value === "string" && typeof onChange === "function";
  const currentMessage = isControlled ? value : message;

  const setMessageValue = (nextValue: string) => {
    if (isControlled && onChange) {
      onChange(nextValue);
    } else {
      setMessage(nextValue);
    }
  };

  const handleSend = () => {
    const trimmedMessage = currentMessage.trim();
    if ((trimmedMessage || selectedImages.length > 0) && !disabled) {
      onSendMessage(trimmedMessage || "", selectedImages.length > 0 ? selectedImages : undefined);
      setMessageValue("");
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
    setMessageValue(value);
  };

  const handleEmojiSelect = (emoji: string) => {
    // For mobile Input, just append emoji to the end
    setMessageValue(currentMessage + emoji);
  };

  return (
    <div
      className={cn(
        "chat-input-container p-0",
        className
      )}
      style={{
        padding: "0px !important",
        background: "transparent",
        border: "none",
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
        {/* Desktop/Tablet Layout (>= 768px or forceDesktop) - Sample design: input bar + separate send circle */}
        <div
          className={cn(
            "gap-2 md:gap-3 flex-1 items-center w-full",
            forceDesktop ? "flex" : "hidden md:flex"
          )}
        >
          {/* Message Input Bar - dark grey rounded rectangle, emoji left, paperclip right */}
          <div className="flex-1 relative min-w-0">
            <div
              className="relative rounded-full md:rounded-[22px] transition-all duration-200 min-h-[44px] flex items-center"
              style={{
                backgroundColor: "rgba(30, 38, 45, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              {/* Left: Emoji - light blue outline */}
              <div className="flex-shrink-0 pl-3 md:pl-4">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  trigger={
                    <button
                      type="button"
                      className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#7eb8e6] flex items-center justify-center transition-colors cursor-pointer"
                      title="Emoji"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  }
                />
              </div>

              {/* Text Input */}
              <Textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "flex-1 min-h-[36px] max-h-40 resize-none bg-transparent min-w-0",
                  "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "py-2.5 pl-2 pr-3 font-normal",
                  "scrollbar-thin scrollbar-thumb-muted-foreground/20 rounded-full md:rounded-[22px]",
                  "placeholder:text-[#9BB6CC99]",
                  "border-none"
                )}
                rows={1}
                style={{
                  fontSize: "14px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  color: "#e8eef2",
                  fontFamily: "'Geist'",
                }}
              />

              {/* Right: Paperclip only inside bar - light blue */}
              <div className="flex-shrink-0 pr-3 md:pr-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#7eb8e6] flex items-center justify-center transition-colors cursor-pointer"
                  title="Attach image"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Separate circular Send button - dark grey, light pink outline, upward arrow */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!currentMessage.trim() && selectedImages.length === 0) || disabled}
            className={cn(
              "flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              (!currentMessage.trim() && selectedImages.length === 0) && !disabled && "opacity-70"
            )}
            style={{
              backgroundColor: "rgba(30, 38, 45, 0.95)",
              border: "1.5px solid rgba(216, 164, 196, 0.75)",
              color: "rgba(216, 164, 196, 0.95)",
            }}
            title="Send message"
          >
            <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Mobile Layout (< 768px) - Same sample design: input bar + separate send circle */}
        <div
          className={cn(
            "flex items-center flex-1 gap-2 w-full",
            forceDesktop ? "hidden" : "flex md:hidden"
          )}
        >
          {/* Input Bar - dark grey rounded pill */}
          <div className="flex flex-1 items-center min-h-[44px] rounded-full px-3 min-w-0"
            style={{
              backgroundColor: "rgba(30, 38, 45, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              trigger={
                <button
                  type="button"
                  className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#7eb8e6] flex-shrink-0 flex items-center justify-center cursor-pointer"
                  title="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
              }
            />
            <Input
              value={currentMessage}
              onChange={(e) => setMessageValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 min-w-0 h-8 border-none bg-transparent text-[#e8eef2] text-[14px] placeholder:text-[#9BB6CC99] focus:ring-0 focus-visible:ring-0 px-2 py-0 shadow-none"
              autoComplete="off"
              style={{ fontFamily: "'Geist'" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#7eb8e6] flex-shrink-0 flex items-center justify-center cursor-pointer"
              title="Attach image"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>

          {/* Separate circular Send button - pink outline, upward arrow */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!currentMessage.trim() && selectedImages.length === 0) || disabled}
            className={cn(
              "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              (!currentMessage.trim() && selectedImages.length === 0) && !disabled && "opacity-70"
            )}
            style={{
              backgroundColor: "rgba(30, 38, 45, 0.95)",
              border: "1.5px solid rgba(216, 164, 196, 0.75)",
              color: "rgba(216, 164, 196, 0.95)",
            }}
            title="Send message"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
