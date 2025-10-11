"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Lock, Globe, Crown, Shield, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Circle {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  unreadCount?: number;
  lastActivity?: string;
  owner?: string;
  tags: string[];
  onlineMembers: number;
}

interface CirclesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockJoinedCircles: Circle[] = [
  {
    id: "defi-builders",
    name: "DeFi Builders",
    description: "Building the future of decentralized finance",
    icon: "🏗️",
    memberCount: 1247,
    onlineMembers: 47,
    isPrivate: false,
    isJoined: true,
    unreadCount: 5,
    lastActivity: "2m ago",
    owner: "Vitalik Buterin",
    tags: ["DeFi", "Development", "Smart Contracts"],
  },
  {
    id: "gaming-alpha",
    name: "Gaming Alpha",
    description: "Early access to Web3 gaming opportunities",
    icon: "🎮",
    memberCount: 856,
    onlineMembers: 23,
    isPrivate: true,
    isJoined: true,
    unreadCount: 12,
    lastActivity: "5m ago",
    owner: "Sarah Miller",
    tags: ["Gaming", "NFTs", "Alpha"],
  },
  {
    id: "nft-collectors",
    name: "NFT Collectors",
    description: "Premium NFT trading and collection insights",
    icon: "💎",
    memberCount: 2341,
    onlineMembers: 31,
    isPrivate: false,
    isJoined: true,
    unreadCount: 0,
    lastActivity: "1h ago",
    owner: "Mike Chen",
    tags: ["NFTs", "Trading", "Art"],
  },
];

const mockDiscoverCircles: Circle[] = [
  {
    id: "layer2-scaling",
    name: "Layer 2 Scaling",
    description: "Discussing L2 solutions and scaling technologies",
    icon: "⚡",
    memberCount: 892,
    onlineMembers: 15,
    isPrivate: false,
    isJoined: false,
    owner: "Polygon Team",
    tags: ["Layer2", "Scaling", "Technology"],
  },
  {
    id: "dao-governance",
    name: "DAO Governance",
    description: "Decentralized governance and voting mechanisms",
    icon: "🗳️",
    memberCount: 1456,
    onlineMembers: 28,
    isPrivate: false,
    isJoined: false,
    owner: "Compound Labs",
    tags: ["DAO", "Governance", "Voting"],
  },
  {
    id: "web3-security",
    name: "Web3 Security",
    description: "Security best practices and audit discussions",
    icon: "🛡️",
    memberCount: 634,
    onlineMembers: 12,
    isPrivate: true,
    isJoined: false,
    owner: "OpenZeppelin",
    tags: ["Security", "Audits", "Best Practices"],
  },
  {
    id: "metaverse-builders",
    name: "Metaverse Builders",
    description: "Creating immersive virtual worlds and experiences",
    icon: "🌐",
    memberCount: 1123,
    onlineMembers: 34,
    isPrivate: false,
    isJoined: false,
    owner: "Decentraland",
    tags: ["Metaverse", "VR", "Gaming"],
  },
];

