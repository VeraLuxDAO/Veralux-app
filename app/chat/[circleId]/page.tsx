"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Menu,
  Users,
  Hash,
  Volume2,
  Search,
  Home,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react";
import {
  ChatMessageComponent,
  type ChatMessage,
} from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import {
  ChannelSidebar,
  type ChannelCategory,
} from "@/components/chat/channel-sidebar";
import { DesktopChatLayout } from "@/components/chat/desktop-chat-layout";
import { cn } from "@/lib/utils";

// Mock data
const mockCircles = {
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
        isActive: true,
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
      {
        id: "dev-hangout",
        name: "Dev Hangout",
        type: "voice",
        isPrivate: false,
      },
      {
        id: "trading-room",
        name: "Trading Room",
        type: "voice",
        isPrivate: true,
      },
    ],
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
    content:
      "That's amazing! What kind of gas savings are you seeing compared to V3?",
    authorId: "sarah",
    authorName: "Sarah Miller",
    authorAvatar: "/diverse-female-avatar.png",
    timestamp: new Date(Date.now() - 3500000),
    type: "text",
    isOwn: false,
    replyTo: {
      id: "2",
      authorName: "Vitalik Buterin",
      content:
        "Hey everyone! Just deployed a new liquidity pool on Uniswap V4...",
    },
  },
  {
    id: "4",
    content:
      "Around 40% reduction in gas costs for complex swaps. The hook system is a game changer!",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3400000),
    type: "text",
    isOwn: false,
  },
  {
    id: "5",
    content:
      "This is exactly what we need for mainstream adoption. Lower fees = more users 💪",
    authorId: "current-user",
    authorName: "You",
    authorAvatar: "/user-profile-illustration.png",
    timestamp: new Date(Date.now() - 1800000),
    type: "text",
    isOwn: true,
  },
];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const circleId = params.circleId as string;
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [channelCategories, setChannelCategories] = useState(
    mockChannelCategories
  );
  const [isChannelSidebarOpen, setIsChannelSidebarOpen] = useState(false);
  const [isMemberSidebarOpen, setIsMemberSidebarOpen] = useState(false);
  const [isTopNavVisible, setIsTopNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCirclesDropdownOpen, setIsCirclesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const circle = mockCircles[circleId as keyof typeof mockCircles];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll behavior for top nav visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide top nav
        setIsTopNavVisible(false);
      } else {
        // Scrolling up or at top - show top nav
        setIsTopNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      authorId: "current-user",
      authorName: "You",
      authorAvatar: "/user-profile-illustration.png",
      timestamp: new Date(),
      type: "text",
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
    setIsChannelSidebarOpen(false);
    // In a real app, you would load messages for the selected channel
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

  if (!circle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Circle not found</h1>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Layout - Optimized for larger screens */}
      <div className="hidden min-[1200px]:block">
        <DesktopChatLayout
          circle={circle}
          messages={messages}
          channelCategories={channelCategories}
          activeChannelId={activeChannelId}
          members={[]}
          onSendMessage={handleSendMessage}
          onChannelSelect={handleChannelSelect}
          onCategoryToggle={handleCategoryToggle}
        />
      </div>

      {/* Mobile & Tablet Layout - Ultra Modern (up to 1199px) */}
      <div className="min-[1200px]:hidden flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 overflow-hidden">
        {/* Ultra Modern Two-Row Header Design */}
        <div className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-700/60 flex-shrink-0 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
          {/* Ultra Modern Top Navigation Bar */}
          <div
            className={cn(
              "flex items-center justify-between px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border-b border-slate-200/40 dark:border-slate-700/40 transition-all duration-300 bg-gradient-to-r from-violet-50/30 via-blue-50/20 to-cyan-50/30 dark:from-violet-950/20 dark:via-blue-950/15 dark:to-cyan-950/20",
              isTopNavVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0 absolute"
            )}
          >
            {/* Left: Back to Home - Ultra Compact */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-1 xs:px-1.5 sm:px-2 py-1.5 xs:py-2 rounded-xl xs:rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs xs:text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-lg xs:shadow-xl shadow-indigo-500/25 xs:shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300">
                <Home className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-white filter drop-shadow-sm" />
              </div>
              <span className="hidden xs:inline font-bold text-slate-900 dark:text-white text-xs">
                Home
              </span>
            </Button>

            {/* Center: Circle Info with Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
              <DropdownMenu
                open={isCirclesDropdownOpen}
                onOpenChange={setIsCirclesDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="circles-dropdown-trigger flex items-center gap-1.5 xs:gap-2 px-2 xs:px-2.5 sm:px-3 py-2 xs:py-2.5 bg-gradient-to-r from-white/70 via-slate-50/50 to-white/70 dark:from-slate-800/70 dark:via-slate-700/50 dark:to-slate-800/70 rounded-xl xs:rounded-2xl hover:bg-gradient-to-r hover:from-white/90 hover:via-slate-50/70 hover:to-white/90 dark:hover:from-slate-700/90 dark:hover:via-slate-600/70 dark:hover:to-slate-700/90 transition-all duration-300 hover:scale-[1.02] shadow-lg xs:shadow-xl shadow-slate-900/8 xs:shadow-slate-900/10 dark:shadow-black/15 xs:dark:shadow-black/20 backdrop-blur-sm border border-white/50 dark:border-slate-600/50"
                  >
                    <div className="relative group">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-xl xs:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg xs:shadow-xl shadow-blue-500/25 xs:shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                        <span className="text-sm xs:text-base sm:text-lg font-bold filter drop-shadow-sm">
                          {circle.icon}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 xs:-bottom-1 -right-0.5 xs:-right-1 w-3 h-3 xs:w-3.5 xs:h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md xs:shadow-lg animate-pulse"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs xs:text-sm font-bold truncate bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        {circle.name}
                      </span>
                      <div className="flex items-center gap-1 xs:gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-xs">
                          {circle.memberCount.toLocaleString()}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 hidden xs:inline">
                          •
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs hidden xs:inline">
                          {circle.onlineCount} online
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="chevron-down h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64">
                  {Object.entries(mockCircles).map(([key, circleData]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => {
                        if (key !== circleId) {
                          router.push(`/chat/${key}`);
                        }
                        setIsCirclesDropdownOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer",
                        key === circleId && "bg-muted/50"
                      )}
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{circleData.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold truncate">
                          {circleData.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{circleData.memberCount.toLocaleString()}</span>
                          <span>•</span>
                          <span>{circleData.onlineCount} online</span>
                        </div>
                      </div>
                      {key === circleId && (
                        <div className="active-circle-indicator w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: Ultra Compact Controls */}
            <div className="flex items-center gap-1 xs:gap-1.5">
              <ThemeToggle
                size="sm"
                className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl xs:rounded-2xl transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Ultra Modern Second Row: Navigation */}
          <div className="flex items-center justify-between px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-slate-50/50 via-white/30 to-slate-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50">
            {/* Left: Channels */}
            <Sheet
              open={isChannelSidebarOpen}
              onOpenChange={setIsChannelSidebarOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-2.5 sm:px-3 py-2 xs:py-2.5 rounded-xl xs:rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs xs:text-sm font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-sm"
                >
                  <div className="w-7 h-7 xs:w-8 xs:h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg xs:rounded-xl flex items-center justify-center shadow-md xs:shadow-lg shadow-indigo-500/20 xs:shadow-indigo-500/25">
                    <Hash className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-white filter drop-shadow-sm" />
                  </div>
                  <span className="hidden xs:inline text-slate-900 dark:text-white text-xs xs:text-sm">
                    Channels
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-80 md:w-96 max-w-[85vw]"
              >
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">{circle.icon}</span>
                    </div>
                    <h2 className="font-semibold text-sm">{circle.name}</h2>
                  </div>
                </div>
                <ChannelSidebar
                  categories={channelCategories}
                  activeChannelId={activeChannelId}
                  onChannelSelect={handleChannelSelect}
                  onCategoryToggle={handleCategoryToggle}
                />
              </SheetContent>
            </Sheet>

            {/* Center: Ultra Compact Search */}
            <div className="flex-1 max-w-xs xs:max-w-sm sm:max-w-md mx-1 xs:mx-2 sm:mx-3">
              <div className="chat-header-search relative">
                <Search className="search-icon absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 xs:pl-10 pr-3 xs:pr-4 h-8 xs:h-9 sm:h-10 text-xs xs:text-sm bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-400/20 dark:focus:ring-violet-500/20 rounded-xl xs:rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 shadow-sm focus:shadow-lg focus:shadow-violet-500/10 font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400 mobile-search-input"
                />
              </div>
            </div>

            {/* Right: Modern Members Button */}
            <Sheet
              open={isMemberSidebarOpen}
              onOpenChange={setIsMemberSidebarOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-2.5 sm:px-3 py-2 xs:py-2.5 rounded-xl xs:rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs xs:text-sm font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-sm"
                >
                  <div className="w-7 h-7 xs:w-8 xs:h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg xs:rounded-xl flex items-center justify-center shadow-md xs:shadow-lg shadow-emerald-500/20 xs:shadow-emerald-500/25">
                    <Users className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-white filter drop-shadow-sm" />
                  </div>
                  <span className="hidden xs:inline text-slate-900 dark:text-white text-xs xs:text-sm">
                    Members
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 w-80 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border-l border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Users className="h-5 w-5 text-white filter drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Members
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {circle.memberCount} total • {circle.onlineCount} online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    Members panel content goes here...
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Current Channel Info - Ultra Compact */}
        {activeChannel && (
          <div className="chat-channel-info px-2 xs:px-3 md:px-4 py-1.5 xs:py-2 md:py-2.5 border-b border-border bg-muted/20 flex-shrink-0">
            <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3 chat-compact-spacing">
              {activeChannel.type === "text" ? (
                <Hash className="h-3 w-3 xs:h-3.5 xs:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <Volume2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="font-medium text-xs xs:text-sm md:text-sm truncate">
                #{activeChannel.name}
              </span>
              {activeChannel.isPrivate && (
                <Badge
                  variant="secondary"
                  className="text-xs h-3.5 xs:h-4 md:h-5 px-1 xs:px-1.5 md:px-2 flex-shrink-0"
                >
                  Private
                </Badge>
              )}
              {activeChannel.unreadCount && activeChannel.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs h-3.5 xs:h-4 md:h-5 px-1 xs:px-1.5 md:px-2 flex-shrink-0">
                  {activeChannel.unreadCount} new
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Ultra Modern Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gradient-to-b from-slate-50/30 via-white/50 to-slate-50/30 dark:from-slate-950/30 dark:via-slate-900/50 dark:to-slate-950/30 relative">
          {/* Premium gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none"></div>

          <ScrollArea className="flex-1 h-full">
            <div className="flex flex-col justify-end min-h-full px-3 md:px-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center flex-1 p-6 md:p-8">
                  <Card className="max-w-md mx-auto bg-gradient-to-br from-white/90 via-slate-50/70 to-white/90 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-900/90 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/10 dark:shadow-black/20">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/25">
                        <MessageSquare className="h-8 w-8 text-white filter drop-shadow-sm" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Welcome to #{activeChannel?.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        This is the beginning of your conversation. Share your
                        thoughts and connect!
                      </p>
                      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-pulse"></div>
                        <Zap className="h-4 w-4 text-violet-500" />
                        <span className="font-medium">Start chatting!</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col py-3 md:py-4 space-y-2 md:space-y-3">
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const isGrouped =
                      prevMessage &&
                      prevMessage.authorId === message.authorId &&
                      prevMessage.type !== "system" &&
                      message.type !== "system" &&
                      message.timestamp.getTime() -
                        prevMessage.timestamp.getTime() <
                        300000; // 5 minutes

                    return (
                      <div
                        key={message.id}
                        className="transform transition-all duration-200 hover:scale-[1.01]"
                      >
                        <ChatMessageComponent
                          message={message}
                          showAvatar={true}
                          isGrouped={isGrouped || false}
                        />
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Ultra Compact Chat Input */}
        <div className="flex-shrink-0 bg-gradient-to-r from-white/90 via-slate-50/70 to-white/90 dark:from-slate-900/90 dark:via-slate-800/70 dark:to-slate-900/90 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-black/10">
          <div className="p-2 xs:p-3 sm:p-4 md:p-6">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder={`Share your thoughts in #${
                activeChannel?.name || "channel"
              }...`}
              className="chat-input-container bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl xs:rounded-3xl shadow-lg xs:shadow-xl shadow-slate-900/5 dark:shadow-black/10 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
            />
          </div>
        </div>
      </div>
    </>
  );
}
