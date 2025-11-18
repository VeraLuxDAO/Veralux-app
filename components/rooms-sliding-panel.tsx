"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  X,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Send,
  Check,
  CheckCheck,
  Pin,
  VolumeX,
  Lock,
  Mic,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
}

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
  isPinned?: boolean;
  isMuted?: boolean;
  isEncrypted: boolean;
  members?: number;
}

interface RoomsSlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
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
    isPinned: true,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    type: "dm",
    lastMessage: "Can we schedule a call tomorrow?",
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "3",
    name: "DeFi Core Team",
    type: "group",
    lastMessage: "John: The new proposal is ready",
    lastMessageTime: new Date(Date.now() - 2 * 3600000),
    unreadCount: 5,
    isOnline: false,
    isPinned: true,
    isMuted: false,
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
    isOnline: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "5",
    name: "NFT Strategy Group",
    type: "group",
    lastMessage: "Alice: Check out this new collection",
    lastMessageTime: new Date(Date.now() - 48 * 3600000),
    unreadCount: 12,
    isOnline: false,
    isPinned: false,
    isMuted: true,
    isEncrypted: true,
    members: 15,
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Vitalik Buterin",
    senderAvatar: "/diverse-user-avatars.png",
    content: "Hey! How's the development going?",
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    isOwn: false,
  },
  {
    id: "2",
    senderId: "me",
    senderName: "You",
    content: "Going great! Just finished the zkLogin integration.",
    timestamp: new Date(Date.now() - 3000000),
    isRead: true,
    isOwn: true,
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Vitalik Buterin",
    senderAvatar: "/diverse-user-avatars.png",
    content: "That sounds like a great idea! When can you demo it?",
    timestamp: new Date(Date.now() - 300000),
    isRead: true,
    isOwn: false,
  },
  {
    id: "4",
    senderId: "me",
    senderName: "You",
    content: "How about tomorrow at 2 PM?",
    timestamp: new Date(Date.now() - 60000),
    isRead: false,
    isOwn: true,
  },
];

