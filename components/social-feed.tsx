"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface FlowPost {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
    badges: string[]
  }
  content: string
  timestamp: string
  glows: number
  tips: number
  replies: number
  hasGlowed: boolean
  hasTipped: boolean
  tags: string[]
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
]

export function SocialFeed() {
  const [posts, setPosts] = useState<FlowPost[]>(mockPosts)

  const handleGlow = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              hasGlowed: !post.hasGlowed,
              glows: post.hasGlowed ? post.glows - 1 : post.glows + 1,
            }
          : post,
      ),
    )
  }

  const handleTip = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              hasTipped: !post.hasTipped,
              tips: post.hasTipped ? post.tips - 1 : post.tips + 1,
            }
          : post,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-card border-border">
          <CardContent className="p-6">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-card-foreground">{post.author.name}</span>
                  <span className="text-sm text-muted-foreground">{post.author.username}</span>
                  {post.author.verified && (
                    <div className="w-4 h-4 bg-veralux-green rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {post.author.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-card-foreground whitespace-pre-line leading-relaxed">{post.content}</p>
            </div>

            {/* Post Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGlow(post.id)}
                className={`flex items-center space-x-2 ${
                  post.hasGlowed
                    ? "text-veralux-green hover:text-veralux-green/80"
                    : "text-muted-foreground hover:text-veralux-green"
                }`}
              >
                <span className="text-lg">⚡</span>
                <span className="text-sm font-medium">{post.glows} Glows</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTip(post.id)}
                className={`flex items-center space-x-2 ${
                  post.hasTipped
                    ? "text-veralux-yellow hover:text-veralux-yellow/80"
                    : "text-muted-foreground hover:text-veralux-yellow"
                }`}
              >
                <span className="text-lg">💰</span>
                <span className="text-sm font-medium">{post.tips} Tips</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-electric-blue"
              >
                <span className="text-lg">💬</span>
                <span className="text-sm font-medium">{post.replies} Replies</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-electric-blue ml-auto"
              >
                <span className="text-lg">🔗</span>
                <span className="text-sm font-medium">Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
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
  )
}
