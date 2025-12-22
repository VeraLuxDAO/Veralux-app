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
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RoomInfoView } from "@/components/room-info-view";
import { ChatInput } from "@/components/chat/chat-input";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
  images?: string[]; // Array of image URLs or data URLs
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isRoomInfoOpen, setIsRoomInfoOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [isOpen]);

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

  const handleSendMessage = (content: string, images?: File[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;

    // Convert images to data URLs
    if (images && images.length > 0) {
      const imagePromises = Array.from(images).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((imageUrls) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: "me",
          senderName: "You",
          content: content,
          timestamp: new Date(),
          isRead: false,
          isOwn: true,
          images: imageUrls,
        };
        setMessages((prev) => [...prev, newMessage]);
      });
    } else {
      // No images, create message immediately
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "me",
        senderName: "You",
        content: content,
        timestamp: new Date(),
        isRead: false,
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
    }
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
          "transform transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "hidden md:block",
          "overflow-hidden",
          // Position from left sidebar edge to right edge
          "md:left-[238px] lg:left-[258px] xl:left-[288px]",
          "md:right-[24px]",
          // Width auto to fill space between left and right
          "w-[90vw] md:w-auto",
          isOpen 
            ? "translate-x-0 opacity-100 scale-100" 
            : "translate-x-full opacity-0 scale-95"
        )}
        style={{
          top: "5rem",
          background:
            "linear-gradient(145deg, rgba(14,20,28,0.95) 0%, rgba(8,12,18,0.92) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      >
        <div className="flex h-full overflow-hidden">
          {/* Rooms List - Left Side */}
          <div
            className={cn(
              "flex-shrink-0 border-r-0 flex flex-col relative overflow-hidden transition-none",
              // Hide rooms list when chat is selected on medium screens
              selectedRoom ? "hidden lg:flex" : "flex"
            )}
            style={{ 
              width: `${roomsListWidth}px`,
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
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
              <div className="w-full max-w-full overflow-hidden pt-2">
                {filteredRooms.map((room, index) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                  <div
                    key={room.id}
                    className={cn(
                      "w-full",
                      isSelected ? "" : "px-4"
                    )}
                  >
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        router.push(
                          `/private_rooms?room=${slugifyRoomName(room.name)}`
                        );
                      }}
                      className={cn(
                        "w-full flex items-start gap-3 py-4 cursor-pointer",
                        "hover:opacity-90",
                        "group relative",
                        "[transition:none!important] [transform:none!important]",
                        isSelected 
                          ? "opacity-100 bg-white/5 rounded-lg px-4" 
                          : "px-0"
                      )}
                      style={{
                        borderBottom: isSelected 
                          ? "none" 
                          : "1px solid rgba(255, 255, 255, 0.06)",
                        transition: "none",
                        transform: "none",
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
                  </div>
                  );
                })}
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
            <div 
              className="flex-1 flex min-w-0 relative z-0 animate-in fade-in-0 slide-in-from-right-4 duration-300"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Main Chat Content */}
              <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div 
                className="flex-shrink-0 px-4 lg:px-4 pt-6 border-b border-[#FFFFFF14] animate-in fade-in-0 slide-in-from-top-2 duration-300"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setIsRoomInfoOpen(true)}
                      className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer text-left"
                    >
                      {/* Back button - mobile */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(null);
                        }}
                        className="h-9 w-9 p-0 hover:bg-white/10 text-white rounded-full transition-all lg:hidden flex-shrink-0"
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
                    </button>

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
                          "flex gap-1 transition-all duration-300 ease-out",
                          message.isOwn ? "flex-row-reverse" : "flex-row",
                          "animate-in fade-in-0",
                          message.isOwn 
                            ? "slide-in-from-right-4" 
                            : "slide-in-from-left-4"
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
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
                              "rounded-lg shadow-sm overflow-hidden",
                              "transition-all duration-300 ease-out hover:scale-[1.02]",
                              message.isOwn
                                ? "bg-[#FADEFD] text-[#080E11] rounded-br-sm"
                                : "bg-[#9BB6CC0A] text-[#9BB6CC] rounded-bl-sm"
                            )}
                          >
                            {showAvatar &&
                              !message.isOwn &&
                              selectedRoom.type === "group" && (
                                <p className="text-[11px] md:text-xs font-medium mb-0.5 md:mb-1 px-2.5 pt-1.5 md:px-3 md:pt-2 text-[#4bd865]">
                                  {message.senderName}
                                </p>
                              )}
                            
                            {/* Images */}
                            {message.images && message.images.length > 0 && (
                              <div className={cn(
                                "grid gap-1 p-1",
                                message.images.length === 1 ? "grid-cols-1" : message.images.length === 2 ? "grid-cols-2" : "grid-cols-2"
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
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Message Text */}
                            {message.content && (
                              <p className="text-[13px] md:text-[14px] lg:text-[15px] break-words leading-[1.4] px-2.5 py-1.5 md:px-3 md:py-2">
                                {message.content}
                              </p>
                            )}
                            
                            {/* Time inside bubble - Telegram style */}
                            <div className="flex items-center justify-end gap-0.5 md:gap-1 mt-0.5 md:mt-1 px-2.5 pb-1.5 md:px-3 md:pb-2">
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
              <div 
                className="flex-shrink-0 px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 relative z-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder="Write a message..."
                  forceDesktop={true}
                />
              </div>
              </div>

              {/* Room Info Panel - Right Sidebar */}
              <RoomInfoView
                room={selectedRoom}
                isOpen={isRoomInfoOpen}
                onClose={() => setIsRoomInfoOpen(false)}
              />
            </div>
          ) : (
            <div 
              className="flex-1 flex items-center justify-center px-4 relative z-0 animate-in fade-in-0 zoom-in-95 duration-[400ms]"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="text-center relative flex flex-col items-center justify-center gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <svg 
                  width="200" 
                  height="162" 
                  viewBox="0 0 200 162" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M121.294 83.0244H22.6731C21.7828 83.0244 21.0244 83.7497 21.0244 84.6731V93.6088C21.0244 94.5319 21.7827 95.2574 22.6731 95.2574H121.294C122.218 95.2574 122.943 94.532 122.943 93.6088V84.6731C122.943 83.7497 122.218 83.0244 121.294 83.0244ZM119.646 91.9601H24.3216V86.3217H119.646V91.9601Z" fill="#FADEFD"/>
                  <path d="M22.6731 75.8035H131.12C132.01 75.8035 132.769 75.0782 132.769 74.1548V65.2192C132.769 64.3291 132.01 63.5706 131.12 63.5706H22.6731C21.7828 63.5706 21.0244 64.329 21.0244 65.2192V74.1548C21.0244 75.0782 21.7827 75.8035 22.6731 75.8035ZM24.3216 66.8679H129.471V72.5063H24.3216V66.8679Z" fill="#FADEFD"/>
                  <path d="M22.6731 36.9287H143.781C144.705 36.9287 145.43 36.2032 145.43 35.2801V26.3445C145.43 25.4542 144.705 24.6958 143.781 24.6958H22.6731C21.7828 24.6958 21.0244 25.4541 21.0244 26.3445V35.2801C21.0244 36.2032 21.7827 36.9287 22.6731 36.9287ZM24.3216 27.9931H142.133V33.6315H24.3216V27.9931Z" fill="#FADEFD"/>
                  <path d="M191.163 89.5862H190.343V76.3071C190.343 62.0102 179.453 50.2112 165.533 48.764V20.1071C165.533 9.02072 156.514 0 145.427 0H20.1056C9.01918 0 0 9.02082 0 20.1071V102.167C0 113.253 9.01918 122.272 20.1056 122.272H46.1154L40.0163 159.869C39.91 160.529 40.2127 161.189 40.7827 161.538C41.0467 161.701 41.3462 161.782 41.6441 161.782C41.987 161.782 42.3284 161.675 42.6165 161.464L96.2328 122.262H126.537V136.605C126.537 141.485 130.494 145.442 135.374 145.442H191.163C196.043 145.442 200 141.485 200 136.605V98.4229C200 93.5429 196.043 89.5862 191.163 89.5862ZM196.703 136.605C196.703 139.672 194.23 142.145 191.163 142.145H135.374C132.307 142.145 129.834 139.672 129.834 136.605V122.262V118.965V98.4228C129.834 95.3564 132.307 92.8835 135.374 92.8835H136.58C136.589 92.8837 136.596 92.8885 136.605 92.8885C136.613 92.8885 136.621 92.8837 136.63 92.8835H143.823C143.826 92.8835 143.829 92.8853 143.832 92.8853C143.835 92.8853 143.837 92.8835 143.841 92.8835H143.848H162.246H165.543H181.458C181.461 92.8835 181.464 92.8853 181.467 92.8853C181.47 92.8853 181.473 92.8835 181.476 92.8835H188.669C188.678 92.8837 188.686 92.8885 188.694 92.8885C188.703 92.8885 188.711 92.8837 188.719 92.8835H191.163C194.23 92.8835 196.703 95.3565 196.703 98.4228V136.605H196.703ZM179.818 89.5862H165.543V58.8888C173.634 60.5113 179.818 68.7812 179.818 78.7349V89.5862ZM162.246 89.5862H145.48V78.735C145.48 67.7811 152.967 58.8585 162.246 58.6035V89.5862ZM187.046 76.3071V89.5862H183.116V78.735C183.116 65.8036 173.934 55.2823 162.649 55.2823C151.365 55.2823 142.183 65.8036 142.183 78.735V89.5862H138.253V76.3071C138.253 62.854 149.198 51.9094 162.649 51.9094C176.101 51.9094 187.046 62.854 187.046 76.3071ZM95.6746 118.965C95.5932 118.965 95.512 118.997 95.4306 119.014C95.3594 119.024 95.2922 119.035 95.2221 119.055C95.208 119.06 95.194 119.058 95.1799 119.064C95.0482 119.097 94.8832 119.195 94.7512 119.261C94.7432 119.269 94.7327 119.277 94.7238 119.285C94.719 119.288 94.7126 119.289 94.7078 119.292L43.9142 156.43L49.6812 120.888C49.6884 120.842 49.6724 120.799 49.6759 120.754C49.6795 120.708 49.7022 120.67 49.7022 120.624C49.7022 120.556 49.6716 120.497 49.6635 120.431C49.6498 120.32 49.6337 120.215 49.5987 120.11C49.5644 120.008 49.519 119.916 49.4663 119.824C49.4152 119.733 49.3629 119.65 49.2956 119.571C49.2255 119.488 49.1483 119.42 49.0633 119.352C48.9829 119.288 48.9027 119.231 48.8101 119.182C48.712 119.13 48.6101 119.097 48.501 119.065C48.4374 119.047 48.385 119.007 48.3174 118.996C48.27 118.988 48.2273 119.004 48.1806 119.001C48.1363 118.997 48.0985 118.975 48.0534 118.975H20.1056C10.8369 118.975 3.29732 111.435 3.29732 102.167V20.1071C3.29732 10.8384 10.8369 3.29722 20.1056 3.29722H145.427C154.696 3.29722 162.236 10.8384 162.236 20.1071V48.6329C155.889 48.7275 150.061 50.9644 145.43 54.6551V45.7985C145.43 44.8751 144.705 44.1499 143.781 44.1499H22.6732C21.7829 44.1499 21.0245 44.8751 21.0245 45.7985V54.7339C21.0245 55.6242 21.7828 56.3826 22.6732 56.3826H143.462C138.229 61.4238 134.956 68.4846 134.956 76.307V89.5861H134.945C130.263 89.8169 126.537 93.6746 126.537 98.4227V118.965H95.6746ZM142.133 47.4473V53.0855H24.3217V47.4473H142.133Z" fill="#FADEFD"/>
                  <path d="M165.478 103.566C164.785 103.336 164.027 103.237 163.269 103.237C162.906 103.237 162.543 103.27 162.18 103.303C158.059 103.83 154.894 107.358 154.894 111.612C154.894 112.964 155.224 114.217 155.817 115.371C156.279 116.36 156.971 117.25 157.828 117.943C158.29 118.371 158.785 118.701 159.345 118.998V129.813C159.345 130.736 160.103 131.461 160.994 131.461H165.511C166.434 131.461 167.159 130.736 167.159 129.813V118.998C169.896 117.58 171.644 114.744 171.644 111.612C171.644 107.754 169.039 104.523 165.478 103.566ZM164.983 116.393C164.324 116.624 163.862 117.25 163.862 117.943V128.164H162.643V117.943C162.643 117.25 162.214 116.624 161.554 116.393C161.093 116.228 160.664 115.997 160.268 115.7C159.345 115.008 158.653 114.019 158.356 112.898C158.257 112.502 158.191 112.04 158.191 111.612C158.191 109.403 159.609 107.523 161.587 106.831C162.115 106.633 162.676 106.534 163.269 106.534C163.862 106.534 164.456 106.633 164.984 106.864C166.962 107.523 168.347 109.403 168.347 111.612C168.347 113.755 166.995 115.668 164.983 116.393Z" fill="#FADEFD"/>
                </svg>
                <p className="text-[14px] md:text-[18px] lg:text-[24px] font-semibold mb-1 md:mb-1.5 text-[#FADEFD]">
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
