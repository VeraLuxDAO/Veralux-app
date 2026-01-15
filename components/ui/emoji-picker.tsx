"use client";


import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOJI_CATEGORIES, searchEmojis } from "@/lib/emoji-data";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Search, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EMOJI_CATEGORIES,
  addRecentEmoji,
  getRecentEmojis,
  searchEmojis,
} from "@/lib/emoji-data";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
  /**
   * Optional controlled visibility. If provided, the picker will mirror this
   * value instead of using its own internal state.
   */
  isOpen?: boolean;
  /**
   * Called when the picker requests to close (outside click, Escape, emoji pick, close button).
   */
  onClose?: () => void;
  /**
   * Called when the picker requests to open (trigger click) in controlled mode.
   */
  onOpen?: () => void;
  /**
   * Optional anchor ref to position the popup (e.g., an external button).
   * If omitted, the component manages its own trigger ref.
   */
  triggerRef?: React.RefObject<HTMLElement>;
}

const BASE_WIDTH = 404;
const BASE_HEIGHT = 396;
const MOBILE_BREAKPOINT = 450;

export function EmojiPicker({
  onEmojiSelect,
  trigger,
  className,
  align = "left",
  isOpen: controlledIsOpen,
  onClose,
  onOpen,
  triggerRef: externalTriggerRef,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const isControlled = typeof controlledIsOpen === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = isControlled ? Boolean(controlledIsOpen) : uncontrolledOpen;
  const [searchQuery, setSearchQuery] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [dimensions, setDimensions] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
  });

  const internalTriggerRef = useRef<HTMLDivElement>(null);
  const triggerRef = externalTriggerRef ?? internalTriggerRef;
  const panelRef = useRef<HTMLDivElement>(null);

  const allEmojis = useMemo(
    () =>
      EMOJI_CATEGORIES.filter((category) => category.id !== "recent").flatMap(
        (category) => category.emojis
      ),
    []
  );

  const mergedEmojis = useMemo(() => {
    if (!recentEmojis.length) return allEmojis;
    const ordered = [...recentEmojis, ...allEmojis];
    const unique = Array.from(new Set(ordered));
    return unique;
  }, [allEmojis, recentEmojis]);

  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) return mergedEmojis;
    return searchEmojis(searchQuery);
  }, [mergedEmojis, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setRecentEmojis(getRecentEmojis());
    }
  }, [isOpen]);


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

  const updateDimensions = () => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const width = isMobile
      ? Math.min(BASE_WIDTH, window.innerWidth - 24)
      : BASE_WIDTH;
    const height = BASE_HEIGHT;
    setDimensions({ width, height });
    return { width, height };
  };

  const positionPanel = (currentWidth?: number, currentHeight?: number) => {
    const { width, height } = {
      width: currentWidth ?? dimensions.width,
      height: currentHeight ?? dimensions.height,
    };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;


    // Fallback center if no trigger yet.
    if (!triggerRef.current) {
      setPosition({
        left: Math.max(8, (viewportWidth - width) / 2),
        top: Math.max(8, (viewportHeight - height) / 2),
      });
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const preferredLeft =
      align === "right"
        ? rect.right - width
        : rect.left + rect.width / 2 - width / 2;
    const left = Math.max(8, Math.min(preferredLeft, viewportWidth - width - 8));

    const idealTop = rect.top - height - 8;
    const belowTop = rect.bottom + 8;
    const hasSpaceAbove = idealTop >= 8;
    const hasSpaceBelow = belowTop + height <= viewportHeight - 8;
    const chosenTop =
      hasSpaceAbove || !hasSpaceBelow
        ? Math.max(8, Math.min(idealTop, viewportHeight - height - 8))
        : Math.min(belowTop, viewportHeight - height - 8);

    setPosition({
      left,
      top: chosenTop,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    const handleResizeOrScroll = () => {
      const { width, height } = updateDimensions();
      positionPanel(width, height);
    };

    handleResizeOrScroll();
    const rafId = window.requestAnimationFrame(handleResizeOrScroll);
    const timeoutId = window.setTimeout(handleResizeOrScroll, 80);

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) return;

    // Defer activation one tick to avoid capturing the same click that opened.
    const timers: number[] = [];
    let listenersActive = false;

    const activateListeners = () => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!isOpen) return;
        const target = event.target as Node;
        if (panelRef.current?.contains(target)) return;
        if (triggerRef.current?.contains(target)) return;
        if (isControlled) {
          onClose?.();
        } else {
          setUncontrolledOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (isControlled) {
            onClose?.();
          } else {
            setUncontrolledOpen(false);
          }
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleEscape);
      listenersActive = true;

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleEscape);
      };
    };

    let cleanup: (() => void) | undefined;
    timers.push(
      window.setTimeout(() => {
        cleanup = activateListeners();
      }, 0)
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (listenersActive && cleanup) cleanup();
    };
  }, [isOpen, isControlled, onClose]);

  const close = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setUncontrolledOpen(false);
    }
  };

  const open = () => {
    if (isControlled) {
      onOpen?.();
    } else {
      setUncontrolledOpen(true);
    }
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);

    setIsOpen(false);
  };

  const allEmojis = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
  const displayedEmojis =
    searchQuery.trim().length > 0 ? searchResults : allEmojis;


    addRecentEmoji(emoji);
    setRecentEmojis(getRecentEmojis());
    close();
  };


  const defaultTrigger = (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={toggle}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition",
        "text-white/80 hover:text-white hover:bg-white/10 focus:outline-none",
        className
      )}
      aria-label="Open emoji picker"
    >
      <Smile className="h-4 w-4" />
    </button>
  );

  const renderedTrigger = trigger ? (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      onClick={toggle}
      className="inline-flex cursor-pointer"
    >
      {trigger}
    </div>
  ) : (
    defaultTrigger
  );


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

  const popup = (
    <div
      ref={panelRef}
      data-emoji-picker="true"
      className="fixed z-[99999] rounded-2xl shadow-xl border border-white/10"
      style={{
        top: position.top,
        left: position.left,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "#0000004A",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="flex h-full flex-col p-4 gap-3 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Emoji</span>
          <button
            type="button"
            onClick={close}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-white/10 focus:outline-none"
            aria-label="Close emoji picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search emojis"
            className="w-full h-10 rounded-xl bg-white/5 px-10 text-sm text-white placeholder:text-white/60 outline-none border border-white/10 focus:border-white/30"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-1">
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                gap: "12px",
              }}
            >
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="flex items-center justify-center text-xl bg-white/5 hover:bg-white/15 rounded-[10px] transition"
                  style={{ width: 36, height: 36 }}
                  aria-label={`Emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Only render the trigger when not using an external anchor */}
      {!externalTriggerRef && renderedTrigger}
      {isOpen && typeof document !== "undefined"
        ? createPortal(popup, document.body)
        : null}
    </>
  );
}