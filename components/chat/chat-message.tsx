"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { shouldDisplayAsEmoticonOnly } from "@/lib/emoji-utils";
import { ImageViewer } from "@/components/chat/image-viewer";
import { TelegramEmoji } from "@/components/chat/telegram-emoji";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  Reply,
  Forward,
  Paperclip,
  CheckSquare,
  Pencil,
  Trash2,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "system";
  isOwn: boolean;
  images?: string[]; // Array of image URLs or data URLs
  reactions?: { emoji: string; count: number; hasReacted: boolean }[];
  replyTo?: {
    id: string;
    authorName: string;
    content: string;
  };
}

interface ChatMessageProps {
  message: ChatMessage;
  showAvatar?: boolean;
  isGrouped?: boolean;
  onReact?: (messageId: string, emoji: string) => void;
  onAction?: (messageId: string, action: string) => void;
  disableContextMenu?: boolean; // Disable right-click context menu (for circles)
}

export function ChatMessageComponent({
  message,
  showAvatar = true,
  isGrouped = false,
  onReact = () => {},
  onAction = () => {},
  disableContextMenu = false,
}: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });
  const isEmoticonOnly = shouldDisplayAsEmoticonOnly(message.content, message.images);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [actionPos, setActionPos] = useState({ x: 0, y: 0 });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const quickBarRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const quickFallback = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const quickReactions = useMemo(() => {
    if (typeof window === "undefined") return quickFallback.slice(0, 6);
    try {
      const stored = JSON.parse(
        window.localStorage.getItem("recentEmojis") || "[]"
      ) as string[];
      const unique = Array.from(new Set(stored));
      const combined = [...unique, ...quickFallback];
      return combined.slice(0, 6);
    } catch {
      return quickFallback.slice(0, 6);
    }
  }, []);

  useEffect(() => {
    if (!contextOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (addButtonRef.current && addButtonRef.current.contains(target)) ||
        (quickBarRef.current && quickBarRef.current.contains(target)) ||
        (actionsRef.current && actionsRef.current.contains(target)) ||
        (target instanceof HTMLElement &&
          target.closest('[data-emoji-picker="true"]'))
      ) {
        return;
      }
      setContextOpen(false);
      setShowEmojiPicker(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextOpen(false);
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextOpen]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const width = 362;
    const height = 60;
    const actionWidth = 130;
    const actionHeight = 224;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Position quick bar above pointer by default
    const quickLeft = clamp(clickX - width / 2, 8, vw - width - 8);
    const quickTop = clamp(clickY - height - 10, 8, vh - height - 8);

    // Position actions near pointer (slightly offset)
    const actionLeft = clamp(clickX - actionWidth / 2, 8, vw - actionWidth - 8);
    const actionTop = clamp(clickY + 8, 8, vh - actionHeight - 8);

    setContextPos({
      x: quickLeft,
      y: quickTop,
    });
    setActionPos({
      x: actionLeft,
      y: actionTop,
    });
    setContextOpen(true);
    setShowEmojiPicker(false);
  };

  const handleReact = (emoji: string) => {
    onReact(message.id, emoji);
    setContextOpen(false);
    setShowEmojiPicker(false);
  };

  const actions = [
    { key: "reply", label: "Reply", Icon: Reply },
    { key: "forward", label: "Forward", Icon: Forward },
    { key: "clip", label: "Clip", Icon: Paperclip },
    { key: "select", label: "Select", Icon: CheckSquare },
    { key: "edit", label: "Edit", Icon: Pencil },
    { key: "delete", label: "Delete", Icon: Trash2 },
  ];

  if (message.type === "system") {
    return (
      <div className="flex justify-center py-4">
        <div className="bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] px-6 py-2.5 rounded-lg text-sm text-white font-medium shadow-lg">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-2 hover:bg-white/5 transition-colors",
        isGrouped && "py-1"
      )}
      onContextMenu={disableContextMenu ? undefined : handleContextMenu}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && !isGrouped ? (
          <Avatar className="w-9 h-9">
            <AvatarImage src={message.authorAvatar} />
            <AvatarFallback className="bg-[#2b3642] text-white text-sm font-medium">
              {message.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header (only show if not grouped) */}
        {!isGrouped && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">
              {message.authorName}
            </span>
            <span className="text-xs text-[#9BB6CC]">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Reply Reference */}
        {message.replyTo && (
          <div className="mb-2 pl-3 border-l-2 border-[#5865F2] bg-[#5865F2]/10 rounded py-1.5 px-3 text-left">
            <div className="text-xs text-[#5865F2] font-medium mb-0.5">
              Replying to {message.replyTo.authorName}
            </div>
            <div className="text-xs text-[#9BB6CC] line-clamp-2">
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message Content Container */}
        {isEmoticonOnly ? (
          /* Emoticon-Only Display - Large, Prominent (No Bubble) with Telegram Emojis - Left Aligned */
          <div
            className="flex items-center justify-start"
            style={{
              fontSize: "2rem",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <TelegramEmoji content={message.content.trim()} size={192} />
          </div>
        ) : (
          <div className="text-[#9BB6CC] max-w-[75%]">
            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className={cn(
                "grid gap-1 p-0",
                message.images.length === 1 ? "grid-cols-1" : message.images.length === 2 ? "grid-cols-2" : "grid-cols-2",
                message.content && "pb-0"
              )}>
                {message.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative rounded-lg overflow-hidden bg-[#2b3642]",
                      message.images!.length === 1 ? "w-full max-w-[400px]" : "w-full"
                    )}
                  >
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      loading="lazy"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageViewerOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Message Text */}
            {message.content && (
              <div
                className={cn(
                  "text-sm leading-relaxed whitespace-pre-wrap break-words text-[#9BB6CC]",
                  message.images
                    ? "pt-2 pb-1"
                    : "py-0"
                )}
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <TelegramEmoji content={message.content} size={20} />
              </div>
            )}
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
                  reaction.hasReacted
                    ? "bg-[#5865F2]/20 text-white border border-[#5865F2]/30 hover:bg-[#5865F2]/30"
                    : "bg-[#2b3642] text-[#9BB6CC] hover:bg-[#2b3642]/80"
                )}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Viewer */}
      {message.images && message.images.length > 0 && (
        <ImageViewer
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          images={message.images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />
      )}
      {/* Contextual Popups - Only show if context menu is enabled */}
      {!disableContextMenu && (contextOpen || showEmojiPicker) && typeof document !== "undefined" && (
        <>
          {/* Quick reactions bar (only when context menu is open) */}
          {contextOpen && (
            <div
              ref={quickBarRef}
              className="fixed"
              style={{
                top: contextPos.y,
                left: contextPos.x,
                width: 362,
                height: 60,
                backgroundColor: "#0000004A",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                padding: "12px",
                gap: "12px",
                zIndex: 120000,
              }}
            >
              {quickReactions.map((emoji, idx) => (
                <button
                  key={`${emoji}-${idx}`}
                  onClick={() => handleReact(emoji)}
                  className="flex items-center justify-center bg-white/5 hover:bg-white/15 transition rounded-[10px]"
                  style={{ width: 36, height: 36 }}
                  aria-label={`React ${emoji}`}
                >
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                </button>
              ))}
              <button
                ref={addButtonRef}
                onClick={() => {
                  setShowEmojiPicker(true);
                  setContextOpen(false);
                }}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 transition rounded-full text-white/80"
                style={{ width: 37, height: 37 }}
                aria-label="Add reaction"
              >
                +
              </button>
            </div>
          )}

          {/* Emoji picker (can stay open after menus close) */}
          <EmojiPicker
            onEmojiSelect={(emoji) => handleReact(emoji)}
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            triggerRef={addButtonRef}
            align="left"
          />

          {/* Actions menu (only when context menu is open) */}
          {contextOpen && (
            <div
              ref={actionsRef}
              className="fixed text-[#9BB6CC]"
              style={{
                top: actionPos.y,
                left: actionPos.x,
                width: 130,
                height: 224,
                background: "rgba(8, 14, 17, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: 16,
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow:
                  "0px 334px 94px rgba(0,0,0,0.01), 0px 214px 86px rgba(0,0,0,0.04), 0px 120px 72px rgba(0,0,0,0.15), 0px 53px 53px rgba(0,0,0,0.26), 0px 13px 29px rgba(0,0,0,0.29)",
                zIndex: 120001,
              }}
            >
              {actions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => {
                    onAction(message.id, action.key);
                    setContextOpen(false);
                    setShowEmojiPicker(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-[#9BB6CC] hover:text-white hover:bg-white/10 rounded-lg px-2 py-1 transition"
                >
                  <action.Icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
