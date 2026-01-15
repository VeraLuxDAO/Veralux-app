"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Lock, MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface Room {
  id: string;
  name: string;
  avatar?: string;
  type: "dm" | "group";
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isMuted?: boolean;
  isEncrypted: boolean;
  members?: number;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Vitalik Buterin",
    avatar: "/diverse-user-avatars.png",
    type: "dm",
    lastMessage: "That sounds like a great idea!",
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
    isOnline: true,
    isEncrypted: true,
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    type: "dm",
    lastMessage: "Can we schedule a call tomorrow?",
    lastMessageTime: new Date(Date.now() - 48 * 60000),
    unreadCount: 0,
    isOnline: true,
    isEncrypted: true,
  },
  {
    id: "3",
    name: "DeFi Core Team",
    type: "group",
    lastMessage: "John: The new proposal is ready",
    lastMessageTime: new Date(Date.now() - 2 * 3600000),
    unreadCount: 5,
    isEncrypted: true,
    members: 8,
  },
  {
    id: "4",
    name: "Mike Chen",
    avatar: "/developer-avatar.png",
    type: "dm",
    lastMessage: "Thanks for the help!",
    lastMessageTime: new Date(Date.now() - 24 * 3600000),
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: "5",
    name: "NFT Strategy Group",
    type: "group",
    lastMessage: "Alice: Check out this new collection",
    lastMessageTime: new Date(Date.now() - 48 * 3600000),
    unreadCount: 12,
    isEncrypted: true,
    members: 15,
  },
];

interface PrivateRoomsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (date?: Date) => {
  if (!date) return "";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const slugifyRoomName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function PrivateRoomsPopover({
  isOpen,
  onClose,
}: PrivateRoomsPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const userInitial = auth.user?.name?.charAt(0) || "U";

  const filteredRooms = mockRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-private-rooms-trigger]")) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        "fixed z-[60] hidden md:block",
        "w-[420px]",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
      style={{
        top: "4.5rem",
        right: "1.5rem",
        background: "rgba(8, 14, 17, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
      }}
    >
      <div className="flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-4 py-3 flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={auth.user?.picture} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-[15px] font-semibold text-white truncate">
                  {auth.user?.name || "Private Rooms"}
                </p>
                <p className="text-xs text-[#9BB6CC99]">Encrypted Messaging</p>
              </div>
            </div>
            <button
              type="button"
              className={cn(
                "w-[70px] h-[36px]",
                "flex items-center justify-center",
                "text-sm font-medium text-[#FADEFD]",
                "rounded-[18px] border border-[#E5F7FD33]",
                "bg-transparent hover:bg-white/5 transition-colors"
              )}
            >
              + New
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99] pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="pl-10 pr-3 h-10 bg-[rgba(229,247,253,0.06)] border border-white/10 rounded-full text-sm text-white placeholder:text-[#9BB6CC99] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/30"
            />
          </div>
        </div>

        {/* Rooms List */}
        <ScrollArea className="flex-1 px-2 pb-3">
          <div className="space-y-1 pr-1">
            {filteredRooms.map((room, index) => {
              const isUnread = room.unreadCount > 0;
              const preview =
                room.isTyping && room.type === "dm"
                  ? "typing..."
                  : room.lastMessage;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    const slug = slugifyRoomName(room.name);
                    const params = new URLSearchParams(searchParams.toString());
                    // Remove circle and channel parameters when opening a private room
                    params.delete("circle");
                    params.delete("channel");
                    params.set("private_rooms", slug);
                    const currentPath = pathname || "/";
                    router.push(`${currentPath}?${params.toString()}`);
                    onClose();
                  }}
                  className="w-full text-left"
                  style={{
                    animation: `slideInNotification 0.5s ease-out ${index * 60}ms both`,
                  }}
                >
                  <div className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback className="bg-[#2b3642] text-white text-sm font-medium">
                          {room.type === "group" ? "👥" : room.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {room.isOnline && room.type === "dm" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#45D4A7] rounded-full border-2 border-[#080E11]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-semibold text-white truncate">
                              {room.name}
                            </p>
                            {room.isEncrypted && (
                              <Lock className="h-3.5 w-3.5 text-[#4bd865]" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-[12px] leading-tight line-clamp-2 text-[#9BB6CC]",
                              room.isTyping && "text-[#4bd865] italic"
                            )}
                          >
                            {preview}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[11px] text-[#9BB6CC99]">
                            {formatTime(room.lastMessageTime)}
                          </span>
                          {isUnread && (
                            <Badge
                              className="px-1.5 h-5 text-[12px] font-semibold rounded-full bg-[#FADEFD] text-[#000205] border-0"
                            >
                              {room.unreadCount > 99
                                ? "99+"
                                : room.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredRooms.length === 0 && (
              <div className="py-12 text-center text-sm text-[#9BB6CC99]">
                No private rooms found
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#9BB6CC99]">
            <MessageCircle className="h-4 w-4 text-white" />
            <span>Tap a chat to open the private room</span>
          </div>
        </div>
      </div>
    </div>
  );
}
