import { ChatMessage } from "@/components/chat/chat-message";

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  isPrivate: boolean;
  unreadCount?: number;
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
  isCollapsed?: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  role?: string;
}

export const mockChannelCategories: ChannelCategory[] = [
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
      { id: "dev-hangout", name: "Dev Hangout", type: "voice", isPrivate: false },
      { id: "trading-room", name: "Trading Room", type: "voice", isPrivate: true },
    ],
  },
];

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "Vitalik Buterin",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    role: "Admin",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    status: "online",
    role: "Moderator",
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "/developer-avatar.png",
    status: "idle",
  },
  {
    id: "4",
    name: "Clara Jin",
    status: "online",
  },
  {
    id: "5",
    name: "Maxwell",
    status: "offline",
  },
];

export const mockMessages: ChatMessage[] = [
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
    content: "That's amazing! What kind of gas savings are you seeing compared to V3?",
    authorId: "sarah",
    authorName: "Sarah Miller",
    authorAvatar: "/diverse-female-avatar.png",
    timestamp: new Date(Date.now() - 3500000),
    type: "text",
    isOwn: false,
    replyTo: {
      id: "2",
      authorName: "Vitalik Buterin",
      content: "Hey everyone! Just deployed a new liquidity pool on Uniswap V4...",
    },
  },
  {
    id: "4",
    content: "Around 40% reduction in gas costs for complex swaps. The hook system is a game changer!",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3400000),
    type: "text",
    isOwn: false,
  },
  {
    id: "5",
    content: "This is exactly what we need for mainstream adoption. Lower fees = more users 💪",
    authorId: "current-user",
    authorName: "You",
    timestamp: new Date(Date.now() - 1800000),
    type: "text",
    isOwn: true,
  },
];
