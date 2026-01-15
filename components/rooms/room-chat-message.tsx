"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Reply,
  Forward,
  Paperclip,
  Hand,
  Pencil,
  Plus,
} from "lucide-react";

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
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
  }>({ open: false, x: 0, y: 0 });

  useEffect(() => {
    const closeMenu = () => setContextMenu((prev) => ({ ...prev, open: false }));
    if (contextMenu.open) {
      document.addEventListener("click", closeMenu);
      document.addEventListener("contextmenu", closeMenu);
      document.addEventListener("scroll", closeMenu, true);
    }
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("contextmenu", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, [contextMenu.open]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const popupWidth = 362;
    const popupHeight = 60 + 224 + 8; // pop1 + pop2 + gap
    const margin = 8;
    const x = Math.min(
      window.innerWidth - popupWidth - margin,
      Math.max(margin, e.clientX)
    );
    const y = Math.min(
      window.innerHeight - popupHeight - margin,
      Math.max(margin, e.clientY)
    );
    setContextMenu({ open: true, x, y });
  };

  const emojiOptions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];
  const actions = [
    { label: "Reply", icon: Reply },
    { label: "Forward", icon: Forward },
    { label: "Clip", icon: Paperclip },
    { label: "Select", icon: Hand },
    { label: "Edit", icon: Pencil },
  ];

  return (
    <>
      <div
        className={cn(
          "flex items-start space-x-3 mb-4",
          message.isSelf && "flex-row-reverse space-x-reverse"
        )}
        onContextMenu={handleContextMenu}
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

      {contextMenu.open && (
        <>
          {/* Emoji bar */}
          <div
            className="fixed z-[1000] flex items-center gap-2 px-3"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              width: "362px",
              height: "60px",
              borderRadius: "16px",
              background: "#0000004A",
              border: "1px solid #FFFFFF0F",
            }}
          >
            {emojiOptions.map((emoji, idx) => (
              <button
                key={idx}
                className="h-9 w-9 rounded-[10px] bg-[#E5F7FD0F] flex items-center justify-center text-lg text-white hover:bg-white/10 transition-all"
                onClick={() => setContextMenu((p) => ({ ...p, open: false }))}
              >
                {emoji}
              </button>
            ))}
            <button
              className="h-9 w-9 rounded-full bg-[#E5F7FD0F] flex items-center justify-center text-white hover:bg-white/10 transition-all"
              onClick={() => setContextMenu((p) => ({ ...p, open: false }))}
              title="Add reaction"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Actions menu */}
          <div
            className="fixed z-[999] flex flex-col overflow-hidden"
            style={{
              top: contextMenu.y + 60 + 8,
              left: contextMenu.x,
              width: "130px",
              height: "224px",
              borderRadius: "16px",
              background: "#0000004A",
              border: "1px solid #FFFFFF0F",
            }}
          >
            {actions.map(({ label, icon: Icon }, idx) => (
              <button
                key={label}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-[#9BB6CC] hover:bg-white/5 transition-colors",
                  idx !== actions.length - 1 && "border-b border-[#FFFFFF0F]"
                )}
                onClick={() => setContextMenu((p) => ({ ...p, open: false }))}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
