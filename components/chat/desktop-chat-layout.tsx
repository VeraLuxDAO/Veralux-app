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
  Sparkles,
  MessageSquare,
  Zap,
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
import { cn } from "@/lib/utils";

interface Circle {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy" | "offline";
  activity?: string;
  role?: string;
}

interface DesktopChatLayoutProps {
  circle: Circle;
  messages: ChatMessage[];
  channelCategories: ChannelCategory[];
  activeChannelId: string;
  members: Member[];
  onSendMessage: (content: string) => void;
  onChannelSelect: (channelId: string) => void;
  onCategoryToggle: (categoryId: string) => void;
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
  circle,
  messages,
  channelCategories,
  activeChannelId,
  members = mockMembers,
  onSendMessage,
  onChannelSelect,
  onCategoryToggle,
}: DesktopChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMemberList, setShowMemberList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/10">
      <div className="relative">
        <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-slate-900 shadow-lg">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusIndicator status={member.status} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {member.name}
          </span>
          {member.role && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-1 rounded-xl font-bold shadow-sm",
                member.role === "Founder" &&
                  "bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 text-amber-700 dark:text-amber-300 border-amber-400/40 shadow-amber-400/10",
                member.role === "Moderator" &&
                  "bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 text-blue-700 dark:text-blue-300 border-blue-400/40 shadow-blue-400/10",
                member.role === "Developer" &&
                  "bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 shadow-emerald-400/10"
              )}
            >
              {member.role}
            </Badge>
          )}
        </div>
        {member.activity && (
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors font-medium">
            {member.activity}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 overflow-hidden desktop-chat-container">
      {/* Left Sidebar - Channels */}
      <div className="w-60 lg:w-64 xl:w-72 flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
        {/* Circle Header - Ultra Modern */}
        <div className="p-5 lg:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-violet-50/50 via-blue-50/30 to-cyan-50/50 dark:from-violet-950/30 dark:via-blue-950/20 dark:to-cyan-950/30">
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="relative group">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-xl lg:text-2xl filter drop-shadow-sm">
                  {circle.icon}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg animate-pulse"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg lg:text-xl truncate bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                {circle.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {circle.memberCount.toLocaleString()} members
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {circle.onlineCount} online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle
                size="sm"
                className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
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
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 lg:px-8 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl flex-shrink-0 shadow-sm">
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
                        {circle.onlineCount} active now
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* Ultra Modern Search Input */}
            <div className="search-input-container relative w-64 lg:w-80">
              <Search className="search-icon absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder={`Search in #${
                  activeChannel?.name || "channel"
                }...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-11 text-sm bg-slate-100/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-400/20 dark:focus:ring-violet-500/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 shadow-sm focus:shadow-lg focus:shadow-violet-500/10"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMemberList(!showMemberList)}
              className={cn(
                "h-11 w-11 p-0 rounded-2xl transition-all duration-300 hover:scale-105",
                showMemberList
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
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
        <div className="w-60 lg:w-64 xl:w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-l border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
          <div className="p-5 lg:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Users className="h-5 w-5 text-white filter drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Members
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {members.length} total • {onlineMembers.length} online
                </p>
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
