"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
}

interface RoomChatMessageProps {
  message: Message;
}

export function RoomChatMessage({ message }: RoomChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start space-x-3 mb-4",
        message.isSelf && "flex-row-reverse space-x-reverse"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.avatar} />
        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex-1 max-w-[70%]",
          message.isSelf && "flex flex-col items-end"
        )}
      >
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-medium text-gray-300">
            {message.sender}
          </span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div
          className={cn(
            "rounded-lg p-3 text-sm",
            message.isSelf
              ? "bg-primary text-primary-foreground"
              : "bg-[#1a2332] text-white"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
