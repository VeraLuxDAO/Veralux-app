"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hash,
  Volume2,
  Users,
  Search,
  MessageSquare,
  Home,
  ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ChatMessageComponent,
  type ChatMessage,
} from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import {
  ChannelSidebar,
  type ChannelCategory,
} from "@/components/chat/channel-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Sparkles, Zap } from "lucide-react";

export interface Circle {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
  unreadCount?: number;
  hasNotifications?: boolean;
}
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy" | "offline";
  activity?: string;
  role?: string;
}

interface DesktopChatLayoutProps {
  circles: Circle[];
  activeCircle: Circle;
  messages: ChatMessage[];
  channelCategories: ChannelCategory[];
  activeChannelId: string;
  members: Member[];
  onSendMessage: (content: string) => void;
  onChannelSelect: (channelId: string) => void;
  onCategoryToggle: (categoryId: string) => void;
  onCircleSelect: (circleId: string) => void;
  onNavigateHome: () => void;
}

const mockMembers: Member[] = [
  {
    id: "vitalik",
    name: "Vitalik Buterin",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    activity: "Building Ethereum",
    role: "Founder",
  },
  {
    id: "sarah",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    status: "online",
    activity: "Researching DeFi",
    role: "Moderator",
  },
  {
    id: "mike",
    name: "Mike Chen",
    avatar: "/developer-avatar.png",
    status: "away",
    activity: "In a meeting",
    role: "Developer",
  },
  {
    id: "alice",
    name: "Alice Johnson",
    status: "busy",
    activity: "Do not disturb",
  },
  {
    id: "bob",
    name: "Bob Wilson",
    status: "offline",
  },
];

