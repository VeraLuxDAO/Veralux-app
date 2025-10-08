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
}

export function EmojiPicker({
  onEmojiSelect,
  trigger,
  className,
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

      // Position above the button, centered horizontally
      const left = triggerRect.left + triggerRect.width / 2 - popupWidth / 2;
      const top = triggerRect.top - popupHeight - 12; // 12px gap above button

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
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "border backdrop-blur-xl",
              "w-[350px] h-[400px] sm:w-[350px] sm:h-[400px]", // Responsive sizing
              "max-w-[calc(100vw-20px)] max-h-[360px] sm:max-h-[400px]", // Mobile constraints
              // Theme-aware styling
              isDark
                ? "bg-card/95 border-border/50 shadow-black/40"
                : "bg-popover/95 border-border/30 shadow-black/10"
            )}
            style={{
              bottom: "80px",
              left: "8px",
              pointerEvents: "auto",
            }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 border-b",
                  isDark ? "border-border/30" : "border-border/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/70"></div>
                  <h3 className="text-sm font-semibold text-foreground">
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
                    "h-8 w-8 p-0 rounded-lg transition-all duration-200",
                    showSearch
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Bar */}
              {showSearch && (
                <div
                  className={cn(
                    "p-3 border-b",
                    isDark ? "border-border/30" : "border-border/20"
                  )}
                >
                  <div className="search-input-container relative">
                    <Input
                      placeholder="Search emojis..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 pl-4 h-9 text-sm bg-muted/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl"
                      autoFocus
                    />
                    <Search className="search-icon-right absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Category Tabs */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 border-b overflow-x-auto scrollbar-none",
                  isDark ? "border-border/30" : "border-border/20"
                )}
              >
                {/* Recent Tab */}
                {recentEmojis.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory("recent")}
                    className={cn(
                      "h-8 w-8 p-0 rounded-lg flex-shrink-0 transition-all duration-200",
                      "hover:bg-muted/60 hover:scale-105",
                      activeCategory === "recent"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Recently Used"
                  >
                    <Clock className="h-3.5 w-3.5" />
                  </Button>
                )}

                {/* Category Tabs - More distinct styling */}
                {EMOJI_CATEGORIES.slice(1).map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "h-8 w-8 p-0 rounded-lg flex-shrink-0 font-emoji text-base transition-all duration-200",
                      "hover:bg-muted/60 hover:scale-105",
                      activeCategory === category.id
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md border border-primary/20"
                        : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-br hover:from-muted/40 hover:to-muted/60"
                    )}
                    title={category.name}
                  >
                    <span className="drop-shadow-sm">{category.icon}</span>
                  </Button>
                ))}
              </div>

              {/* Emoji Grid - Improved UX with proper scrolling */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                  {showSearch && searchQuery.trim() ? (
                    // Search Results
                    <div className="space-y-3">
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {searchResults.map((emoji, index) => (
                          <button
                            key={`search-${emoji}-${index}`}
                            onClick={() => handleEmojiClick(emoji)}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/60 active:bg-muted/80 font-emoji text-lg sm:text-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                          <p>No emojis found</p>
                          <p className="text-xs mt-1 opacity-70">
                            Try a different search term
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Category Content
                    <div className="space-y-4">
                      {/* Recent Emojis */}
                      {activeCategory === "recent" &&
                        recentEmojis.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              Recently Used
                            </h4>
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-6">
                              {recentEmojis.slice(0, 18).map((emoji, index) => (
                                <button
                                  key={`recent-${emoji}-${index}`}
                                  onClick={() => handleEmojiClick(emoji)}
                                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/60 active:bg-muted/80 font-emoji text-lg sm:text-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Category Emojis - Show ALL emojis with scrolling */}
                      {EMOJI_CATEGORIES.find(
                        (c) => c.id === activeCategory
                      ) && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">
                            {
                              EMOJI_CATEGORIES.find(
                                (c) => c.id === activeCategory
                              )?.name
                            }
                          </h4>
                          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 pb-4">
                            {(
                              EMOJI_CATEGORIES.find(
                                (c) => c.id === activeCategory
                              )?.emojis || []
                            ).map((emoji, index) => (
                              <button
                                key={`${activeCategory}-${emoji}-${index}`}
                                onClick={() => handleEmojiClick(emoji)}
                                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/60 active:bg-muted/80 font-emoji text-lg sm:text-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
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

              {/* Footer */}
              <div
                className={cn(
                  "p-2 border-t",
                  isDark ? "border-border/30" : "border-border/20"
                )}
              >
                <div className="text-xs text-muted-foreground text-center">
                  Click any emoji to add it
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
