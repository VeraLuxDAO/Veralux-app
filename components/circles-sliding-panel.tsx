"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  Hash,
  Volume2,
  Lock,
  ChevronDown,
  Settings,
  Users,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChatMessageComponent,
  type ChatMessage,
} from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";

interface Circle {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
}

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  isPrivate: boolean;
  unreadCount?: number;
}

interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
  isCollapsed?: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  role?: string;
}

interface CirclesSlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data
const mockCircles: Record<string, Circle> = {
  "defi-builders": {
    id: "defi-builders",
    name: "DeFi Builders",
    icon: "🏗️",
    memberCount: 1247,
    onlineCount: 47,
  },
  "gaming-alpha": {
    id: "gaming-alpha",
    name: "Gaming Alpha",
    icon: "🎮",
    memberCount: 856,
    onlineCount: 23,
  },
  "nft-collectors": {
    id: "nft-collectors",
    name: "NFT Collectors",
    icon: "💎",
    memberCount: 2341,
    onlineCount: 31,
  },
};

const mockChannelCategories: ChannelCategory[] = [
  {
    id: "text-channels",
    name: "Text Channels",
    channels: [
      {
        id: "general",
        name: "general",
        type: "text",
        isPrivate: false,
        unreadCount: 3,
      },
      {
        id: "announcements",
        name: "announcements",
        type: "text",
        isPrivate: false,
      },
      {
        id: "dev-discussion",
        name: "dev-discussion",
        type: "text",
        isPrivate: false,
        unreadCount: 1,
      },
      {
        id: "trading-signals",
        name: "trading-signals",
        type: "text",
        isPrivate: true,
        unreadCount: 5,
      },
    ],
  },
  {
    id: "voice-channels",
    name: "Voice Channels",
    channels: [
      { id: "general-voice", name: "General", type: "voice", isPrivate: false },
      { id: "dev-hangout", name: "Dev Hangout", type: "voice", isPrivate: false },
      { id: "trading-room", name: "Trading Room", type: "voice", isPrivate: true },
    ],
  },
];

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Vitalik Buterin",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    role: "Admin",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    status: "online",
    role: "Moderator",
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "/developer-avatar.png",
    status: "idle",
  },
  {
    id: "4",
    name: "Clara Jin",
    status: "online",
  },
  {
    id: "5",
    name: "Maxwell",
    status: "offline",
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Welcome to the DeFi Builders circle! 🎉",
    authorId: "system",
    authorName: "System",
    timestamp: new Date(Date.now() - 86400000),
    type: "system",
    isOwn: false,
  },
  {
    id: "2",
    content:
      "Hey everyone! Just deployed a new liquidity pool on Uniswap V4. The gas optimizations are incredible! 🚀",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3600000),
    type: "text",
    isOwn: false,
    reactions: [
      { emoji: "🚀", count: 12, hasReacted: false },
      { emoji: "🔥", count: 8, hasReacted: true },
    ],
  },
  {
    id: "3",
    content: "That's amazing! What kind of gas savings are you seeing compared to V3?",
    authorId: "sarah",
    authorName: "Sarah Miller",
    authorAvatar: "/diverse-female-avatar.png",
    timestamp: new Date(Date.now() - 3500000),
    type: "text",
    isOwn: false,
    replyTo: {
      id: "2",
      authorName: "Vitalik Buterin",
      content: "Hey everyone! Just deployed a new liquidity pool on Uniswap V4...",
    },
  },
  {
    id: "4",
    content: "Around 40% reduction in gas costs for complex swaps. The hook system is a game changer!",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3400000),
    type: "text",
    isOwn: false,
  },
  {
    id: "5",
    content: "This is exactly what we need for mainstream adoption. Lower fees = more users 💪",
    authorId: "current-user",
    authorName: "You",
    timestamp: new Date(Date.now() - 1800000),
    type: "text",
    isOwn: true,
  },
];

