"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoomListItemProps {
  room: {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isOnline: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function RoomListItem({ room, isSelected, onClick }: RoomListItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full p-3 h-auto flex items-start space-x-3 hover:bg-muted/50 transition-colors relative z-0 overflow-hidden max-w-full",
        isSelected && "bg-muted/70"
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={room.avatar} />
          <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {room.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-veralux-green border-2 border-[#0e1621] rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between mb-1 gap-2">
          <span className="text-sm font-medium text-white truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-[160px]">
            {room.name}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap text-right flex-shrink-0 max-w-[72px] overflow-hidden text-ellipsis">
            {room.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
            {room.lastMessage}
          </span>
          {room.unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] px-1.5 text-xs flex-shrink-0">
              {room.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Button>
  );
}
