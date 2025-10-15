/**
 * Notification Types for VeraLux Notification Center
 *
 * This file contains all type definitions for the notification system.
 */

export type NotificationType =
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

export type NotificationCategory = "personal" | "social" | "system";

export interface NotificationMetadata {
  userName?: string;
  postId?: string;
  gameId?: string;
  reputationPoints?: number;
  [key: string]: any; // Allow for additional metadata fields
}

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  metadata?: NotificationMetadata;
}

/**
 * Categories and their respective notification types:
 *
 * Personal:
 * - likes: When someone likes your content
 * - follows: When someone follows you
 * - mentions: When someone mentions you
 * - action_required: Actions that need user attention
 * - task: New tasks assigned to the user
 *
 * Social:
 * - post: New posts from people you follow
 * - gaming: Gaming-related updates and achievements
 * - reputation: Reputation level unlocks and achievements
 *
 * System:
 * - system: Platform news and updates
 * - promotional: Promotional content and offers
 */
