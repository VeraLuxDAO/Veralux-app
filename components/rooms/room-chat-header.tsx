"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, MoreVertical } from "lucide-react";

interface RoomChatHeaderProps {
  room: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  onBack?: () => void;
  onClose: () => void;
}

export function RoomChatHeader({ room, onBack, onClose }: RoomChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#2b3642] bg-[#080E1199]">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={room.avatar} />
          <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm md:text-base truncate">
            {room.name}
          </h3>
          <p className="text-xs text-gray-400">
            {room.isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <MoreVertical className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
