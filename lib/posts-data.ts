export type MediaFile = {
  type: "image" | "video" | "audio";
  url: string;
  mime?: string;
  playable?: boolean;
};

export type Attachment = {
  id: string;
  label: string;
  type: "link" | "document" | "image" | "code" | "video";
  url?: string;
  meta?: string;
};

export type Author = {
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  badges: string[];
};

export type FlowPost = {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  glows: number;
  tips: number;
  replies: number;
  hasGlowed: boolean;
  hasTipped: boolean;
  tags: string[];
  media?: MediaFile[];
  attachments?: Attachment[];
};

export type Comment = {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  glows: number;
  hasGlowed: boolean;
  attachments?: Attachment[];
};

const basePosts: FlowPost[] = [
  {
    id: "1",
    author: {
      name: "John Doe",
      username: "@johndoe",
      avatar: "/diverse-user-avatars.png",
      verified: true,
      badges: ["Verified Dev"],
    },
    content:
      "Just deployed a new smart contract for cross-chain NFT transfers. The future is interoperable! 🚀\n\nKey features:\n- Gas optimized transfers\n- Multi-chain support\n- Built-in royalty management\n\nOpen source repo coming soon. Who wants to collaborate?",
    timestamp: "2h ago",
    glows: 24,
    tips: 5,
    replies: 2,
    hasGlowed: false,
    hasTipped: false,
    tags: ["DeFi", "NFTs", "CrossChain"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
      },
    ],
    attachments: [
      {
        id: "att-1",
        label: "Cross-chain NFT whitepaper.pdf",
        type: "document",
        meta: "1.2 MB",
      },
      {
        id: "att-2",
        label: "Smart contract repo",
        type: "link",
        url: "https://github.com/veralux/socialapp",
        meta: "GitHub",
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Sarah Miller",
      username: "@sarahm",
      avatar: "/diverse-female-avatar.png",
      verified: true,
      badges: ["Gaming Pro"],
    },
    content:
      "Our guild just won the championship in CryptoQuest! 🏆\n\nAmazing teamwork from everyone. Special shoutout to our strategist @alexchen for the winning plays.\n\nNext tournament is in 2 weeks - who's ready to defend our title?",
    timestamp: "4h ago",
    glows: 67,
    tips: 12,
    replies: 1,
    hasGlowed: true,
    hasTipped: false,
    tags: ["Gaming", "CryptoQuest", "Guild"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      },
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        playable: true,
      },
    ],
    attachments: [
      {
        id: "att-3",
        label: "Match highlights",
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        meta: "02:15",
      },
      {
        id: "att-4",
        label: "Tournament bracket.png",
        type: "image",
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        meta: "PNG",
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "Mike Kim",
      username: "@mikekim",
      avatar: "/developer-avatar.png",
      verified: false,
      badges: ["Trader"],
    },
    content:
      "Market analysis: DeFi tokens showing strong momentum 📈\n\nKey observations:\n- TVL increasing across major protocols\n- New yield farming opportunities emerging\n- Layer 2 adoption accelerating\n\nPerfect time for strategic positions. DYOR as always!",
    timestamp: "6h ago",
    glows: 31,
    tips: 8,
    replies: 0,
    hasGlowed: false,
    hasTipped: true,
    tags: ["DeFi", "Trading", "Analysis"],
    attachments: [
      {
        id: "att-5",
        label: "Signal breakdown.md",
        type: "code",
        meta: "Notes",
      },
    ],
  },
];

const commentsByPost: Record<string, Comment[]> = {
  "1": [
    {
      id: "c-1",
      author: {
        name: "Sarah Miller",
        username: "@sarahm",
        avatar: "/diverse-female-avatar.png",
        verified: true,
        badges: ["Gaming Pro"],
      },
      content:
        "Congrats on the launch! Curious about how royalties are enforced on L2 chains. Is there a fallback mechanism?",
      timestamp: "1h ago",
      glows: 6,
      hasGlowed: false,
      attachments: [
        {
          id: "c-att-1",
          label: "Bridge flow diagram",
          type: "image",
          url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
          meta: "Preview",
        },
      ],
    },
    {
      id: "c-2",
      author: {
        name: "Mike Chen",
        username: "@mikechen",
        avatar: "/developer-avatar.png",
        verified: false,
        badges: ["Smart Contracts"],
      },
      content:
        "Nice work. Recommend adding an allowlist for marketplaces while you validate the royalty flow. Also, feel free to DM, happy to review the repo.",
      timestamp: "52m ago",
      glows: 3,
      hasGlowed: false,
    },
  ],
  "2": [
    {
      id: "c-3",
      author: {
        name: "Alex Chen",
        username: "@alexchen",
        avatar: "/developer-avatar.png",
        verified: false,
        badges: ["Strategist"],
      },
      content:
        "Huge win! Let's publish the strategy notes so other guilds can learn. Proud of the squad.",
      timestamp: "3h ago",
      glows: 11,
      hasGlowed: true,
    },
  ],
};

export const getAllPosts = (): FlowPost[] => basePosts;

export const getPostById = (id: string): FlowPost | undefined => {
  // Check base posts first
  const basePost = basePosts.find((post) => post.id === id);
  if (basePost) return basePost;

  // Check localStorage for user-created posts (client-side only)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("veralux_user_posts");
      if (stored) {
        const userPosts: FlowPost[] = JSON.parse(stored);
        return userPosts.find((post) => post.id === id);
      }
    } catch (error) {
      console.error("Failed to read posts from localStorage:", error);
    }
  }

  return undefined;
};

export const getCommentsForPost = (id: string): Comment[] =>
  commentsByPost[id] ?? [];

export const generatePostLink = (id: string): string => `/posts/${id}`;
