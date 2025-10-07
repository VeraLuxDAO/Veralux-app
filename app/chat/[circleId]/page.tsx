"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu, Users, Settings, Hash, Volume2 } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const circle = mockCircles[circleId as keyof typeof mockCircles];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      authorId: "current-user",
      authorName: "You",
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
      {/* Desktop Layout */}
      <div className="hidden md:block">
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

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-background overflow-hidden">
        {/* Mobile Header */}
        <div className="chat-header-mobile flex items-center justify-between px-3 py-2 border-b border-border bg-card/95 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0 chat-compact-spacing">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="chat-header-button chat-touch-target p-2 hover:bg-muted/80 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="flex items-center gap-2 flex-1 min-w-0 chat-compact-spacing">
              <div className="chat-header-icon w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm">{circle.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="chat-header-title font-semibold text-sm truncate">
                  {circle.name}
                </h1>
                <div className="chat-header-subtitle flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{circle.memberCount.toLocaleString()}</span>
                  <span>•</span>
                  <span>{circle.onlineCount} online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 chat-compact-spacing">
            <Sheet
              open={isChannelSidebarOpen}
              onOpenChange={setIsChannelSidebarOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="chat-header-button chat-touch-target p-2 hover:bg-muted/80 rounded-lg"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 max-w-[85vw]">
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

            <Button
              variant="ghost"
              size="sm"
              className="chat-header-button chat-touch-target p-2 hover:bg-muted/80 rounded-lg"
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Current Channel Info */}
        {activeChannel && (
          <div className="chat-channel-info px-3 sm:px-4 py-2 border-b border-border bg-muted/20 flex-shrink-0">
            <div className="flex items-center gap-2 chat-compact-spacing">
              {activeChannel.type === "text" ? (
                <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="font-medium text-xs sm:text-sm truncate">
                #{activeChannel.name}
              </span>
              {activeChannel.isPrivate && (
                <Badge
                  variant="secondary"
                  className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 flex-shrink-0"
                >
                  Private
                </Badge>
              )}
              {activeChannel.unreadCount && activeChannel.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs h-4 sm:h-5 px-1.5 sm:px-2 flex-shrink-0">
                  {activeChannel.unreadCount} new
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
          <ScrollArea className="flex-1 h-full">
            <div className="flex flex-col justify-end min-h-full px-1 sm:px-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center flex-1 p-6 sm:p-8">
                  <div className="text-center text-muted-foreground">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                    <div className="text-sm sm:text-base font-medium">
                      Welcome to #{activeChannel?.name}
                    </div>
                    <div className="text-xs sm:text-sm mt-1 opacity-75">
                      This is the beginning of your conversation.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col py-2 sm:py-4 space-y-1 sm:space-y-2">
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
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        showAvatar={!message.isOwn}
                        isGrouped={isGrouped}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 bg-background border-t border-border/50">
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={`Message #${activeChannel?.name || "channel"}`}
            className="chat-input-container"
          />
        </div>
      </div>
    </>
  );
}
