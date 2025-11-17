"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bell,
  Heart,
  UserPlus,
  AtSign,
  AlertCircle,
  CheckSquare,
  Users,
  Gamepad2,
  Trophy,
  Megaphone,
  Tag,
  Clock,
  Check,
  X as XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NavigationLayout } from "@/components/navigation-layout";

interface Notification {
  id: string;
  type:
    | "like"
    | "follow"
    | "mention"
    | "action_required"
    | "task"
    | "post"
    | "gaming"
    | "reputation"
    | "system"
    | "promotional";
  category: "personal" | "social" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  metadata?: {
    userName?: string;
    postId?: string;
    gameId?: string;
    reputationPoints?: number;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    category: "personal",
    title: "New Like",
    message: "Vitalik Buterin liked your post about zkLogin",
    timestamp: new Date(Date.now() - 5 * 60000),
    isRead: false,
    avatar: "/diverse-user-avatars.png",
    actionUrl: "/post/123",
    metadata: { userName: "Vitalik Buterin", postId: "123" },
  },
  {
    id: "2",
    type: "follow",
    category: "personal",
    title: "New Follower",
    message: "Sarah Miller started following you",
    timestamp: new Date(Date.now() - 30 * 60000),
    isRead: false,
    avatar: "/diverse-female-avatar.png",
    actionUrl: "/profile/sarah-miller",
    metadata: { userName: "Sarah Miller" },
  },
  {
    id: "3",
    type: "mention",
    category: "personal",
    title: "Mention",
    message: "Mike Chen mentioned you in a comment",
    timestamp: new Date(Date.now() - 2 * 3600000),
    isRead: false,
    avatar: "/developer-avatar.png",
    actionUrl: "/post/456",
    metadata: { userName: "Mike Chen" },
  },
  {
    id: "4",
    type: "action_required",
    category: "personal",
    title: "Action Required",
    message: "Verify your wallet address to unlock premium features",
    timestamp: new Date(Date.now() - 4 * 3600000),
    isRead: false,
    actionUrl: "/settings/wallet",
  },
  {
    id: "5",
    type: "task",
    category: "personal",
    title: "New Task",
    message: "You have a new task: Complete your profile verification",
    timestamp: new Date(Date.now() - 6 * 3600000),
    isRead: true,
    actionUrl: "/tasks",
  },
  {
    id: "6",
    type: "post",
    category: "social",
    title: "New Post",
    message: "Vitalik Buterin shared a new post: 'The future of zkRollups'",
    timestamp: new Date(Date.now() - 12 * 3600000),
    isRead: false,
    avatar: "/diverse-user-avatars.png",
    actionUrl: "/post/789",
    metadata: { userName: "Vitalik Buterin" },
  },
  {
    id: "7",
    type: "gaming",
    category: "social",
    title: "Gaming Update",
    message: "New achievement unlocked in Blockchain Poker",
    timestamp: new Date(Date.now() - 24 * 3600000),
    isRead: false,
    actionUrl: "/gaming/poker",
    metadata: { gameId: "poker" },
  },
  {
    id: "8",
    type: "reputation",
    category: "social",
    title: "Reputation Unlock",
    message: "You've reached Level 5! New features unlocked",
    timestamp: new Date(Date.now() - 36 * 3600000),
    isRead: false,
    actionUrl: "/profile#reputation",
    metadata: { reputationPoints: 500 },
  },
  {
    id: "9",
    type: "system",
    category: "system",
    title: "System Update",
    message: "VeraLux v2.1 is now live with new features",
    timestamp: new Date(Date.now() - 48 * 3600000),
    isRead: true,
    actionUrl: "/changelog",
  },
  {
    id: "10",
    type: "promotional",
    category: "system",
    title: "Promotional",
    message: "Limited time offer: Upgrade to Pro and get 50% off",
    timestamp: new Date(Date.now() - 72 * 3600000),
    isRead: true,
    actionUrl: "/upgrade",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  const iconMap = {
    like: Heart,
    follow: UserPlus,
    mention: AtSign,
    action_required: AlertCircle,
    task: CheckSquare,
    post: Bell,
    gaming: Gamepad2,
    reputation: Trophy,
    system: Megaphone,
    promotional: Tag,
  };
  return iconMap[type] || Bell;
};

const getNotificationColor = (type: Notification["type"]) => {
  const colorMap = {
    like: "text-red-500 bg-red-500/10",
    follow: "text-blue-500 bg-blue-500/10",
    mention: "text-purple-500 bg-purple-500/10",
    action_required: "text-orange-500 bg-orange-500/10",
    task: "text-green-500 bg-green-500/10",
    post: "text-cyan-500 bg-cyan-500/10",
    gaming: "text-pink-500 bg-pink-500/10",
    reputation: "text-yellow-500 bg-yellow-500/10",
    system: "text-indigo-500 bg-indigo-500/10",
    promotional: "text-emerald-500 bg-emerald-500/10",
  };
  return colorMap[type] || "text-gray-500 bg-gray-500/10";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"personal" | "social" | "system">(
    "personal"
  );
  const router = useRouter();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Navigate if URL provided
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(
    (n) => n.category === activeTab
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadCountByCategory = {
    personal: notifications.filter(
      (n) => n.category === "personal" && !n.isRead
    ).length,
    social: notifications.filter((n) => n.category === "social" && !n.isRead)
      .length,
    system: notifications.filter((n) => n.category === "system" && !n.isRead)
      .length,
  };

  return (
    <>
      {/* Mobile Full-Page View */}
      <div className="md:hidden min-h-screen">
        {/* Fixed Mobile Header - Matches Screenshot */}
        <div
          className="fixed top-0 left-0 right-0 z-50 shadow-sm"
          style={{
            background: "rgba(8, 14, 17, 0.4)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="px-4 pt-3 pb-2">
            {/* Top Row: Back Button, Title, Mark All */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="h-9 w-9 p-0 -ml-2 hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-base font-semibold text-foreground">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      ● {unreadCount} new notification
                      {unreadCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary hover:text-primary/80 h-auto p-0 font-normal"
                >
                  Mark all
                </Button>
              )}
            </div>

            {/* Tabs Row - Three-section pill, matching sample design */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="w-full"
            >
              <TabsList
                className="w-full grid grid-cols-3 gap-1"
                style={{
                  background: "rgba(229, 247, 253, 0.04)",
                  borderRadius: "22px",
                  padding: "4px",
                }}
              >
                <TabsTrigger
                  value="personal"
                  className="text-[13px] font-medium text-muted-foreground relative transition-all py-1.5"
                  style={{
                    ...(activeTab === "personal" && {
                      background: "rgba(229, 247, 253, 0.2)",
                      borderRadius: "18px",
                      color: "white",
                    }),
                  }}
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="text-[13px] font-medium text-muted-foreground relative transition-all py-1.5"
                  style={{
                    ...(activeTab === "social" && {
                      background: "rgba(229, 247, 253, 0.2)",
                      borderRadius: "18px",
                      color: "white",
                    }),
                  }}
                >
                  Social
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="text-[13px] font-medium text-muted-foreground relative transition-all py-1.5"
                  style={{
                    ...(activeTab === "system" && {
                      background: "rgba(229, 247, 253, 0.2)",
                      borderRadius: "18px",
                      color: "white",
                    }),
                  }}
                >
                  System
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Spacer for Fixed Header */}
        <div className="h-[108px]" />

        {/* Mobile Notifications List - Match compact card design */}
        <div className="px-3 py-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Bell className="h-10 w-10 text-primary/70" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1.5">
                All caught up!
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                No {activeTab} notifications right now. We'll notify you when
                something new arrives.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-3 rounded-2xl transition-all duration-150",
                      "hover:bg-white/5 cursor-pointer active:scale-[0.98]",
                      "group relative",
                      !notification.isRead
                        ? "bg-[rgba(8,14,17,0.9)] border border-white/10"
                        : "bg-[rgba(8,14,17,0.7)] border border-white/5"
                    )}
                  >
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0 relative mt-0.5">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 text-foreground text-xs">
                            {notification.metadata?.userName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            colorClass
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      {!notification.isRead && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#080E11]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left flex flex-col gap-1">
                      <p className="text-[13px] font-semibold text-white line-clamp-1 leading-tight">
                        {notification.title}
                      </p>
                      <p className="text-[12px] text-[#9BB6CC] line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    {/* Time pill on the right */}
                    <div className="flex-shrink-0 flex items-start pt-0.5">
                      <span
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap"
                        style={{
                          background: "rgba(31, 41, 55, 0.9)",
                          color: "#FFFFFF",
                        }}
                      >
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-8" />
      </div>

      {/* Desktop View with NavigationLayout */}
      <div className="hidden md:block">
        <NavigationLayout>
          <div className="min-h-screen">
            {/* Desktop Header */}
            <div
              className="border-b"
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(8, 14, 17, 0.2)",
              }}
            >
              <div className="max-w-4xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        Notifications
                      </h1>
                      {unreadCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {unreadCount} unread notification
                          {unreadCount !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Mark all as read
                  </Button>
                </div>

                {/* Tabs - Desktop */}
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as any)}
                  className="w-full"
                >
                  <TabsList className="w-full bg-muted/50 p-1 justify-start">
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative gap-2"
                    >
                      Personal
                      {unreadCountByCategory.personal > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                          {unreadCountByCategory.personal}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative gap-2"
                    >
                      Social
                      {unreadCountByCategory.social > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                          {unreadCountByCategory.social}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="system"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative gap-2"
                    >
                      System
                      {unreadCountByCategory.system > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                          {unreadCountByCategory.system}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Desktop Notifications List */}
            <div className="max-w-4xl mx-auto px-6 py-6">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    You're all caught up! Check back later for new updates in{" "}
                    {activeTab}.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "w-full flex gap-4 px-4 py-4 rounded-xl transition-all duration-150",
                          "hover:bg-muted/50 cursor-pointer active:scale-[0.98]",
                          "group relative border",
                          !notification.isRead
                            ? "bg-primary/5 border-primary/20"
                            : "bg-card border-border"
                        )}
                      >
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0 relative">
                          {notification.avatar ? (
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground text-sm font-medium">
                                {notification.metadata?.userName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div
                              className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center",
                                colorClass
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                          )}
                          {!notification.isRead && (
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-base font-medium text-foreground mb-1 line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              className="h-8 w-8 p-0 hover:bg-primary/20 text-muted-foreground hover:text-primary rounded-lg"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="h-8 w-8 p-0 hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-lg"
                            title="Delete"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </NavigationLayout>
      </div>
    </>
  );
}