export function DesktopChatLayout({
  circles,
  activeCircle,
  messages,
  channelCategories,
  activeChannelId,
  members = mockMembers,
  onSendMessage,
  onChannelSelect,
  onCategoryToggle,
  onCircleSelect,
  onNavigateHome,
}: DesktopChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMemberList, setShowMemberList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeChannel = channelCategories
    .flatMap((cat) => cat.channels)
    .find((ch) => ch.id === activeChannelId);

  const onlineMembers = members.filter((m) => m.status === "online");
  const offlineMembers = members.filter((m) => m.status !== "online");

  const StatusIndicator = ({ status }: { status: Member["status"] }) => {
    const colors = {
      online: "bg-green-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
      offline: "bg-gray-400",
    };

    return (
      <div
        className={cn(
          "w-3 h-3 rounded-full border-2 border-background",
          colors[status]
        )}
      />
    );
  };

  const MemberItem = ({ member }: { member: Member }) => (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70 cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-slate-900/5 dark:hover:shadow-black/10 hover:translate-x-1">
      <div className="relative">
        <Avatar className="w-9 h-9 ring-2 ring-white dark:ring-slate-900 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:ring-violet-200 dark:group-hover:ring-violet-800">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white group-hover:from-violet-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 transition-all duration-300 group-hover:scale-110">
          <StatusIndicator status={member.status} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all duration-300">
            {member.name}
          </span>
          {member.role && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-lg font-bold shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105",
                member.role === "Founder" &&
                  "bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 text-amber-700 dark:text-amber-300 border-amber-400/40 shadow-amber-400/10 group-hover:from-amber-400/30 group-hover:via-orange-400/30 group-hover:to-red-400/30",
                member.role === "Moderator" &&
                  "bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 text-blue-700 dark:text-blue-300 border-blue-400/40 shadow-blue-400/10 group-hover:from-blue-400/30 group-hover:via-indigo-400/30 group-hover:to-purple-400/30",
                member.role === "Developer" &&
                  "bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 shadow-emerald-400/10 group-hover:from-emerald-400/30 group-hover:via-teal-400/30 group-hover:to-cyan-400/30"
              )}
            >
              {member.role}
            </Badge>
          )}
        </div>
        {member.activity && (
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all duration-300 font-medium">
            {member.activity}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 desktop-chat-container">
      {/* Left Sidebar - Channels */}
      <div className="w-64 lg:w-72 xl:w-80 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        {/* Clean Circle Header */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Left: Home Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {/* Center: Circle Switcher */}
              <div className="flex-1 min-w-0 max-w-[180px] lg:max-w-[220px] xl:max-w-[280px]">
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-2 px-2 py-2 h-auto rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 justify-start bg-transparent border-0 cursor-pointer">
                      {/* Circle Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-sm">{activeCircle.icon}</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></div>
                      </div>

                      {/* Circle Info */}
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <div className="flex items-center gap-1 w-full">
                          <span className="font-medium text-sm text-slate-900 dark:text-white truncate">
                            {activeCircle.name}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-3 w-3 text-slate-500 flex-shrink-0 ml-auto transition-transform duration-200",
                              isDropdownOpen && "rotate-180"
                            )}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <span>
                            {activeCircle.memberCount.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {activeCircle.onlineCount} online
                          </span>
                        </div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-72 lg:w-80 xl:w-96 p-3 lg:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl lg:rounded-2xl"
                    sideOffset={8}
                    avoidCollisions={true}
                    collisionPadding={16}
                  >
                    <div className="px-3 py-2 mb-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        Switch Circle
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Choose your community space
                      </p>
                    </div>

                    <DropdownMenuSeparator className="bg-slate-200/60 dark:bg-slate-700/60" />

                    {circles.map((circle) => {
                      const isActive = circle.id === activeCircle.id;
                      return (
                        <DropdownMenuItem
                          key={circle.id}
                          onClick={() => onCircleSelect(circle.id)}
                          className={cn(
                            "flex items-center gap-3 lg:gap-4 p-3 lg:p-4 m-1 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] lg:hover:scale-[1.02]",
                            isActive
                              ? "bg-gradient-to-r from-violet-100/80 via-blue-100/60 to-cyan-100/80 dark:from-violet-900/40 dark:via-blue-900/30 dark:to-cyan-900/40 border border-violet-200/60 dark:border-violet-700/60"
                              : "hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                          )}
                        >
                          <div className="relative">
                            <div
                              className={cn(
                                "w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
                                isActive
                                  ? "bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 shadow-blue-500/25"
                                  : "bg-gradient-to-br from-slate-400 to-slate-600 hover:from-violet-400 hover:to-blue-500 shadow-slate-500/20"
                              )}
                            >
                              <span className="text-base lg:text-lg filter drop-shadow-sm">
                                {circle.icon}
                              </span>
                            </div>

                            {/* Notification indicators */}
                            {circle.unreadCount != null &&
                              circle.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-xs text-white font-bold px-1">
                                    {circle.unreadCount > 99
                                      ? "99+"
                                      : circle.unreadCount}
                                  </span>
                                </div>
                              )}

                            {circle.hasNotifications &&
                              (!circle.unreadCount ||
                                circle.unreadCount === 0) && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse" />
                              )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 lg:gap-2 mb-1">
                              <h3 className="font-bold text-sm lg:text-base text-slate-900 dark:text-white truncate">
                                {circle.name}
                              </h3>
                              {isActive && (
                                <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                                  <Zap className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-violet-600 dark:text-violet-400" />
                                  <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                                    Active
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3 text-xs text-slate-600 dark:text-slate-400">
                              <span className="font-medium">
                                {circle.memberCount.toLocaleString()} members
                              </span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {circle.onlineCount} online
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right: Theme Toggle */}
              <ThemeToggle
                size="sm"
                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Channels */}
        <ChannelSidebar
          categories={channelCategories}
          activeChannelId={activeChannelId}
          onChannelSelect={onChannelSelect}
          onCategoryToggle={onCategoryToggle}
          className="border-0"
        />
      </div>

      {/* Main Chat Area - Ultra Modern */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Ultra Modern Chat Header */}
        <div className="h-16 lg:h-18 flex items-center justify-between px-4 lg:px-6 xl:px-8 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {activeChannel && (
              <>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {activeChannel.type === "text" ? (
                      <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
                        <Hash className="h-5 w-5 text-white filter drop-shadow-sm" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                        <Volume2 className="h-5 w-5 text-white filter drop-shadow-sm" />
                      </div>
                    )}
                    {activeChannel.unreadCount &&
                      activeChannel.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <span className="text-xs text-white font-bold">
                            {activeChannel.unreadCount}
                          </span>
                        </div>
                      )}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl truncate bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                      #{activeChannel.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {activeChannel.isPrivate && (
                        <Badge
                          variant="outline"
                          className="text-xs h-5 px-2 border-amber-400/60 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 rounded-lg font-medium"
                        >
                          🔒 Private
                        </Badge>
                      )}
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="font-medium">
                        {activeCircle.onlineCount} active now
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* Ultra Modern Search Input */}
            <div className="search-input-container relative w-48 lg:w-64 xl:w-72">
              <Search className="search-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder={`Search in #${
                  activeChannel?.name || "channel"
                }...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 text-sm bg-slate-100/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-400/20 dark:focus:ring-violet-500/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 focus:bg-white dark:focus:bg-slate-800 shadow-sm focus:shadow-lg focus:shadow-violet-500/10"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMemberList(!showMemberList)}
              className={cn(
                "h-10 w-10 p-0 rounded-xl transition-all duration-300 hover:scale-105",
                showMemberList
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                  : "hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Ultra Modern Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden desktop-messages-area relative bg-gradient-to-b from-slate-50/30 via-white/50 to-slate-50/30 dark:from-slate-950/30 dark:via-slate-900/50 dark:to-slate-950/30">
          {/* Premium gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/80 dark:from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent z-10 pointer-events-none"></div>

          <ScrollArea className="flex-1 h-full">
            <div className="flex flex-col justify-end min-h-full p-6 lg:p-8 scroll-area-content">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center flex-1 p-12">
                  <Card className="max-w-lg mx-auto bg-gradient-to-br from-white/80 via-slate-50/60 to-white/80 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
                    <CardContent className="p-10 text-center">
                      <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/25">
                        <MessageSquare className="h-10 w-10 text-white filter drop-shadow-sm" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Welcome to #{activeChannel?.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                        This is the beginning of your conversation in this
                        channel. Share your thoughts and connect with the
                        community!
                      </p>
                      <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                        <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-pulse"></div>
                        <Zap className="h-5 w-5 text-violet-500" />
                        <span className="font-medium">
                          Start the conversation!
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 lg:space-y-3">
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const isGrouped =
                      prevMessage &&
                      prevMessage.authorId === message.authorId &&
                      prevMessage.type !== "system" &&
                      message.type !== "system" &&
                      message.timestamp.getTime() -
                        prevMessage.timestamp.getTime() <
                        300000;

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

        {/* Ultra Modern Chat Input */}
        <div className="border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-900/80 backdrop-blur-2xl flex-shrink-0 shadow-lg shadow-slate-900/5 dark:shadow-black/10">
          <div className="p-6 lg:p-8">
            <ChatInput
              onSendMessage={onSendMessage}
              placeholder={`Share your thoughts in #${
                activeChannel?.name || "channel"
              }...`}
              className="border-0 bg-slate-100/60 dark:bg-slate-800/60 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/10 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
              forceDesktop={true}
            />
          </div>
        </div>
      </div>

      {/* Ultra Modern Right Sidebar - Members */}
      {showMemberList && (
        <div className="w-64 lg:w-72 xl:w-80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-l border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
          <div className="relative overflow-hidden">
            {/* Background with improved gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/40"></div>
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"></div>

            <div className="relative p-4 lg:p-5 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                    <Users className="h-4 w-4 text-white filter drop-shadow-sm" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base lg:text-lg text-slate-900 dark:text-white leading-tight">
                    Members
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {members.length} total
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100/60 dark:bg-emerald-900/30 rounded-lg backdrop-blur-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {onlineMembers.length} online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 lg:p-4 space-y-6">
              {/* Online Members */}
              {onlineMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 px-3">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Online — {onlineMembers.length}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {onlineMembers.map((member) => (
                      <MemberItem key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Members */}
              {offlineMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 px-3">
                    <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full shadow-sm"></div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Offline — {offlineMembers.length}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {offlineMembers.map((member) => (
                      <MemberItem key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