export function RoomsSlidingPanel({ isOpen, onClose }: RoomsSlidingPanelProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resizable divider state
  const [roomsListWidth, setRoomsListWidth] = useState(404); // Default width (matches design)
  const [isResizing, setIsResizing] = useState(false);
  const MIN_WIDTH = 240; // Minimum width for rooms list
  const MAX_WIDTH = 500; // Maximum width for rooms list

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugifyRoomName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // Sync selectedRoom with URL when panel is open on desktop (/private_rooms?room=slug)
  useEffect(() => {
    if (!isOpen) return;

    // Read slug from ?room=slug
    const slug = searchParams.get("room");

    if (slug) {
      const fromSlug =
        mockRooms.find((room) => slugifyRoomName(room.name) === slug) ||
        null;
      setSelectedRoom(fromSlug);
    } else {
      // No slug -> no room selected (show "Select a chat" placeholder)
      setSelectedRoom(null);
    }
  }, [isOpen, searchParams]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle resizing - mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const panel = document.querySelector(".rooms-sliding-panel");
      if (!panel) return;

      const panelRect = panel.getBoundingClientRect();
      const newWidth = e.clientX - panelRect.left;

      // Clamp width between MIN_WIDTH and MAX_WIDTH
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setRoomsListWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, MIN_WIDTH, MAX_WIDTH]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    // Focus back to input after selecting emoji
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      content: messageInput,
      timestamp: new Date(),
      isRead: false,
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const formatTime = (date: Date) => {
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

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRooms = mockRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hide AI button when rooms panel is open
  useEffect(() => {
    const aiButton = document.querySelector(".desktop-ai-tab-container");
    if (aiButton) {
      if (isOpen) {
        (aiButton as HTMLElement).style.transition = "opacity 0.3s ease";
        (aiButton as HTMLElement).style.opacity = "0";
        (aiButton as HTMLElement).style.pointerEvents = "none";
      } else {
        (aiButton as HTMLElement).style.transition = "opacity 0.3s ease";
        (aiButton as HTMLElement).style.opacity = "1";
        (aiButton as HTMLElement).style.pointerEvents = "auto";
      }
    }

    // Cleanup on unmount
    return () => {
      const aiButton = document.querySelector(".desktop-ai-tab-container");
      if (aiButton) {
        (aiButton as HTMLElement).style.opacity = "1";
        (aiButton as HTMLElement).style.pointerEvents = "auto";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Transparent, only for click handling */}
      <div
        className={cn(
          "fixed inset-0 z-[65] transition-opacity duration-300",
          "hidden md:block",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        style={{ top: "5rem" }}
      />

      {/* Sliding Panel - Desktop Only */}
      <div
        className={cn(
          "rooms-sliding-panel",
          "fixed h-[calc(100vh-5rem)] z-[70]",
          "shadow-[0_20px_45px_rgba(0,0,0,0.45)]",
          "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hidden md:block",
          "overflow-hidden",
          // Position from left sidebar edge to right edge
          "md:left-[238px] lg:left-[258px] xl:left-[288px]",
          "md:right-[24px]",
          // Width auto to fill space between left and right
          "w-[90vw] md:w-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          top: "5rem",
          background:
            "linear-gradient(145deg, rgba(14,20,28,0.95) 0%, rgba(8,12,18,0.92) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
        }}
      >
        <div className="flex h-full overflow-hidden">
          {/* Rooms List - Left Side */}
          <div
            className={cn(
              "flex-shrink-0 border-r-0 flex flex-col relative overflow-hidden transition-none bg-transparent bg-[#0000004A]",
              // Hide rooms list when chat is selected on medium screens
              selectedRoom ? "hidden lg:flex" : "flex"
            )}

            style={{ width: `${roomsListWidth}px` }}
          >
            {/* Header */}
            <div className="px-4 pl-[6px] pt-5 pb-4 flex-shrink-0 w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-5 w-full">
                <div className="flex items-center gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={onClose}
                    className="h-9 w-9 p-0 rounded-full  text-white transition-all"
                    title="Close rooms"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  {/* Room meta: circular lock icon + title + subtitle */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full border border-white/10 bg-[#FADEFD] flex items-center justify-center">
                      <Lock className="h-4 w-4 text-[#001422]" />
                    </div>
                    <div className="flex flex-col">
                      <h2
                        className="text-[15px] font-semibold leading-tight text-white"
                        style={{
                          fontFamily: "'Geist'",
                        }}
                      >
                        {selectedRoom?.name ?? "Private Rooms"}
                      </h2>
                      <p
                        className="mt-0.5 text-[12px] leading-tight text-[#9BB6CC99]"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        Encrypted Messaging
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="pl-[10px]">  
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99] pointer-events-none" />
                  <Input
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 h-10 rounded-full bg-[#E5F7FD0A] text-[14px] text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:border-white/30 transition-all shadow-inner"
                    style={{
                      fontFamily: "'Geist'",
                      backgroundColor: "#E5F7FD0A",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Rooms List */}
            <ScrollArea className="flex-1 overflow-hidden w-full">
              <div className="w-full max-w-full overflow-hidden pt-2 px-4">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room);
              router.push(
                `/private_rooms?room=${slugifyRoomName(room.name)}`
              );
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-0 py-4 transition-all duration-150",
                      "hover:opacity-90 cursor-pointer",
                      "group relative",
                      selectedRoom?.id === room.id ? "opacity-100" : ""
                    )}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#2b3642] to-[#1c2733] text-white text-sm font-medium">
                          {room.type === "group" ? "👥" : room.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {room.isOnline && room.type === "dm" && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#080E11]" />
                      )}
                    </div>

                    {/* Content - Middle Section */}
                    <div className="flex-1 min-w-0 text-left flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="text-[14px] font-semibold line-clamp-1 flex-1"
                          style={{
                            color: "#FFFFFF",
                            fontFamily: "'Geist'",
                            fontWeight: 600,
                          }}
                        >
                          {room.name}
                        </h3>
                        {/* Time Badge - Far Right, Top Aligned */}
                        {room.lastMessageTime && (
                          <div className="flex-shrink-0 flex items-center gap-1 pt-0.5">
                            {!room.unreadCount &&
                              room.type === "dm" &&
                              !room.isTyping && (
                                <CheckCheck className="h-3.5 w-3.5 text-[#4bd865] flex-shrink-0" />
                              )}
                            <span
                              className="px-[4px] py-[2px] rounded-lg text-[10px] font-medium whitespace-nowrap"
                              style={{
                                background: "#9BB6CC1A",
                                color: "#9BB6CC",
                                fontFamily: "'Geist'",
                              }}
                            >
                              {formatTime(room.lastMessageTime)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Message Preview */}
                      <div className="flex items-center gap-1.5">
                        {/* Status Icons */}
                        {room.isMuted && (
                          <VolumeX className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        )}
                        {room.isPinned && (
                          <Pin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        )}
                        <p
                          className="text-[12px] line-clamp-2 leading-relaxed flex-1"
                          style={{
                            color: "#9BB6CC",
                            fontFamily: "'Geist'",
                          }}
                        >
                          {room.isTyping ? (
                            <span className="text-[#4bd865] italic">
                              typing...
                            </span>
                          ) : (
                            <span>
                              {room.type === "group" && room.lastMessage && (
                                <span style={{ color: "#9BB6CC" }}>
                                  {room.lastMessage.split(":")[0]}:{" "}
                                </span>
                              )}
                              {room.lastMessage
                                ?.split(":")
                                .slice(1)
                                .join(":") || room.lastMessage}
                            </span>
                          )}
                        </p>
                        {/* Unread Badge */}
                        {room.unreadCount > 0 && (
                          <div className="h-5 min-w-5 px-1.5 bg-[#FADEFD] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[12px] text-[#000205] font-semibold">
                              {room.unreadCount > 99 ? "99+" : room.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Resizable Divider */}
          <div
            className={cn(
              "relative flex-shrink-0 w-[1px] bg-[#2b3642]/50 group hover:bg-[#5c6bc0] transition-colors duration-200",
              "hidden lg:block",
              isResizing && "bg-[#5c6bc0]"
            )}
            onMouseDown={handleMouseDown}
            style={{
              userSelect: "none",
              cursor: "col-resize",
            }}
          >
            {/* Visual indicator */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-[2px] transition-all pointer-events-none">
              <div className="h-full w-full bg-transparent group-hover:bg-[#5c6bc0]/50 transition-all" />
            </div>
            {/* Wider hit area for better UX */}
            <div
              className="absolute inset-y-0 -left-2 -right-2"
              style={{ cursor: "col-resize" }}
            />
          </div>

          {/* Chat Area - Right Side */}
          {selectedRoom ? (
            <div className="flex-1 flex flex-col min-w-0 relative z-0">
              {/* Chat Header */}
              <div className="flex-shrink-0 px-4 lg:px-4 pt-6 bg-[#0000004A] border-b border-[#FFFFFF14]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                      {/* Back button - mobile */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRoom(null)}
                        className="h-9 w-9 p-0 hover:bg-white/10 text-white rounded-full transition-all lg:hidden"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>

                      <div className="relative flex-shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={selectedRoom.avatar} />
                          <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                            {selectedRoom.type === "group"
                              ? "👥"
                              : selectedRoom.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {selectedRoom.isOnline && selectedRoom.type === "dm" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4bd865] border-[2px] border-[#05080d] rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white flex items-center gap-1 md:gap-1.5 truncate text-[14px] md:text-[14px] leading-tight">
                          {selectedRoom.name}
                          {selectedRoom.isEncrypted && (
                            <Lock className="h-3 w-3 text-[#4bd865] flex-shrink-0" />
                          )}
                        </h3>
                        <p className="text-[12px] text-[#9BB6CC] truncate leading-tight mt-0.5">
                          {selectedRoom.type === "dm"
                            ? selectedRoom.isOnline
                              ? "Online"
                              : "Last seen recently"
                            : `${selectedRoom.members} members`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden lg:block">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <Input
                            placeholder={`Search ${selectedRoom.name}`}
                            className="pl-10 pr-4 h-9 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-[14px] placeholder:text-[#9BB6CC99] focus:ring-0"
                            style={{
                              fontFamily: "'Geist'",
                              backgroundColor: "#E5F7FD0A",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full" />
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-4 lg:px-6 py-6"
                ref={messagesContainerRef}
                style={{
                  background:
                    "radial-gradient(circle at top, rgba(61,80,120,0.25), transparent 45%), #05080d",
                }}
              >
                <div className="space-y-3 max-w-4xl mx-auto">
                  {messages.map((message, index) => {
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1]?.senderId !== message.senderId;
                    const showTime =
                      index === messages.length - 1 ||
                      messages[index + 1]?.senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-1 animate-in fade-in slide-in-from-bottom-1 duration-200",
                          message.isOwn ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-6 md:w-7 lg:w-8 mt-auto">
                          {showAvatar && !message.isOwn ? (
                            <Avatar className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback className="bg-[#2b3642] text-white text-[10px] md:text-xs">
                                {message.senderName[0]}
                              </AvatarFallback>
                            </Avatar>
                          ) : null}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "flex flex-col max-w-[75%] md:max-w-[70%] lg:max-w-[65%]",
                            message.isOwn ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg shadow-sm",
                              message.isOwn
                                ? "bg-[#5c6bc0] text-white rounded-br-sm"
                                : "bg-[#1c2733] text-white rounded-bl-sm"
                            )}
                          >
                            {showAvatar &&
                              !message.isOwn &&
                              selectedRoom.type === "group" && (
                                <p className="text-[11px] md:text-xs font-medium mb-0.5 md:mb-1 text-[#4bd865]">
                                  {message.senderName}
                                </p>
                              )}
                            <p className="text-[13px] md:text-[14px] lg:text-[15px] break-words leading-[1.4]">
                              {message.content}
                            </p>
                            {/* Time inside bubble - Telegram style */}
                            <div className="flex items-center justify-end gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                              <span
                                className={cn(
                                  "text-[10px] md:text-[11px]",
                                  message.isOwn
                                    ? "text-white/70"
                                    : "text-gray-400"
                                )}
                              >
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {message.isOwn && (
                                <>
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/70" />
                                  ) : (
                                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/70" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 border-t border-[#2b3642]/50 bg-[#0000004A] relative z-0">
                <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 relative z-0">
                  {/* Attachment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full flex-shrink-0 transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4 md:h-[18px] md:w-[18px] lg:h-5 lg:w-5" />
                  </Button>

                  {/* Input Field Container */}
                  <div className="flex-1 relative z-0">
                    <div className="flex items-center gap-1.5 md:gap-2 bg-[#080E1199] rounded-lg px-2 md:px-2.5 lg:px-3 py-1.5 md:py-2 border border-[#2b3642]/30 hover:border-[#2b3642]/60 focus-within:border-[#5c6bc0]/50 transition-all">
                      <Input
                        ref={inputRef}
                        placeholder="Write a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 h-5 md:h-6 bg-transparent border-none text-white text-[13px] md:text-[14px] placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 p-0 shadow-none"
                        autoComplete="off"
                      />
                      {/* EmojiPicker has z-[9999] and renders in a portal, so it will appear above everything */}
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        align="right"
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full flex-shrink-0 relative z-0"
                            title="Emoji"
                            type="button"
                          >
                            <Smile className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  {/* Send/Voice Button */}
                  {messageInput.trim() ? (
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 p-0 rounded-full bg-[#5c6bc0] hover:bg-[#7986cb] flex-shrink-0 transition-all active:scale-95 shadow-md"
                      title="Send message"
                    >
                      <Send className="h-4 w-4 md:h-[18px] md:w-[18px] lg:h-5 lg:w-5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 p-0 rounded-full hover:bg-[#2b3642]/50 text-gray-400 hover:text-white flex-shrink-0 transition-all"
                      title="Voice message"
                      variant="ghost"
                    >
                      <Mic className="h-4 w-4 md:h-[18px] md:w-[18px] lg:h-5 lg:w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0000004A] px-4 relative z-0">
              <div className="text-center relative">
                <Image
                  src="/purple4.png"
                  alt="Chat placeholder"
                  width={430}
                  height={430}
                  className="mx-auto mb-3 md:mb-4 lg:mb-5 w-[140px] md:w-[260px] lg:w-[380px] h-auto"
                  priority
                />
                <p className="text-[14px] md:text-[18px] lg:text-[24px] font-semibold mb-1 md:mb-1.5 text-[#9BB6CC]">
                  Welcome to Private Rooms!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
