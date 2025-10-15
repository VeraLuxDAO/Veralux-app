"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Smile, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  EMOJI_CATEGORIES,
  getRecentEmojis,
  addRecentEmoji,
  searchEmojis,
  type EmojiCategory,
} from "@/lib/emoji-data";

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
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showSearch, setShowSearch] = useState(false);

  const triggerRef = useRef<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();

  // Load recent emojis on mount
  useEffect(() => {
    setRecentEmojis(getRecentEmojis());
  }, [isOpen]);

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
      const isMobile = window.innerWidth <= 480;
      const popupWidth = isMobile ? Math.min(320, window.innerWidth - 20) : 350; // Responsive width
      const popupHeight = isMobile ? 360 : 400; // Responsive height

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
    addRecentEmoji(emoji);
    setRecentEmojis(getRecentEmojis());
    setIsOpen(false);
  };

  const isDark = resolvedTheme === "dark";

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
              "absolute rounded-2xl shadow-2xl emoji-popup",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300",
              "border backdrop-blur-xl",
              // Desktop-optimized sizing
              "w-[320px] h-[420px] md:w-[420px] md:h-[480px]",
              "max-w-[calc(100vw-20px)] max-h-[85vh]",
              // Theme-aware styling with better contrast
              isDark
                ? "bg-[#1a1d2e]/98 border-border/60 shadow-black/50"
                : "bg-white/98 border-border/40 shadow-black/15",
              // Smooth transitions
              "transition-all duration-300 ease-out"
            )}
            style={{
              bottom: "80px",
              ...(align === "left" ? { left: "0px" } : { right: "80px" }),
              pointerEvents: "auto",
            }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header - Desktop Enhanced */}
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 md:px-5 md:py-4 border-b backdrop-blur-sm",
                  isDark
                    ? "border-border/40 bg-background/30"
                    : "border-border/30 bg-background/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 animate-pulse"></div>
                  <h3 className="text-sm md:text-base font-bold text-foreground tracking-tight">
                    Emojis
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSearch(!showSearch);
                    if (!showSearch) {
                      setSearchQuery("");
                    }
                  }}
                  className={cn(
                    "h-8 w-8 md:h-9 md:w-9 p-0 rounded-xl transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    showSearch
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                  title="Search emojis"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Bar - Enhanced Desktop UX */}
              {showSearch && (
                <div
                  className={cn(
                    "px-4 py-3 md:px-5 border-b animate-in slide-in-from-top-2 duration-200",
                    isDark
                      ? "border-border/40 bg-background/20"
                      : "border-border/30 bg-background/10"
                  )}
                >
                  <div className="search-input-container relative group">
                    <Input
                      placeholder="Search emojis..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "pr-10 pl-4 h-9 md:h-10 text-sm md:text-base",
                        "bg-muted/40 border-border/40 rounded-xl",
                        "focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
                        "placeholder:text-muted-foreground/60",
                        "transition-all duration-200",
                        "hover:bg-muted/50 hover:border-border/60"
                      )}
                      autoFocus
                    />
                    <Search className="search-icon-right absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              )}

              {/* Category Tabs - Desktop Optimized */}
              <div
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 border-b overflow-x-auto scrollbar-none",
                  isDark
                    ? "border-border/40 bg-background/10"
                    : "border-border/30 bg-background/5"
                )}
              >
                {/* Recent Tab */}
                {recentEmojis.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory("recent")}
                    className={cn(
                      "h-9 w-9 md:h-10 md:w-10 p-0 rounded-xl flex-shrink-0",
                      "transition-all duration-200 ease-out",
                      "hover:scale-110 active:scale-95",
                      activeCategory === "recent"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                    title="Recently Used"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                )}

                {/* Category Tabs - Enhanced with better feedback */}
                {EMOJI_CATEGORIES.slice(1).map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "h-9 w-9 md:h-10 md:w-10 p-0 rounded-xl flex-shrink-0",
                      "font-emoji text-lg md:text-xl",
                      "transition-all duration-200 ease-out",
                      "hover:scale-110 active:scale-95",
                      activeCategory === category.id
                        ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/20 scale-105"
                        : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/70 hover:shadow-md"
                    )}
                    title={category.name}
                  >
                    <span className="drop-shadow-sm transition-transform duration-200">
                      {category.icon}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Emoji Grid - Desktop Enhanced with Better UX */}
              <div className="flex-1 overflow-hidden relative">
                <div className="h-full overflow-y-auto px-3 md:px-4 py-3 md:py-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 smooth-scroll">
                  {showSearch && searchQuery.trim() ? (
                    // Search Results - Desktop Optimized
                    <div className="space-y-4">
                      <div className="grid grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2">
                        {searchResults.map((emoji, index) => (
                          <button
                            key={`search-${emoji}-${index}`}
                            onClick={() => handleEmojiClick(emoji)}
                            className={cn(
                              "relative group",
                              "h-11 w-11 md:h-12 md:w-12 rounded-xl",
                              "font-emoji text-xl md:text-2xl",
                              "transition-all duration-200 ease-out",
                              "hover:bg-primary/10 hover:ring-2 hover:ring-primary/30",
                              "active:bg-primary/20 active:scale-90",
                              "hover:scale-125 hover:z-10 hover:shadow-lg",
                              "flex items-center justify-center",
                              "cursor-pointer"
                            )}
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                          <Search className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-30" />
                          <p className="text-sm md:text-base font-medium">
                            No emojis found
                          </p>
                          <p className="text-xs md:text-sm mt-2 opacity-70">
                            Try a different search term
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Category Content - Desktop Enhanced
                    <div className="space-y-5 md:space-y-6">
                      {/* Recent Emojis */}
                      {activeCategory === "recent" &&
                        recentEmojis.length > 0 && (
                          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <h4 className="text-xs md:text-sm font-bold text-muted-foreground mb-3 md:mb-4 px-1 uppercase tracking-wider flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                              Recently Used
                            </h4>
                            <div className="grid grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2 mb-6">
                              {recentEmojis.slice(0, 24).map((emoji, index) => (
                                <button
                                  key={`recent-${emoji}-${index}`}
                                  onClick={() => handleEmojiClick(emoji)}
                                  className={cn(
                                    "relative group",
                                    "h-11 w-11 md:h-12 md:w-12 rounded-xl",
                                    "font-emoji text-xl md:text-2xl",
                                    "transition-all duration-200 ease-out",
                                    "hover:bg-primary/10 hover:ring-2 hover:ring-primary/30",
                                    "active:bg-primary/20 active:scale-90",
                                    "hover:scale-125 hover:z-10 hover:shadow-lg",
                                    "flex items-center justify-center",
                                    "cursor-pointer"
                                  )}
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Category Emojis - Desktop Optimized */}
                      {EMOJI_CATEGORIES.find(
                        (c) => c.id === activeCategory
                      ) && (
                        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                          <h4 className="text-xs md:text-sm font-bold text-muted-foreground mb-3 md:mb-4 px-1 uppercase tracking-wider">
                            {
                              EMOJI_CATEGORIES.find(
                                (c) => c.id === activeCategory
                              )?.name
                            }
                          </h4>
                          <div className="grid grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2 pb-4">
                            {(
                              EMOJI_CATEGORIES.find(
                                (c) => c.id === activeCategory
                              )?.emojis || []
                            ).map((emoji, index) => (
                              <button
                                key={`${activeCategory}-${emoji}-${index}`}
                                onClick={() => handleEmojiClick(emoji)}
                                className={cn(
                                  "relative group",
                                  "h-11 w-11 md:h-12 md:w-12 rounded-xl",
                                  "font-emoji text-xl md:text-2xl",
                                  "transition-all duration-200 ease-out",
                                  "hover:bg-primary/10 hover:ring-2 hover:ring-primary/30",
                                  "active:bg-primary/20 active:scale-90",
                                  "hover:scale-125 hover:z-10 hover:shadow-lg",
                                  "flex items-center justify-center",
                                  "cursor-pointer"
                                )}
                                title={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Desktop Enhanced */}
              <div
                className={cn(
                  "px-4 py-2.5 md:py-3 border-t backdrop-blur-sm",
                  isDark
                    ? "border-border/40 bg-background/20"
                    : "border-border/30 bg-background/10"
                )}
              >
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"></div>
                  <span className="font-medium">Click any emoji to add it</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
