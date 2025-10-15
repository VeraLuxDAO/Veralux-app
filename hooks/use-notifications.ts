/**
 * useNotifications Hook
 *
 * Centralized hook for managing notifications across the app.
 * Replace the mock data with real API calls here.
 */

import { useState, useEffect, useCallback } from "react";
import type { Notification, NotificationCategory } from "@/types/notification";

// Mock notifications - Replace with API calls
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

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  unreadCountByCategory: {
    personal: number;
    social: number;
    system: number;
  };
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  refreshNotifications: () => void;
  isLoading: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      // setNotifications(data);

      // Using mock data for now
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/notifications/read-all', { method: 'PATCH' });

      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });

      // Optimistic update
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Calculate unread counts
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

  return {
    notifications,
    unreadCount,
    unreadCountByCategory,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    isLoading,
  };
}
