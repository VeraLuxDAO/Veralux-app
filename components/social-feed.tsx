"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useCallback, useMemo } from "react";
import { PostCard } from "@/components/post-card";

interface FlowPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badges: string[];
  };
  content: string;
  timestamp: string;
  glows: number;
  tips: number;
  replies: number;
  hasGlowed: boolean;
  hasTipped: boolean;
  tags: string[];
}

const mockPosts: FlowPost[] = [
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
    replies: 8,
    hasGlowed: false,
    hasTipped: false,
    tags: ["DeFi", "NFTs", "CrossChain"],
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
    replies: 23,
    hasGlowed: true,
    hasTipped: false,
    tags: ["Gaming", "CryptoQuest", "Guild"],
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
    replies: 15,
    hasGlowed: false,
    hasTipped: true,
    tags: ["DeFi", "Trading", "Analysis"],
  },
];

export function SocialFeed() {
  const [posts, setPosts] = useState<FlowPost[]>(mockPosts);

  const handleGlow = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              hasGlowed: !post.hasGlowed,
              glows: post.hasGlowed ? post.glows - 1 : post.glows + 1,
            }
          : post
      )
    );
  }, []);

  const handleTip = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              hasTipped: !post.hasTipped,
              tips: post.hasTipped ? post.tips - 1 : post.tips + 1,
            }
          : post
      )
    );
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onGlow={handleGlow}
          onTip={handleTip}
        />
      ))}

      {/* Load More */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
        >
          Load More Flows
        </Button>
      </div>
    </div>
  );
}