export function CirclesModal({ isOpen, onClose }: CirclesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("joined");
  const router = useRouter();

  const handleCircleClick = (circle: Circle) => {
    if (circle.isJoined) {
      // Navigate to chat page
      router.push(`/chat/${circle.id}`);
      onClose();
    } else {
      // Handle join circle logic
      console.log("Joining circle:", circle.id);
    }
  };

  const filteredJoinedCircles = mockJoinedCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscoverCircles = mockDiscoverCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CircleCard = ({ circle }: { circle: Circle }) => (
    <Card
      className="group bg-gradient-to-r from-card via-card/95 to-card border-border/60 hover:border-primary/30 hover:bg-gradient-to-r hover:from-muted/30 hover:via-muted/20 hover:to-muted/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] rounded-2xl overflow-hidden"
      onClick={() => handleCircleClick(circle)}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start space-x-4">
          {/* Circle Icon */}
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <span className="text-xl sm:text-2xl filter drop-shadow-sm">
                {circle.icon}
              </span>
            </div>
            {circle.isJoined && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-background shadow-sm" />
            )}
          </div>

          {/* Circle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {circle.name}
                </h3>
                {circle.isPrivate && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Private
                    </span>
                  </div>
                )}
              </div>
              {circle.unreadCount && circle.unreadCount > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs h-6 px-2 font-bold shadow-sm animate-pulse">
                  {circle.unreadCount}
                </Badge>
              )}
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {circle.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1.5">
                  <Users className="h-4 w-4 text-primary/60" />
                  <span className="font-semibold text-foreground">
                    {circle.memberCount.toLocaleString()}
                  </span>
                  <span className="text-xs">members</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {circle.onlineMembers}
                  </span>
                  <span className="text-xs">online</span>
                </div>
              </div>

              {circle.isJoined ? (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-lg">
                    {circle.lastActivity}
                  </div>
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    Joined
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 px-4 font-medium border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Joining circle:", circle.id);
                  }}
                >
                  {circle.isPrivate ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Request
                    </>
                  ) : (
                    <>
                      <Users className="h-3 w-3 mr-1" />
                      Join
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {circle.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs h-6 px-2.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200 rounded-lg font-medium"
                >
                  #{tag}
                </Badge>
              ))}
              {circle.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs h-6 px-2.5 bg-muted/60 text-muted-foreground border-muted rounded-lg font-medium"
                >
                  +{circle.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="w-[95vw] max-w-2xl h-[85vh] max-h-[600px] p-0 gap-0"
        showCloseButton={false}
      >
        <DialogHeader className="p-4 sm:p-6 pb-0 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Circles
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Connect with your communities
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-colors"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/60" />
              </div>
              <Input
                placeholder="Search circles by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={false}
                className="pl-12 pr-4 h-12 sm:h-14 text-sm sm:text-base placeholder:text-muted-foreground/50 border-2 border-border/20 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 rounded-2xl bg-background/80 backdrop-blur-sm focus:bg-background shadow-sm hover:shadow-md transition-all duration-300"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-muted/60 transition-colors"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-4 sm:mx-6 mt-4 sm:mt-5 grid w-auto grid-cols-2 bg-muted/60 backdrop-blur-sm h-11 sm:h-12 rounded-2xl p-1">
              <TabsTrigger
                value="joined"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full data-[state=active]:animate-pulse" />
                <span className="hidden sm:inline">
                  My Circles ({mockJoinedCircles.length})
                </span>
                <span className="sm:hidden">
                  My ({mockJoinedCircles.length})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-violet-500 rounded-full" />
                Discover
              </TabsTrigger>
            </TabsList>

            {/* Joined Circles Tab */}
            <TabsContent
              value="joined"
              className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 mt-3 sm:mt-4 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-3 pr-2">
                {filteredJoinedCircles.length > 0 ? (
                  filteredJoinedCircles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12 text-muted-foreground max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-3xl">🔍</div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        {searchQuery ? "No matches found" : "No circles yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {searchQuery
                          ? "Try adjusting your search terms or browse the Discover tab for new circles."
                          : "Join some circles to connect with communities that interest you."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Discover Circles Tab */}
            <TabsContent
              value="discover"
              className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 mt-3 sm:mt-4 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-3 pr-2">
                {filteredDiscoverCircles.length > 0 ? (
                  filteredDiscoverCircles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12 text-muted-foreground max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-violet-100 to-cyan-100 dark:from-blue-900/30 dark:via-violet-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-3xl">🌐</div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        No circles found
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Try different search terms or check back later for new
                        circles to discover.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Cancel Button */}
          <div className="p-4 sm:p-6 pt-4 sm:pt-5 border-t border-border/30 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-12 sm:h-13 text-sm sm:text-base font-medium border-border/50 hover:bg-muted/60 hover:border-border transition-all duration-200 rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
