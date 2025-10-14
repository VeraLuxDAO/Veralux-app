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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - positioned below top nav but above content */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300",
          "hidden md:block",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        style={{ top: "5rem" }}
      />

      {/* Sliding Panel - Desktop Only */}
      <div
        className={cn(
          "fixed right-0 h-[calc(100vh-5rem)] w-[50vw] min-w-[680px] max-w-[1200px]",
          "bg-[#0e1621] border-l border-[#17212b] shadow-2xl z-[100]",
          "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hidden md:block",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: "5rem" }}
      >
        <div className="flex h-full">
          {/* Rooms List - Left Side */}
          <div className="w-[340px] flex-shrink-0 border-r border-[#2b3642]/50 flex flex-col bg-[#0e1621]">
            {/* Header */}
            <div className="px-3 py-3 border-b border-[#2b3642]/50 bg-[#17212b] flex-shrink-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4bd865] to-[#3ca854] flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-[16px] font-bold text-white tracking-tight">
                    Private Rooms
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-[#2b3642]/60 active:bg-[#2b3642]/80 text-gray-400 hover:text-white rounded-full transition-all"
                >
                  <X className="h-[18px] w-[18px]" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 h-9 bg-[#0e1621] border border-[#2b3642]/30 text-white text-[13px] placeholder:text-gray-500 focus:ring-0 focus:border-[#5c6bc0]/50 rounded-lg transition-all"
                />
              </div>
            </div>

            {/* Rooms List */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-0">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-3 py-3 transition-all duration-150",
                      "hover:bg-[#17212b]/80 cursor-pointer active:bg-[#1c2733]",
                      selectedRoom?.id === room.id ? "bg-[#17212b]" : ""
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-[52px] w-[52px] ring-1 ring-[#2b3642]/20">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#2b3642] to-[#1c2733] text-white text-base font-medium">
                          {room.type === "group" ? "👥" : room.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {room.isOnline && room.type === "dm" && (
                        <div className="absolute bottom-0 right-0 w-[13px] h-[13px] bg-[#4bd865] border-[2.5px] border-[#0e1621] rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="font-semibold text-[15px] text-white truncate leading-tight">
                            {room.name}
                          </span>
                          {room.type === "group" && (
                            <span className="text-[10px] text-gray-500 flex-shrink-0">
                              👥
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {room.isPinned && (
                            <Pin className="h-2.5 w-2.5 text-gray-500 fill-gray-500" />
                          )}
                          <span className="text-[11px] text-gray-500 font-medium">
                            {room.lastMessageTime &&
                              formatTime(room.lastMessageTime)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {room.isMuted && (
                            <VolumeX className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          )}
                          <p className="text-[13px] text-[#8B96A5] truncate leading-tight">
                            {room.isTyping ? (
                              <span className="text-[#4bd865] italic font-medium">
                                typing...
                              </span>
                            ) : (
                              <span className="line-clamp-1">
                                {room.lastMessage}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {room.unreadCount > 0 ? (
                            <Badge className="h-[18px] min-w-[18px] px-1 bg-[#4bd865] text-[#0e1621] text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                              {room.unreadCount > 99 ? "99+" : room.unreadCount}
                            </Badge>
                          ) : room.type === "dm" ? (
                            <CheckCheck className="h-[14px] w-[14px] text-[#4bd865]" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area - Right Side */}
          {selectedRoom ? (
            <div className="flex-1 flex flex-col min-w-0 bg-[#0e1621]">
              {/* Chat Header */}
              <div className="flex-shrink-0 px-4 py-2.5 border-b border-[#2b3642]/50 bg-[#17212b]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-[42px] w-[42px]">
                        <AvatarImage src={selectedRoom.avatar} />
                        <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                          {selectedRoom.type === "group"
                            ? "👥"
                            : selectedRoom.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {selectedRoom.isOnline && selectedRoom.type === "dm" && (
                        <div className="absolute bottom-0 right-0 w-[11px] h-[11px] bg-[#4bd865] border-[2.5px] border-[#17212b] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white flex items-center gap-1.5 truncate text-[15px] leading-tight">
                        {selectedRoom.name}
                        {selectedRoom.isEncrypted && (
                          <Lock className="h-3 w-3 text-[#4bd865] flex-shrink-0" />
                        )}
                      </h3>
                      <p className="text-[11px] text-[#707579] truncate leading-tight mt-0.5">
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
                      className="h-8 w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Phone className="h-[18px] w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Video className="h-[18px] w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <Search className="h-[18px] w-[18px]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full transition-all"
                    >
                      <MoreVertical className="h-[18px] w-[18px]" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-4 py-3"
                ref={messagesContainerRef}
              >
                <div className="space-y-2 max-w-4xl mx-auto">
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
                        <div className="flex-shrink-0 w-8 mt-auto">
                          {showAvatar && !message.isOwn ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback className="bg-[#2b3642] text-white text-xs">
                                {message.senderName[0]}
                              </AvatarFallback>
                            </Avatar>
                          ) : null}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "flex flex-col max-w-[65%]",
                            message.isOwn ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "px-3 py-2 rounded-lg shadow-sm",
                              message.isOwn
                                ? "bg-[#5c6bc0] text-white rounded-br-sm"
                                : "bg-[#1c2733] text-white rounded-bl-sm"
                            )}
                          >
                            {showAvatar &&
                              !message.isOwn &&
                              selectedRoom.type === "group" && (
                                <p className="text-xs font-medium mb-1 text-[#4bd865]">
                                  {message.senderName}
                                </p>
                              )}
                            <p className="text-[15px] break-words leading-[1.4]">
                              {message.content}
                            </p>
                            {/* Time inside bubble - Telegram style */}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span
                                className={cn(
                                  "text-[11px]",
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
                                    <CheckCheck className="h-3.5 w-3.5 text-white/70" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 text-white/70" />
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
              <div className="flex-shrink-0 px-4 py-3 border-t border-[#2b3642]/50 bg-[#17212b]">
                <div className="flex items-center gap-3">
                  {/* Attachment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full flex-shrink-0 transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  {/* Input Field Container */}
                  <div className="flex-1 relative">
                    <div className="flex items-center gap-2 bg-[#0e1621] rounded-lg px-3 py-2 border border-[#2b3642]/30 hover:border-[#2b3642]/60 focus-within:border-[#5c6bc0]/50 transition-all">
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
                        className="flex-1 h-6 bg-transparent border-none text-white text-[14px] placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 p-0 shadow-none"
                        autoComplete="off"
                      />
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-[#2b3642]/50 text-gray-400 hover:text-white rounded-full flex-shrink-0"
                            title="Emoji"
                            type="button"
                          >
                            <Smile className="h-4 w-4" />
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
                      className="h-10 w-10 p-0 rounded-full bg-[#5c6bc0] hover:bg-[#7986cb] flex-shrink-0 transition-all active:scale-95 shadow-md"
                      title="Send message"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-10 w-10 p-0 rounded-full hover:bg-[#2b3642]/50 text-gray-400 hover:text-white flex-shrink-0 transition-all"
                      title="Voice message"
                      variant="ghost"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0e1621]">
              <div className="text-center">
                <MessageCircle className="h-20 w-20 mx-auto mb-5 opacity-10 text-gray-500" />
                <p className="text-[17px] font-medium mb-1.5 text-white">
                  Select a chat to start messaging
                </p>
                <p className="text-[13px] text-[#707579]">
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
