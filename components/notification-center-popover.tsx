"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
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
  CheckCheck,
  Trash2,
  Settings,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

interface NotificationCenterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data
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

export function NotificationCenterPopover({
  isOpen,
  onClose,
}: NotificationCenterPopoverProps) {
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
      onClose();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Notification Dropdown - Desktop Only */}
      <div
        className={cn(
          "notification-center-dropdown",
          "fixed z-[60]",
          "bg-card border border-border shadow-2xl rounded-xl",
          "transform transition-all duration-200 ease-out",
          "hidden md:block",
          "w-[420px]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{
          top: "4.5rem",
          right: "1.5rem",
          maxHeight: "calc(100vh - 6rem)",
        }}
      >
        <div className="flex flex-col h-full max-h-[calc(100vh-6rem)]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-foreground">
                Notifications
              </h2>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-7 px-2 hover:bg-muted text-muted-foreground hover:text-primary text-xs rounded-md transition-all"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-all"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Three-Section Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="w-full"
            >
              <TabsList className="w-full bg-muted/50 p-1 rounded-lg grid grid-cols-3 gap-1">
                <TabsTrigger
                  value="personal"
                  className="text-[11px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-md relative transition-all py-1.5"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Personal</span>
                    {unreadCountByCategory.personal > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {unreadCountByCategory.personal}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="text-[11px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-md relative transition-all py-1.5"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Social</span>
                    {unreadCountByCategory.social > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {unreadCountByCategory.social}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="text-[11px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-md relative transition-all py-1.5"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>System</span>
                    {unreadCountByCategory.system > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {unreadCountByCategory.system}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-2">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    No notifications
                  </p>
                  <p className="text-[11px] text-muted-foreground text-center">
                    All caught up!
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "w-full flex gap-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-150",
                          "hover:bg-muted/50 cursor-pointer",
                          "group relative",
                          !notification.isRead && "bg-muted/30"
                        )}
                      >
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0 relative">
                          {notification.avatar ? (
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 text-foreground text-xs">
                                {notification.metadata?.userName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div
                              className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center",
                                colorClass
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                          )}
                          {!notification.isRead && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border border-card" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[12px] font-medium text-foreground mb-0.5 line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground/70">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>

                        {/* Actions (visible on hover) */}
                        <div className="flex-shrink-0 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              className="h-6 w-6 p-0 hover:bg-primary/20 text-muted-foreground hover:text-primary rounded-md"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-md"
                            title="Delete"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="px-3 py-2.5 border-t border-border/50 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push("/notifications");
                  onClose();
                }}
                className="w-full h-8 text-[11px] text-primary hover:text-primary-foreground hover:bg-primary/20 font-medium transition-all"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
