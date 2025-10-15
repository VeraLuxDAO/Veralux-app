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
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [roomsListWidth, setRoomsListWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const MIN_WIDTH = 240; // Minimum width for rooms list
  const MAX_WIDTH = 500; // Maximum width for rooms list

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

  useEffect(() => {
    if (isOpen && !selectedRoom) {
      // Auto-select first room when opening
      setSelectedRoom(mockRooms[0] || null);
    }
  }, [isOpen, selectedRoom]);

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
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[55] transition-opacity duration-300",
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
          "fixed right-0 h-[calc(100vh-5rem)] z-[60]",
          "bg-[#0e1621] border-l border-[#17212b] shadow-2xl",
          "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hidden md:block",
          // Responsive widths
          "w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[50vw]",
          "max-w-[1200px] min-w-[600px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: "5rem" }}
      >
        <div className="flex h-full overflow-hidden">
          {/* Rooms List - Left Side */}
          <div
            className={cn(
              "flex-shrink-0 border-r-0 flex flex-col bg-[#0e1621] relative overflow-hidden transition-none",
              // Hide rooms list when chat is selected on medium screens
              selectedRoom ? "hidden lg:flex" : "flex"
            )}
            style={{ width: `${roomsListWidth}px` }}
          >
            {/* Header */}
            <div className="px-2 md:px-3 py-2.5 md:py-3 border-b border-[#2b3642]/50 bg-[#17212b] flex-shrink-0 shadow-sm w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-2 md:mb-3 w-full">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-[#4bd865] to-[#3ca854] flex items-center justify-center">
                    <Lock className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <h2 className="text-[14px] md:text-[16px] font-bold text-white tracking-tight">
                    Private Rooms
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#2b3642]/60 active:bg-[#2b3642]/80 text-gray-400 hover:text-white rounded-full transition-all"
                >
                  <X className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 pointer-events-none" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:pl-9 pr-2.5 md:pr-3 h-8 md:h-9 bg-[#0e1621] border border-[#2b3642]/30 text-white text-[12px] md:text-[13px] placeholder:text-gray-500 focus:ring-0 focus:border-[#5c6bc0]/50 rounded-lg transition-all"
                />
              </div>
            </div>

            {/* Rooms List */}
            <ScrollArea className="flex-1 overflow-hidden w-full">
              <div className="w-full max-w-full overflow-hidden">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={cn(
                      "w-full max-w-full flex items-center gap-3 px-3 md:px-4 py-3 transition-all duration-150",
                      "hover:bg-[#17212b]/80 cursor-pointer active:bg-[#1c2733]",
                      "relative z-0 overflow-hidden",
                      selectedRoom?.id === room.id ? "bg-[#17212b]" : ""
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-[50px] w-[50px] md:h-[52px] md:w-[52px]">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#2b3642] to-[#1c2733] text-white text-base font-medium">
                          {room.type === "group" ? "👥" : room.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {room.isOnline && room.type === "dm" && (
                        <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#4bd865] border-[2.5px] border-[#0e1621] rounded-full" />
                      )}
                    </div>

                    {/* Content - Telegram-style layout */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {/* Row 1: Name and Timestamp */}
                      <div className="flex items-baseline justify-start gap-2 mb-1.5">
                        <h3 className="font-semibold text-[15px] text-white truncate">
                          {room.name}
                        </h3>
                        {room.lastMessageTime && (
                          <span className="text-[13px] text-[#aaaaaa] font-normal whitespace-nowrap flex-shrink-0">
                            {formatTime(room.lastMessageTime)}
                          </span>
                        )}
                      </div>

                      {/* Row 2: Message Preview and Unread Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                          {/* Status Icons */}
                          {room.isMuted && (
                            <VolumeX className="h-[14px] w-[14px] text-[#707579] flex-shrink-0" />
                          )}
                          {room.isPinned && (
                            <Pin className="h-[14px] w-[14px] text-[#707579] flex-shrink-0" />
                          )}
                          {!room.unreadCount &&
                            room.type === "dm" &&
                            !room.isTyping && (
                              <CheckCheck className="h-[14px] w-[14px] text-[#4bd865] flex-shrink-0" />
                            )}

                          {/* Message Preview */}
                          <p className="text-[14px] text-[#8b98a5] truncate">
                            {room.isTyping ? (
                              <span className="text-[#4bd865] italic">
                                typing...
                              </span>
                            ) : (
                              <span className="truncate">
                                {room.type === "group" && room.lastMessage && (
                                  <span className="text-[#8b98a5]">
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
                        </div>

                        {/* Unread Badge - Telegram style */}
                        {room.unreadCount > 0 && (
                          <div className="h-[22px] min-w-[22px] px-1.5 bg-[#4cd964] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[13px] text-white font-semibold">
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
              "relative flex-shrink-0 w-1 bg-[#2b3642]/50 group hover:bg-[#5c6bc0] transition-colors duration-200",
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
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 transition-all pointer-events-none">
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
            <div className="flex-1 flex flex-col min-w-0 bg-[#0e1621] relative z-0">
              {/* Chat Header */}
              <div className="flex-shrink-0 px-2 md:px-3 lg:px-4 py-2 md:py-2.5 border-b border-[#2b3642]/50 bg-[#17212b]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 flex-1 min-w-0">
                    {/* Back button - only visible on md-lg screens when room is selected */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRoom(null)}
                      className="h-8 w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all lg:hidden"
                    >
                      <ArrowLeft className="h-[18px] w-[18px]" />
                    </Button>

                    <div className="relative flex-shrink-0">
                      <Avatar className="h-[36px] w-[36px] md:h-[38px] md:w-[38px] lg:h-[42px] lg:w-[42px]">
                        <AvatarImage src={selectedRoom.avatar} />
                        <AvatarFallback className="bg-[#2b3642] text-white text-xs md:text-sm">
                          {selectedRoom.type === "group"
                            ? "👥"
                            : selectedRoom.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {selectedRoom.isOnline && selectedRoom.type === "dm" && (
                        <div className="absolute bottom-0 right-0 w-[9px] h-[9px] md:w-[10px] md:h-[10px] lg:w-[11px] lg:h-[11px] bg-[#4bd865] border-[2px] md:border-[2.5px] border-[#17212b] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white flex items-center gap-1 md:gap-1.5 truncate text-[13px] md:text-[14px] lg:text-[15px] leading-tight">
                        {selectedRoom.name}
                        {selectedRoom.isEncrypted && (
                          <Lock className="h-2.5 w-2.5 md:h-3 md:w-3 text-[#4bd865] flex-shrink-0" />
                        )}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-[#707579] truncate leading-tight mt-0.5">
                        {selectedRoom.type === "dm"
                          ? selectedRoom.isOnline
                            ? "online"
                            : "last seen recently"
                          : `${selectedRoom.members} members`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Phone className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Video className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Search className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <MoreVertical className="h-[16px] w-[16px] md:h-[18px] md:w-[18px]" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-2 md:px-3 lg:px-4 py-2 md:py-3"
                ref={messagesContainerRef}
              >
                <div className="space-y-1.5 md:space-y-2 max-w-4xl mx-auto">
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
              <div className="flex-shrink-0 px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 border-t border-[#2b3642]/50 bg-[#17212b] relative z-0">
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
                    <div className="flex items-center gap-1.5 md:gap-2 bg-[#0e1621] rounded-lg px-2 md:px-2.5 lg:px-3 py-1.5 md:py-2 border border-[#2b3642]/30 hover:border-[#2b3642]/60 focus-within:border-[#5c6bc0]/50 transition-all">
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
            <div className="flex-1 flex items-center justify-center bg-[#0e1621] px-4 relative z-0">
              <div className="text-center relative">
                <MessageCircle className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 mx-auto mb-3 md:mb-4 lg:mb-5 opacity-10 text-gray-500" />
                <p className="text-[14px] md:text-[15px] lg:text-[17px] font-medium mb-1 md:mb-1.5 text-white">
                  Select a chat to start messaging
                </p>
                <p className="text-[11px] md:text-[12px] lg:text-[13px] text-[#707579]">
                  Choose from your existing conversations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
