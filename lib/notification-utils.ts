/**
 * Notification Utility Functions
 *
 * Helper functions for working with notifications
 */

import type { Notification, NotificationType } from "@/types/notification";
import {
  Heart,
  UserPlus,
  AtSign,
  AlertCircle,
  CheckSquare,
  Bell,
  Gamepad2,
  Trophy,
  Megaphone,
  Tag,
} from "lucide-react";

/**
 * Get the icon component for a notification type
 */
export function getNotificationIcon(type: NotificationType) {
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
}

/**
 * Get the color class for a notification type
 */
export function getNotificationColor(type: NotificationType) {
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
}

/**
 * Format a timestamp into a human-readable relative time
 */
export function formatNotificationTime(date: Date): string {
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
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.timestamp);
    if (notifDate >= today) {
      groups.today.push(notification);
    } else if (notifDate >= yesterday) {
      groups.yesterday.push(notification);
    } else if (notifDate >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.earlier.push(notification);
    }
  });

  return groups;
}

/**
 * Filter notifications by category
 */
export function filterNotificationsByCategory(
  notifications: Notification[],
  category: "personal" | "social" | "system"
) {
  return notifications.filter((n) => n.category === category);
}

/**
 * Get unread notification count
 */
export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

/**
 * Get unread count by category
 */
export function getUnreadCountByCategory(notifications: Notification[]) {
  return {
    personal: notifications.filter(
      (n) => n.category === "personal" && !n.isRead
    ).length,
    social: notifications.filter((n) => n.category === "social" && !n.isRead)
      .length,
    system: notifications.filter((n) => n.category === "system" && !n.isRead)
      .length,
  };
}

/**
 * Sort notifications by timestamp (newest first)
 */
export function sortNotificationsByTime(
  notifications: Notification[]
): Notification[] {
  return [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}