export function CirclesSlidingPanel({
  isOpen,
  onClose,
}: CirclesSlidingPanelProps) {
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [channelCategories, setChannelCategories] = useState(mockChannelCategories);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const slugifyCircleName = (name: string) =>
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
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // Sync selectedCircle with URL when panel is open
  useEffect(() => {
    if (!isOpen) return;

    const circleSlug = searchParams.get("circle");

    if (circleSlug) {
      const circle = Object.values(mockCircles).find(
        (c) => slugifyCircleName(c.name) === circleSlug
      );
      setSelectedCircle(circle || null);
    } else {
      setSelectedCircle(null);
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

  // Hide AI button when circles panel is open
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

    return () => {
      const aiButton = document.querySelector(".desktop-ai-tab-container");
      if (aiButton) {
        (aiButton as HTMLElement).style.opacity = "1";
        (aiButton as HTMLElement).style.pointerEvents = "auto";
      }
    };
  }, [isOpen]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      authorId: "current-user",
      authorName: "You",
      timestamp: new Date(),
      type: "text",
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setChannelCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isCollapsed: !category.isCollapsed }
          : category
      )
    );
  };

  const activeChannel = channelCategories
    .flatMap((cat) => cat.channels)
    .find((ch) => ch.id === activeChannelId);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
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
          "circles-sliding-panel",
          "fixed h-[calc(100vh-5rem)] z-[70]",
          "shadow-[0_20px_45px_rgba(0,0,0,0.45)]",
          "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hidden md:block",
          "overflow-hidden",
          "md:left-[238px] lg:left-[258px] xl:left-[288px]",
          "md:right-[24px]",
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
        {selectedCircle ? (
          <div className="flex h-full overflow-hidden">
            {/* Left Sidebar - Channels */}
            <div
              className="flex-shrink-0 w-[240px] flex flex-col relative overflow-hidden bg-[#2b3642]/30"
              style={{ borderRight: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              {/* Circle Header */}
              <div className="px-4 pt-5 pb-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
                    title="Close circle"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-lg">{selectedCircle.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm font-semibold text-white truncate leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.name}
                      </h2>
                      <p
                        className="text-xs text-[#9BB6CC99] leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.onlineCount} online
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
                    title="Circle settings"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Channels List */}
              <ScrollArea className="flex-1 overflow-hidden">
                <div className="px-2 pb-4">
                  {channelCategories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <button
                        onClick={() => handleCategoryToggle(category.id)}
                        className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#9BB6CC] hover:text-white transition-colors uppercase tracking-wide"
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            category.isCollapsed && "-rotate-90"
                          )}
                        />
                      </button>
                      {!category.isCollapsed && (
                        <div className="mt-1 space-y-0.5">
                          {category.channels.map((channel) => (
                            <button
                              key={channel.id}
                              onClick={() => handleChannelSelect(channel.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all",
                                activeChannelId === channel.id
                                  ? "bg-[#5865F2]/20 text-white"
                                  : "text-[#9BB6CC] hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {channel.type === "text" ? (
                                <Hash className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <Volume2 className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="flex-1 truncate text-left">
                                {channel.name}
                              </span>
                              {channel.isPrivate && (
                                <Lock className="h-3 w-3 flex-shrink-0" />
                              )}
                              {channel.unreadCount && channel.unreadCount > 0 && (
                                <Badge className="h-4 min-w-4 px-1 text-xs bg-[#ED4245] text-white">
                                  {channel.unreadCount}
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
              {/* Chat Header */}
              <div className="flex-shrink-0 px-4 pt-6 pb-4 bg-[#0000004A] border-b border-[#FFFFFF14]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {activeChannel?.type === "text" ? (
                      <Hash className="h-5 w-5 text-[#9BB6CC]" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-[#9BB6CC]" />
                    )}
                    <h3 className="font-semibold text-white text-base">
                      {activeChannel?.name}
                    </h3>
                    {activeChannel?.isPrivate && (
                      <Lock className="h-4 w-4 text-[#9BB6CC]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative hidden lg:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        placeholder="Search in channel"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 h-9 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-sm placeholder:text-[#9BB6CC99] focus:ring-0 border-0"
                        style={{ fontFamily: "'Geist'" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-4 py-6"
                style={{
                  background:
                    "radial-gradient(circle at top, rgba(61,80,120,0.25), transparent 45%), #05080d",
                }}
              >
                <div className="space-y-3 max-w-4xl">
                  {messages.map((message, index) => {
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1]?.authorId !== message.authorId;
                    const isGrouped =
                      !showAvatar &&
                      message.type !== "system" &&
                      messages[index - 1]?.type !== "system";

                    return (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        showAvatar={showAvatar}
                        isGrouped={isGrouped}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-[#2b3642]/50 bg-[#0000004A]">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder={`Message #${activeChannel?.name || "channel"}`}
                />
              </div>
            </div>

            {/* Right Sidebar - Members */}
            <div
              className="flex-shrink-0 w-[240px] flex flex-col relative overflow-hidden bg-[#2b3642]/30 hidden xl:flex"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              {/* Members Header */}
              <div className="px-4 pt-5 pb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-xs font-semibold text-[#9BB6CC] uppercase tracking-wide"
                    style={{ fontFamily: "'Geist'" }}
                  >
                    Members — {selectedCircle.memberCount}
                  </h3>
                </div>
              </div>

              {/* Members List */}
              <ScrollArea className="flex-1 overflow-hidden">
                <div className="px-2 pb-4 space-y-1">
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-[#2b3642] text-white text-xs">
                            {member.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2b3642]",
                            member.status === "online"
                              ? "bg-[#3ba55d]"
                              : member.status === "idle"
                              ? "bg-[#faa81a]"
                              : "bg-[#747f8d]"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {member.name}
                        </p>
                        {member.role && (
                          <p className="text-xs text-[#9BB6CC] truncate">
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          // No circle selected - show placeholder
          <div className="flex items-center justify-center h-full bg-[#0000004A]">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-16 w-16 text-[#9BB6CC]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Select a Circle
              </h3>
              <p className="text-[#9BB6CC] text-sm">
                Choose a circle to start chatting with your community
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

