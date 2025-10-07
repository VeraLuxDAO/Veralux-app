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
      className="bg-card border-border hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-md active:scale-[0.98]"
      onClick={() => handleCircleClick(circle)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start space-x-3">
          {/* Circle Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg sm:text-xl">{circle.icon}</span>
          </div>

          {/* Circle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-sm sm:text-base text-card-foreground truncate">
                {circle.name}
              </h3>
              {circle.isPrivate && (
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              )}
              {circle.unreadCount && circle.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs h-5 px-1.5 flex-shrink-0">
                  {circle.unreadCount}
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
              {circle.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">
                    {circle.memberCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span>{circle.onlineMembers} online</span>
                </div>
              </div>

              {circle.isJoined ? (
                <div className="text-xs text-muted-foreground font-medium">
                  {circle.lastActivity}
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Joining circle:", circle.id);
                  }}
                >
                  {circle.isPrivate ? "Request" : "Join"}
                </Button>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {circle.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs h-5 px-2"
                >
                  #{tag}
                </Badge>
              ))}
              {circle.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  +{circle.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[85vh] max-h-[600px] p-0 gap-0 m-4">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            Circles
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search circles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-4 sm:mx-6 mt-3 sm:mt-4 grid w-auto grid-cols-2 bg-muted h-10 sm:h-11">
              <TabsTrigger
                value="joined"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">
                  My Circles ({mockJoinedCircles.length})
                </span>
                <span className="sm:hidden">
                  My ({mockJoinedCircles.length})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
              >
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
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-4">🔍</div>
                      <div className="text-sm sm:text-base">
                        {searchQuery
                          ? "No circles found matching your search."
                          : "You haven't joined any circles yet."}
                      </div>
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
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-4">🌐</div>
                      <div className="text-sm sm:text-base">
                        No circles found matching your search.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
