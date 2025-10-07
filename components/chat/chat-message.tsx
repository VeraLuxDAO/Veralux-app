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
      <div className="flex justify-center py-2">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-muted/30 transition-colors",
        isGrouped && "py-0.5 sm:py-1",
        message.isOwn && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && !isGrouped && !message.isOwn ? (
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarImage src={message.authorAvatar} />
            <AvatarFallback className="text-xs sm:text-sm">
              {message.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            {!message.isOwn && (
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 min-w-0 max-w-[85%] sm:max-w-none",
          message.isOwn && "flex flex-col items-end"
        )}
      >
        {/* Header (only show if not grouped) */}
        {!isGrouped && !message.isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {message.authorName}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        )}

        {/* Reply Reference */}
        {message.replyTo && (
          <div
            className={cn(
              "mb-2 pl-3 border-l-2 border-muted bg-muted/30 rounded-r py-1 px-2",
              message.isOwn &&
                "border-l-0 border-r-2 pr-3 pl-2 rounded-l rounded-r-none"
            )}
          >
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{message.replyTo.authorName}</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message Text */}
        <div
          className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap break-words",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2 max-w-fit"
              : "text-foreground"
          )}
        >
          {message.content}
        </div>

        {/* Timestamp for own messages */}
        {message.isOwn && !isGrouped && (
          <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={cn(
              "flex gap-1 mt-2 flex-wrap",
              message.isOwn && "justify-end"
            )}
          >
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 text-xs rounded-full",
                  reaction.hasReacted
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
