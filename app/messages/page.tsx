"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Phone,
  Plus,
  Smile,
  Paperclip,
  Send,
  Check,
  CheckCheck,
  Pin,
  VolumeX,
  Lock,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Daiki - Full-stack Dev",
    avatar: "/diverse-user-avatars.png",
    type: "dm",
    lastMessage: "Draft: For the rooms window",
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 0,
    isOnline: true,
    isPinned: true,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "2",
    name: "Thissdax",
    avatar: "/diverse-female-avatar.png",
    type: "dm",
    lastMessage: "Red folder news🔴 at 5:20 pm. Stay active.",
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "3",
    name: "SSPY - Chat",
    type: "group",
    lastMessage: "💬 SSPY - CHAT,📺 SpacePay Announcement C...",
    lastMessageTime: new Date(Date.now() - 2 * 3600000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
    members: 8,
  },
  {
    id: "4",
    name: "Veralux Dev Team",
    avatar: "/developer-avatar.png",
    type: "group",
    lastMessage: "You: thanks 😊",
    lastMessageTime: new Date(Date.now() - 3 * 3600000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
    members: 15,
  },
  {
    id: "5",
    name: "Zephyr_West 🔥 UI/ Designer",
    avatar: "/diverse-user-avatars.png",
    type: "dm",
    lastMessage: "🔥 Here",
    lastMessageTime: new Date(Date.now() - 5 * 3600000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
  },
  {
    id: "6",
    name: "Veralux Design",
    type: "group",
    lastMessage: "Maxim: yep, i saw it, and I will give you ma com...",
    lastMessageTime: new Date(Date.now() - 6 * 3600000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isMuted: false,
    isEncrypted: true,
    members: 12,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Daiki",
    senderAvatar: "/diverse-user-avatars.png",
    content: "slide a half window out from the right.",
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    isOwn: false,
  },
  {
    id: "2",
    senderId: "1",
    senderName: "Daiki",
    senderAvatar: "/diverse-user-avatars.png",
    content:
      "On mobile it will be a full window with the top and bottoms nav bars still active",
    timestamp: new Date(Date.now() - 3500000),
    isRead: true,
    isOwn: false,
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Daiki",
    senderAvatar: "/diverse-user-avatars.png",
    content:
      "The look of the room window will be exactly the same as telegram, same structure and same buttons",
    timestamp: new Date(Date.now() - 3400000),
    isRead: true,
    isOwn: false,
  },
  {
    id: "4",
    senderId: "me",
    senderName: "You",
    content:
      "So for the home screen of the room window.\nThe top bar (red box)....",
    timestamp: new Date(Date.now() - 300000),
    isRead: true,
    isOwn: true,
  },
  {
    id: "5",
    senderId: "me",
    senderName: "You",
    content:
      "There will be a 'back' button on the far left.\n\nThe centre will be the users profile image and profile name.\n\nThe far right will have a '+' and a 'search' button",
    timestamp: new Date(Date.now() - 250000),
    isRead: true,
    isOwn: true,
  },
];

export default function MessagesPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 && selectedRoom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, selectedRoom]);

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
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? "now" : `${minutes}m`;
    }
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "Yesterday";
    if (days < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRooms = mockRooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Rooms List View - Telegram Style
  if (!selectedRoom) {
    return (
      <div className="flex flex-col h-screen bg-[#080E1199]">
        {/* Header - Telegram Style */}
        <div className="flex-shrink-0 bg-[#17212b] border-b border-[#2b3642]/50 shadow-sm">
          <div className="flex items-center justify-between h-[56px] px-3">
            {/* Left: Back Button + Title with Avatar */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="h-10 w-10 p-0 hover:bg-[#2b3642]/60 active:bg-[#2b3642]/80 text-white rounded-full transition-all flex-shrink-0"
              >
                <ArrowLeft className="h-[22px] w-[22px]" />
              </Button>

              <Avatar className="h-9 w-9 ring-2 ring-[#2b3642]/40">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-[#5c6bc0] to-[#4d5ba8] text-white text-sm font-bold">
                  U
                </AvatarFallback>
              </Avatar>

              <h1 className="font-bold text-white text-[17px] tracking-tight">
                Chats
              </h1>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="h-10 w-10 p-0 hover:bg-[#2b3642]/60 active:bg-[#2b3642]/80 text-gray-300 hover:text-white rounded-full transition-all"
              >
                <Search className="h-[21px] w-[21px]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 hover:bg-[#2b3642]/60 active:bg-[#2b3642]/80 text-gray-300 hover:text-white rounded-full transition-all"
              >
                <Plus className="h-[21px] w-[21px]" />
              </Button>
            </div>
          </div>

          {/* Search Bar - Shown when search is active */}
          {showSearch && (
            <div className="px-4 pb-3 pt-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-3 h-9 bg-[#080E1199] border border-[#2b3642]/30 rounded-lg text-white text-[14px] placeholder:text-gray-500 focus:border-[#5c6bc0]/50 focus:ring-0"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Rooms List - Telegram Style */}
        <div className="flex-1 overflow-y-auto bg-[#080E1199]">
          {filteredRooms.map((room, index) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#17212b] active:bg-[#1c2733] transition-all duration-150"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-[56px] w-[56px] ring-1 ring-[#2b3642]/30">
                  <AvatarImage src={room.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-[#2b3642] to-[#1c2733] text-white text-lg font-medium">
                    {room.type === "group" ? "👥" : room.name[0]}
                  </AvatarFallback>
                </Avatar>
                {room.isOnline && room.type === "dm" && (
                  <div className="absolute bottom-0.5 right-0.5 w-[14px] h-[14px] bg-[#4bd865] border-[3px] border-[#0e1621] rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-semibold text-white truncate text-[16px] leading-tight">
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
                      <Pin className="h-3 w-3 text-gray-500 fill-gray-500" />
                    )}
                    <span className="text-[11px] text-gray-500 font-medium">
                      {room.lastMessageTime && formatTime(room.lastMessageTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {room.isMuted && (
                      <VolumeX className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    )}
                    <p className="text-[14px] text-[#8B96A5] truncate leading-tight">
                      {room.isTyping ? (
                        <span className="text-[#4bd865] italic font-medium">
                          typing...
                        </span>
                      ) : (
                        <span className="line-clamp-1">{room.lastMessage}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {room.unreadCount > 0 ? (
                      <Badge className="h-[20px] min-w-[20px] px-1.5 bg-[#4bd865] text-[#0e1621] text-[11px] rounded-full flex items-center justify-center font-bold shadow-sm">
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </Badge>
                    ) : room.type === "dm" ? (
                      <CheckCheck className="h-[15px] w-[15px] text-[#4bd865]" />
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat View - Telegram Style
  return (
    <div className="flex flex-col h-screen bg-[#080E1199]">
      {/* Chat Header - Telegram Style */}
      <div className="flex-shrink-0 bg-[#1c2733] border-b border-[#2b3642]">
        <div className="flex items-center justify-between px-2 h-14">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRoom(null)}
              className="h-9 w-9 p-0 hover:bg-[#2b3642] text-white flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="relative flex-shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedRoom.avatar} />
                <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                  {selectedRoom.type === "group" ? "👥" : selectedRoom.name[0]}
                </AvatarFallback>
              </Avatar>
              {selectedRoom.isOnline && selectedRoom.type === "dm" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4bd865] border-2 border-[#1c2733] rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate text-[15px] leading-tight">
                {selectedRoom.name}
              </h3>
              <p className="text-xs text-gray-400 truncate leading-tight">
                {selectedRoom.type === "dm"
                  ? selectedRoom.isOnline
                    ? "online"
                    : "offline"
                  : `${selectedRoom.members} members`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-[#2b3642] text-white"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-[#2b3642] text-white"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area - Telegram Style */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-2">
          {messages.map((message, index) => {
            const showAvatar =
              index === 0 || messages[index - 1]?.senderId !== message.senderId;
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

                {/* Message Bubble - Telegram Style */}
                <div
                  className={cn(
                    "flex flex-col max-w-[75%]",
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
                    <p className="text-[15px] break-words leading-[1.4] whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {/* Time inside bubble - Telegram style */}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span
                        className={cn(
                          "text-[11px]",
                          message.isOwn ? "text-white/70" : "text-gray-400"
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Telegram Style */}
      <div className="flex-shrink-0 px-3 py-3 bg-[#17212b] border-t border-[#2b3642]/50">
        <div className="flex items-center gap-2">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-[#2b3642]/50 active:bg-[#2b3642]/70 text-gray-400 hover:text-white rounded-full flex-shrink-0 transition-all"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* Input Field Container */}
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-[#080E1199] rounded-xl px-3 py-2.5 border border-[#2b3642]/30 active:border-[#5c6bc0]/50 transition-all">
              <Input
                ref={inputRef}
                placeholder="Message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 h-6 bg-transparent border-none text-white text-[15px] placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 p-0 shadow-none"
                autoComplete="off"
              />
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-[#2b3642]/50 active:bg-[#2b3642]/70 text-gray-400 hover:text-white rounded-full flex-shrink-0"
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
              className="h-10 w-10 p-0 rounded-full bg-[#5c6bc0] hover:bg-[#7986cb] active:bg-[#4d5ba8] flex-shrink-0 shadow-md transition-all active:scale-95"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-10 w-10 p-0 rounded-full hover:bg-[#2b3642]/50 active:bg-[#2b3642]/70 text-gray-400 hover:text-white flex-shrink-0 transition-all"
              variant="ghost"
              title="Voice message"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
