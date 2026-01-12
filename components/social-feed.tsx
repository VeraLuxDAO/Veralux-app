"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { PostCreator } from "@/components/post-creator";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface MediaFile {
  type: "image" | "video" | "audio";
  url: string;
}

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
  media?: MediaFile[];
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
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<FlowPost[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  const handleCreatePost = useCallback((content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Convert files to media objects with object URLs
    // In a real implementation, you would:
    // 1. Upload files to your storage (e.g., IPFS, AWS S3, etc.)
    // 2. Get the file URLs from the storage service
    // 3. Store them in the post data
    const media: MediaFile[] | undefined = files?.map((file) => {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "audio";
      const url = URL.createObjectURL(file);
      return { type, url };
    });

    const newPost: FlowPost = {
      id: `user-${Date.now()}`,
      author: {
        name: user?.name || "Anonymous User",
        username: user?.email?.split("@")[0] 
          ? `@${user.email.split("@")[0]}` 
          : "@user",
        avatar: user?.picture || "/placeholder.svg",
        verified: false,
        badges: [],
      },
      content,
      timestamp: "now",
      glows: 0,
      tips: 0,
      replies: 0,
      hasGlowed: false,
      hasTipped: false,
      tags: [],
      media,
    };

    // Add new post at the beginning of the feed
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, [user]);

  // Generate more mock posts for infinite scroll
  const generateMorePosts = useCallback((pageNum: number): FlowPost[] => {
    const newPosts: FlowPost[] = [];
    const baseId = pageNum * 10;

    for (let i = 0; i < 5; i++) {
      const id = (baseId + i).toString();
      newPosts.push({
        id,
        author: {
          name: `User ${baseId + i}`,
          username: `@user${baseId + i}`,
          avatar: "/diverse-user-avatars.png",
          verified: Math.random() > 0.7,
          badges: Math.random() > 0.5 ? ["Trader"] : [],
        },
        content: `This is post ${id} with some interesting content about Web3 and blockchain technology. ${
          Math.random() > 0.5 ? "🚀" : "💎"
        }`,
        timestamp: `${Math.floor(Math.random() * 24)}h ago`,
        glows: Math.floor(Math.random() * 100),
        tips: Math.floor(Math.random() * 50),
        replies: Math.floor(Math.random() * 20),
        hasGlowed: false,
        hasTipped: false,
        tags: ["DeFi", "Web3", "Crypto"][Math.floor(Math.random() * 3)]
          ? ["DeFi"]
          : [],
      });
    }
    return newPosts;
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPosts = generateMorePosts(page);

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setPage((prev) => prev + 1);

    // Stop loading after 5 pages (25 additional posts)
    if (page >= 5) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, page, generateMorePosts]);

  // Intersection Observer for auto-loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target?.isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMorePosts, hasMore, isLoading]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Post Creator - at the top (only show when authenticated) */}
      {isAuthenticated && user && (
        <PostCreator onCreatePost={handleCreatePost} />
      )}

      {/* Posts Feed */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onGlow={handleGlow}
          onTip={handleTip}
        />
      ))}

      {/* Auto-loading trigger and loading indicator */}
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading more flows...</span>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Scroll down for more
              </span>
            </div>
          )}
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && !isLoading && (
        <div className="text-center py-8">
          <div className="text-sm text-muted-foreground">
            🎉 You've reached the end of the feed
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Check back later for new flows
          </div>
        </div>
      )}
    </div>
  );
}
