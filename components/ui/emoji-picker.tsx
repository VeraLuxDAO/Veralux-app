"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOJI_CATEGORIES, searchEmojis } from "@/lib/emoji-data";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  className?: string;
  align?: "left" | "right"; // Position alignment
}

export function EmojiPicker({
  onEmojiSelect,
  trigger,
  className,
  align = "left",
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchEmojis(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Calculate position relative to trigger button
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 475;
      const popupWidth = isMobile ? Math.min(404, window.innerWidth - 20) : 404;
      const popupHeight = 396;

      // Position above the button, aligned to the right edge of the trigger
      const rightAligned = triggerRect.right - popupWidth;
      const left = isMobile
        ? Math.max(
            10,
            Math.min(rightAligned, window.innerWidth - popupWidth - 10)
          )
        : rightAligned;
      const top = triggerRect.top - popupHeight - 8; // 8px gap above button

      setPosition({
        top: Math.max(10, top), // Ensure it doesn't go off-screen
        left: Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10)),
      });
    }
  }, [isOpen]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  const allEmojis = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
  const displayedEmojis =
    searchQuery.trim().length > 0 ? searchResults : allEmojis;

  const defaultTrigger = (
    <Button
      ref={triggerRef}
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-full group flex-shrink-0",
        "hover:bg-muted/60 active:bg-muted/80",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      {/* Popup Portal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={popupRef}
            className={cn(
              "absolute emoji-popup",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200",
              "border",
              "transition-all duration-200 ease-out"
            )}
            style={{
              bottom: "80px",
              ...(align === "left" ? { left: "0px" } : { right: "80px" }),
              pointerEvents: "auto",
              width: "404px",
              height: "396px",
              maxWidth: "calc(100vw - 20px)",
              maxHeight: "90vh",
              borderRadius: "24px",
              borderColor: "#FFFFFF0F",
              background: "#0000004A",
            }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#FFFFFF0F" }}>
                <div className="text-sm font-semibold text-white">Emoji</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b" style={{ borderColor: "#FFFFFF0F" }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search emoji"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-10 pr-3 bg-transparent border border-white/10 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-0 focus-visible:border-white/30"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "#FFFFFF0F" }} />

              {/* Emoji Grid */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto px-4 py-3">
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                    }}
                  >
                    {displayedEmojis.map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        onClick={() => handleEmojiClick(emoji)}
                        className="h-9 w-9 rounded-[10px] bg-[#E5F7FD0F] text-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
