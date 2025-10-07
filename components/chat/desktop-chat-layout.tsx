"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Hash,
  Volume2,
  Settings,
  Users,
  Search,
  Bell,
  Pin,
  AtSign,
  HelpCircle,
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
    <div className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer group">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-xs">
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {member.name}
          </span>
          {member.role && (
            <Badge variant="secondary" className="text-xs">
              {member.role}
            </Badge>
          )}
        </div>
        {member.activity && (
          <p className="text-xs text-muted-foreground truncate">
            {member.activity}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Channels */}
      <div className="w-60 lg:w-64 xl:w-72 flex flex-col bg-card border-r border-border">
        {/* Circle Header */}
        <div className="p-3 lg:p-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base lg:text-lg">{circle.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-sm lg:text-base truncate">
                {circle.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {circle.memberCount.toLocaleString()} members
              </p>
            </div>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-muted/80">
              <Settings className="h-4 w-4" />
            </Button>
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-12 lg:h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {activeChannel && (
              <>
                {activeChannel.type === "text" ? (
                  <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <Volume2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className="font-semibold text-sm lg:text-base truncate">
                  {activeChannel.name}
                </span>
                {activeChannel.isPrivate && (
                  <Badge
                    variant="secondary"
                    className="text-xs h-5 px-2 flex-shrink-0"
                  >
                    Private
                  </Badge>
                )}
                <Separator
                  orientation="vertical"
                  className="h-6 flex-shrink-0"
                />
                <p className="text-sm text-muted-foreground flex-shrink-0">
                  {circle.onlineCount} online
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="hover:bg-muted/80">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80">
              <AtSign className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMemberList(!showMemberList)}
              className={cn(
                "hover:bg-muted/80 transition-colors",
                showMemberList && "bg-muted text-foreground"
              )}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 bg-background">
          <div className="pb-4 min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center text-muted-foreground">
                  <div className="text-6xl mb-6">💬</div>
                  <div className="text-lg font-medium mb-2">
                    Welcome to #{activeChannel?.name}
                  </div>
                  <div className="text-sm">
                    This is the beginning of your conversation.
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
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
                  <ChatMessageComponent
                    key={message.id}
                    message={message}
                    showAvatar={true}
                    isGrouped={isGrouped}
                  />
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border bg-background">
          <ChatInput
            onSendMessage={onSendMessage}
            placeholder={`Message #${activeChannel?.name || "channel"}`}
            className="border-0"
          />
        </div>
      </div>

      {/* Right Sidebar - Members */}
      {showMemberList && (
        <div className="w-60 lg:w-64 xl:w-72 bg-card border-l border-border flex flex-col">
          <div className="p-3 lg:p-4 border-b border-border bg-card/50">
            <h3 className="font-semibold text-sm lg:text-base">
              Members — {members.length}
            </h3>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 lg:p-3 space-y-4">
              {/* Online Members */}
              {onlineMembers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Online — {onlineMembers.length}
                  </h4>
                  <div className="space-y-1">
                    {onlineMembers.map((member) => (
                      <MemberItem key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Members */}
              {offlineMembers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Offline — {offlineMembers.length}
                  </h4>
                  <div className="space-y-1">
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
