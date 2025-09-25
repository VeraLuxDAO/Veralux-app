"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Star,
  Coins,
  Award,
  TrendingUp,
  Users,
  Zap,
  Gift,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDashboardProps {
  className?: string;
}

export function ProfileDashboard({ className }: ProfileDashboardProps) {
  const reputationData = {
    total: 8547,
    breakdown: [
      {
        category: "Social Engagement",
        points: 2847,
        color: "veralux-green",
        percentage: 85,
      },
      {
        category: "Gaming Achievements",
        points: 1923,
        color: "veralux-yellow",
        percentage: 65,
      },
      {
        category: "Trading History",
        points: 2156,
        color: "electric-blue",
        percentage: 75,
      },
      {
        category: "Development",
        points: 1621,
        color: "purple-500",
        percentage: 55,
      },
    ],
  };

  const tokens = [
    {
      symbol: "VERA",
      name: "Veralux Token",
      amount: "12,547",
      value: "$8,234",
      change: "+12.4%",
      logo: "🌟",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: "2.34",
      value: "$4,567",
      change: "+5.7%",
      logo: "💎",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      amount: "1,250",
      value: "$1,250",
      change: "0%",
      logo: "💵",
    },
    {
      symbol: "FLOW",
      name: "Flow Points",
      amount: "847",
      value: "$423",
      change: "+23.1%",
      logo: "⚡",
    },
  ];

  const badges = [
    {
      name: "Early Adopter",
      description: "Joined in the first month",
      rarity: "Legendary",
      color: "electric-blue",
      icon: "🚀",
    },
    {
      name: "Top Contributor",
      description: "Most helpful community member",
      rarity: "Epic",
      color: "veralux-green",
      icon: "👑",
    },
    {
      name: "DeFi Expert",
      description: "Mastered yield farming",
      rarity: "Rare",
      color: "veralux-yellow",
      icon: "🌾",
    },
    {
      name: "Guild Champion",
      description: "Won guild tournament",
      rarity: "Epic",
      color: "purple-500",
      icon: "⚔️",
    },
    {
      name: "NFT Collector",
      description: "Collected 100+ NFTs",
      rarity: "Rare",
      color: "pink-500",
      icon: "🎨",
    },
    {
      name: "Code Reviewer",
      description: "Reviewed 50+ smart contracts",
      rarity: "Uncommon",
      color: "blue-500",
      icon: "🔍",
    },
  ];

  const nfts = [
    {
      name: "Profile Avatar #4721",
      collection: "Veralux Profiles",
      rarity: "Epic",
      image: "🖼️",
      floor: "0.5 ETH",
    },
    {
      name: "Guild Master Badge",
      collection: "Guild Achievements",
      rarity: "Legendary",
      image: "🏆",
      floor: "2.1 ETH",
    },
    {
      name: "DeFi Pioneer",
      collection: "Protocol Badges",
      rarity: "Rare",
      image: "⚡",
      floor: "0.8 ETH",
    },
    {
      name: "Community Leader",
      collection: "Social Ranks",
      rarity: "Epic",
      image: "👥",
      floor: "1.2 ETH",
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Reputation Section */}
      <Card className="dashboard-card bg-gradient-to-br from-veralux-green/5 via-background to-electric-blue/5 border-veralux-green/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-veralux-green/5 via-transparent to-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-veralux-green transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Reputation from Veralux app
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-veralux-green transition-all duration-300 group-hover:scale-110">
                {reputationData.total.toLocaleString()}
                <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ✨
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-4">
            {reputationData.breakdown.map((item, index) => (
              <div
                key={index}
                className="space-y-2 group cursor-pointer p-3 rounded-lg hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    {item.category}
                  </span>
                  <span
                    className={`text-sm font-semibold text-${item.color} transition-all duration-300 group-hover:scale-110`}
                  >
                    {item.points.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={item.percentage}
                    className="h-2 transition-all duration-500 group-hover:h-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-veralux-green border-veralux-green hover:bg-veralux-green hover:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tokens Section */}
      <Card className="dashboard-card bg-gradient-to-br from-electric-blue/5 via-background to-veralux-yellow/5 border-electric-blue/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-electric-blue" />
              Tokens
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-electric-blue border-electric-blue hover:bg-electric-blue hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Token
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="token-card flex items-center justify-between p-3 rounded-lg bg-muted/50 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue/20 to-purple-500/20 flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    {token.logo}
                  </div>
                  <div>
                    <div className="font-medium transition-colors group-hover:text-electric-blue">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      {token.name}
                    </div>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <div className="font-semibold transition-all duration-300 group-hover:scale-105">
                    {token.amount} {token.symbol}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">{token.value}</span>
                    <span
                      className={cn(
                        "ml-2 text-xs transition-all duration-300 group-hover:font-semibold",
                        token.change.startsWith("+")
                          ? "text-veralux-green"
                          : token.change.startsWith("-")
                          ? "text-red-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {token.change}
                      {token.change.startsWith("+") && (
                        <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          📈
                        </span>
                      )}
                      {token.change.startsWith("-") && (
                        <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          📉
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-electric-blue">
                  Portfolio Value
                </div>
                <div className="text-sm text-muted-foreground">
                  Total estimated value
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-electric-blue">
                  $14,474
                </div>
                <div className="text-sm text-veralux-green">+8.7% (24h)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="dashboard-card bg-gradient-to-br from-veralux-yellow/5 via-background to-purple-500/5 border-veralux-yellow/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-veralux-yellow" />
              Badges
            </CardTitle>
            <div className="text-right">
              <div className="text-lg font-bold">{badges.length}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="badge-card p-3 rounded-lg bg-muted/50 cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform group-hover:scale-110",
                      `bg-${badge.color}/20`
                    )}
                  >
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {badge.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {badge.description}
                    </div>
                    <Badge
                      className={cn(
                        "mt-1 text-xs",
                        badge.rarity === "Legendary" &&
                          "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
                        badge.rarity === "Epic" &&
                          "bg-purple-500/20 text-purple-500 border-purple-500/30",
                        badge.rarity === "Rare" &&
                          "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30",
                        badge.rarity === "Uncommon" &&
                          "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
                      )}
                    >
                      {badge.rarity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="text-veralux-yellow border-veralux-yellow hover:bg-veralux-yellow hover:text-black"
            >
              <Gift className="h-4 w-4 mr-2" />
              View All Badges
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* NFTs Section */}
      <Card className="dashboard-card bg-gradient-to-br from-purple-500/5 via-background to-pink-500/5 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              NFT's
            </CardTitle>
            <div className="text-right">
              <div className="text-lg font-bold">{nfts.length}</div>
              <div className="text-sm text-muted-foreground">Owned</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {nfts.map((nft, index) => (
              <div
                key={index}
                className="nft-card p-4 rounded-lg bg-muted/50 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                    {nft.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {nft.name}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {nft.collection}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={cn(
                          "text-xs",
                          nft.rarity === "Legendary" &&
                            "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
                          nft.rarity === "Epic" &&
                            "bg-purple-500/20 text-purple-500 border-purple-500/30",
                          nft.rarity === "Rare" &&
                            "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
                        )}
                      >
                        {nft.rarity}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Floor: {nft.floor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View in OpenSea
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
