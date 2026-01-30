"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { NavigationLayout } from "@/components/navigation-layout";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RoomInfoView } from "@/components/room-info-view";
import { AvatarViewer } from "@/components/avatar-viewer";
import { ChatInput } from "@/components/chat/chat-input";
import { ImageViewer } from "@/components/chat/image-viewer";
import { TelegramEmoji } from "@/components/chat/telegram-emoji";
import {
  Search,
  ChevronLeft,
  MoreVertical,
  Phone,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useMobileMenu } from "@/contexts/mobile-menu-context";
import { shouldDisplayAsEmoticonOnly } from "@/lib/emoji-utils";

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

function MessagesPageContent() {
  // URL state: room slug in query param
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();

  const slugifyRoomName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const activeRoomSlug = searchParams.get("room");
  const selectedRoom =
    activeRoomSlug != null
      ? mockRooms.find((room) => slugifyRoomName(room.name) === activeRoomSlug) ||
        null
      : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileRoomInfoOpen, setIsMobileRoomInfoOpen] = useState(false);
  const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageList, setCurrentImageList] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { openMobileMenu } = useMobileMenu();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 && selectedRoom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, selectedRoom]);

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

  // Rooms List View - Rooms design (no room selected in URL); top bar via NavigationLayout
  if (!selectedRoom) {
    return (
      <NavigationLayout>
        <div className="flex flex-col bg-[#080E1199] min-h-0 h-[calc(100dvh-140px)] md:h-full p-4">
          {/* Header - Maxwell's Private Room (green: fixed header) */}
          <header className="flex-shrink-0 border-b border-white/5 bg-[#080E11] pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0 border border-white/10">
                <AvatarImage src={auth.user?.picture} />
                <AvatarFallback className="bg-[#2b3642] text-white text-sm font-medium">
                  {auth.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-[16px] font-light truncate"
                  style={{ color: "#FFFFFF", fontFamily: "'Geist'", fontSize: "16px" }}
                >
                  Maxwell&apos;s Private Room
                </h1>
                <p
                  className="text-[12px] truncate"
                  style={{
                    color: "rgba(155, 182, 204, 0.9)",
                    fontFamily: "'Geist'",
                  }}
                >
                  Encrypted Messaging
                </p>
              </div>
            </div>

            {/* Search rooms */}
            <div className="relative mt-4">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99] pointer-events-none" />
              <Input
                placeholder="Search rooms"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 h-11 border border-white/10 text-[#9BB6CC99] text-[14px] placeholder:text-[#9BB6CC99] focus:ring-0 focus:border-white/30 rounded-full transition-all shadow-inner w-full"
                style={{
                  fontFamily: "'Geist'",
                  backgroundColor: "#E5F7FD0A",
                }}
              />
            </div>
          </header>

          {/* Channel list only - scrollable (red section) */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-[100px]">
            <div className="pt-2">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() =>
                    router.push(
                      `/messages?room=${slugifyRoomName(room.name)}`
                    )
                  }
                  className={cn(
                    "w-full flex items-start gap-3 py-4 cursor-pointer group relative",
                    "transition-colors duration-300",
                    "hover:bg-white/5 active:bg-[#FFFFFF14]"
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
                      <div className="absolute bottom-0.5 right-0.5 w-[14px] h-[14px] bg-[#4bd865] border-[3px] border-[#0e1621] rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                    <div className="flex-1 min-w-0 text-left flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="flex items-center text-sm leading-[18px] font-light text-white truncate flex-1"
                          style={{ fontFamily: "'Geist'" }}
                        >
                          {room.name}
                        </span>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Read status check mark (DMs with no unread, not typing) */}
                          {!room.unreadCount &&
                            room.type === "dm" &&
                            !room.isTyping && (
                              <CheckCheck className="h-3.5 w-3.5 text-[#4bd865] flex-shrink-0" />
                            )}

                          {/* Time pill */}
                          {room.lastMessageTime && (
                            <span
                              className="inline-flex flex-row items-center justify-center py-[2px] px-1 rounded-[10px] text-[10px] font-medium text-[#9BB6CC] bg-[rgba(155,182,204,0.1)] flex-none order-1 grow-0 whitespace-nowrap"
                              style={{
                                fontFamily: "'Geist'",
                              }}
                            >
                              {formatTime(room.lastMessageTime)}
                            </span>
                          )}
                        </div>
                      </div>

                    {/* Message preview + status */}
                    <div className="flex items-center gap-1.5">
                      {room.isMuted && (
                        <VolumeX className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      )}
                      {room.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      )}

                      <p
                        className="text-[12px] leading-relaxed flex-1 truncate"
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
                          room.lastMessage
                        )}
                      </p>

                      {/* Unread badge */}
                      {room.unreadCount > 0 && (
                        <div className="h-5 min-w-5 px-1.5 bg-[#4cd964] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] text-white font-semibold">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </NavigationLayout>
    );
  }

  // Chat View - Fills layout; header + messages (scroll) + input always visible
  return (
    <NavigationLayout className="p-0">
    <div className="flex flex-col h-full min-h-0 flex-1 overflow-hidden w-full">
      {/* Back button row - between app header and chatting header */}
      <div className="flex-shrink-0 flex items-center px-3 md:px-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/95 hover:text-white hover:bg-white/10 -ml-1.5"
          onClick={() => router.push("/messages")}
          title="Back to rooms"
        >
          <ChevronLeft className="h-5 w-5 mr-0.5" />
          <span className="text-[15px] font-medium">Back</span>
        </Button>
      </div>

      {/* Single combined header: room info + actions + menu */}
      <div className="flex-shrink-0 sticky top-0 z-10 md:block ml-3 p-2 mr-3 bg-[#080E1199] backdrop-blur-lg rounded-[48px] border border-white/5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Avatar - Clickable for avatar viewer */}
            <div 
              className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarViewerOpen(true);
              }}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedRoom.avatar} />
                <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                  {selectedRoom.type === "group" ? "👥" : selectedRoom.name[0]}
                </AvatarFallback>
              </Avatar>
              {selectedRoom.isOnline && selectedRoom.type === "dm" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4bd865] border-2 border-[#080E11] rounded-full" />
              )}
            </div>

            {/* Name and status - Clickable for room info */}
            <button
              onClick={() => setIsMobileRoomInfoOpen(true)}
              className="flex flex-col min-w-0 text-left active:opacity-80 transition-opacity flex-1"
            >
              <div className="flex items-center gap-1 truncate">
                <p className="text-white truncate leading-tight text-[14px]">
                  {selectedRoom.name} 
                </p>
                {selectedRoom.isEncrypted && (
                  <Lock className="h-3.5 w-3.5 text-[#4bd865] flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#9BB6CC99] truncate leading-tight">
                {selectedRoom.type === "dm"
                  ? selectedRoom.isOnline
                    ? "online"
                    : "offline"
                  : `${selectedRoom.members} members`}
              </p>
            </button>
          </div>

          {/* Far right: search and more options (3 dots) */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-[#9BB6CC99] hover:bg-white/10 hover:text-white"
              title="Search in chat"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-white hover:bg-white/10 md:hidden"
              title="More options"
              onClick={openMobileMenu}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area - only scrollable region; tabIndex allows focus so wheel/touch scroll works */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Chat messages"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-4 touch-pan-y"
      >
        <div className="space-y-3">
          {messages.map((message, index) => {
            const showAvatar =
              index === 0 || messages[index - 1]?.senderId !== message.senderId;
            const showTime =
              index === messages.length - 1 ||
              messages[index + 1]?.senderId !== message.senderId;
            const isEmoticonOnly = shouldDisplayAsEmoticonOnly(message.content, message.images);

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

                {/* Message Bubble - Telegram Style; min-w-0 so long text wraps and bubble is responsive */}
                <div
                  className={cn(
                    "flex flex-col min-w-0 max-w-[75%]",
                    message.isOwn ? "items-end" : "items-start"
                  )}
                >
                  {isEmoticonOnly ? (
                    /* Emoticon-Only Display - Large, Prominent (No Bubble); only for actual emoticons, not numbers */
                    <div
                      style={{
                        fontSize: "4rem",
                        lineHeight: "1.2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TelegramEmoji content={message.content.trim()} size={192} />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "rounded-lg shadow-sm overflow-hidden min-w-0 w-full max-w-full",
                        message.isOwn
                          ? "bg-[#FADEFD] text-[#080E11] rounded-br-sm"
                          : "bg-[#9BB6CC0A] text-[#9BB6CC] rounded-bl-sm"
                      )}
                    >
                      {showAvatar &&
                        !message.isOwn &&
                        selectedRoom.type === "group" && (
                          <p className="text-xs font-medium mb-1 px-3 pt-2 text-[#4bd865]">
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
                                onClick={() => {
                                  setCurrentImageList(message.images!);
                                  setCurrentImageIndex(index);
                                  setImageViewerOpen(true);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Message Text - break-words and overflow-wrap so long text wraps; bubble stays responsive */}
                      {message.content && (
                        <p className="text-[15px] break-words break-all leading-[1.4] whitespace-pre-wrap px-3 py-2 min-w-0">
                          <TelegramEmoji content={message.content} size={20} />
                        </p>
                      )}
                      
                      {/* Time inside bubble - Telegram style */}
                      <div className="flex items-center justify-end gap-1 mt-1 px-3 pb-2">
                        <span
                          className={cn(
                            "text-[10px]",
                            message.isOwn ? "text-[#080E11]" : "text-[#9BB6CC]"
                          )}
                        >
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {message.isOwn && (
                          <>
                            {message.isRead ? (
                              <CheckCheck className="h-3.5 w-3.5 text-[#080E11]" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-[#080E11]" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - always visible at bottom; flex-shrink-0 keeps it in view */}
      <div className="flex-shrink-0 ">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="Send Message"
        />
      </div>

      {/* Image Viewer */}
      {currentImageList.length > 0 && (
        <ImageViewer
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          images={currentImageList}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />
      )}

      {/* Mobile Room Info Sheet - Full Screen */}
      <div className="md:hidden">
        <Sheet open={isMobileRoomInfoOpen} onOpenChange={setIsMobileRoomInfoOpen}>
          <SheetContent
            side="right"
            className="w-full p-0 bg-[#05080d] border-0 overflow-hidden"
            showCloseButton={false}
          >
            {selectedRoom && (
              <RoomInfoView
                room={selectedRoom}
                isOpen={true}
                onClose={() => setIsMobileRoomInfoOpen(false)}
                isMobile={true}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Avatar Viewer Popup */}
      {selectedRoom && (
        <AvatarViewer
          isOpen={isAvatarViewerOpen}
          onClose={() => setIsAvatarViewerOpen(false)}
          {...(selectedRoom.avatar ? { avatarUrl: selectedRoom.avatar } : {})}
          fallbackText={selectedRoom.type === "group" ? "👥" : selectedRoom.name[0] || "👤"}
          userName={selectedRoom.name}
        />
      )}
    </div>
    </NavigationLayout>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
