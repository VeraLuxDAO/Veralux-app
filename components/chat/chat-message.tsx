"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "system";
  isOwn: boolean;
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
}

export function ChatMessageComponent({
  message,
  showAvatar = true,
  isGrouped = false,
}: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });

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
        isGrouped && "py-1",
        message.isOwn && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && !isGrouped ? (
          <Avatar className="w-10 h-10">
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
      <div
        className={cn(
          "flex-1 min-w-0",
          message.isOwn && "flex flex-col items-end"
        )}
      >
        {/* Header (only show if not grouped) */}
        {!isGrouped && !message.isOwn && (
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

        {/* Message Text */}
        <div
          className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap break-words",
            message.isOwn
              ? "bg-[#FADEFD] text-[#080E11] rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm max-w-[75%] inline-block"
              : "text-[#9BB6CC]"
          )}
          style={{
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {message.content}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={cn(
              "flex gap-1.5 mt-2 flex-wrap",
              message.isOwn && "justify-end"
            )}
          >
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
    </div>
  );
}
