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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Lock, Globe, Crown, Shield, Hash } from "lucide-react";
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

  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCircleClick = (circle: Circle) => {
    if (circle.isJoined) {
      // Navigate to circle sliding panel with query parameter
      router.push(`/?circle=${slugifyCircleName(circle.name)}`);
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
      className="group border-none transition-all duration-300 cursor-pointer hover:shadow-lg active:scale-[0.98] rounded-xl overflow-hidden"
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      onClick={() => handleCircleClick(circle)}
    >
      <CardContent className="p-4">
        {/* Header Row: Icon + Name + Unread Badge */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon with Online Indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl">{circle.icon}</span>
            </div>
            {circle.isJoined && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          {/* Name + Private Badge + Unread */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3 className="font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
                  {circle.name}
                </h3>
                {circle.isPrivate && (
                  <Lock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                )}
              </div>
              {circle.unreadCount && circle.unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs h-5 min-w-[20px] px-1.5 font-semibold flex-shrink-0">
                  {circle.unreadCount}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
              {circle.description}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground text-sm">
                {circle.memberCount.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                {circle.onlineMembers}
              </span>
              <span className="text-xs text-muted-foreground">online</span>
            </div>
          </div>

          {/* Action Button/Status */}
          {circle.isJoined ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {circle.lastActivity}
              </span>
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0"
              >
                Joined
              </Badge>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-3 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
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
                "Join"
              )}
            </Button>
          )}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1.5">
          {circle.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs h-6 px-2 bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
          {circle.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs h-6 px-2 bg-muted text-muted-foreground border-0"
            >
              +{circle.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl h-[85vh] max-h-[600px] p-0 gap-0 border-[0.4px] border-[rgba(255,255,255,0.08)] rounded-[16px]"
        style={{
          background: "rgba(8, 14, 17, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        showCloseButton={false}
      >
        <DialogHeader className="p-3 sm:p-5 pb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + Title (Mobile: Left-aligned) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground text-left">
                  Circles
                </DialogTitle>
                <p className="text-xs text-muted-foreground text-left hidden sm:block">
                  Connect with your communities
                </p>
              </div>
            </div>

            {/* Right: Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Bar */}
          <div className="px-3 sm:px-5 py-3 sm:py-4">
            <div className="relative flex flex-row items-center py-1 px-1.5 w-full h-[29px] bg-[rgba(229,247,253,0.06)] rounded-[16px] flex-none order-1 self-stretch grow-0">
              <Input
                placeholder="Search circles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={false}
                className="w-full h-full border-0 bg-transparent font-medium text-[11px] leading-[26px] text-left text-[rgba(255,255,255,0.5)] placeholder:text-[rgba(255,255,255,0.4)] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 pl-2 pr-6"
              />
              {/* Search Icon - Inside Right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
              </div>
              {/* Clear Button (if searching) */}
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-9 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
            <TabsList
              className="mx-3 sm:mx-5 mt-3 sm:mt-4 grid w-auto grid-cols-2 gap-1"
              style={{
                background: "rgba(229, 247, 253, 0.04)",
                borderRadius: "22px",
                padding: "4px",
              }}
            >
              <TabsTrigger
                value="joined"
                className="text-[13px] font-medium text-muted-foreground relative transition-all py-2 flex items-center justify-center gap-1.5"
                style={{
                  ...(activeTab === "joined" && {
                    background: "rgba(229, 247, 253, 0.2)",
                    borderRadius: "18px",
                    color: "white",
                  }),
                }}
              >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>My ({mockJoinedCircles.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="text-[13px] font-medium text-muted-foreground relative transition-all py-2 flex items-center justify-center gap-1.5"
                style={{
                  ...(activeTab === "discover" && {
                    background: "rgba(229, 247, 253, 0.2)",
                    borderRadius: "18px",
                    color: "white",
                  }),
                }}
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Discover</span>
              </TabsTrigger>
            </TabsList>

            {/* Joined Circles Tab */}
            <TabsContent
              value="joined"
              className="flex-1 px-3 sm:px-5 pb-3 sm:pb-5 mt-2 sm:mt-3 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-2.5 sm:space-y-3 pr-1 sm:pr-2">
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
              className="flex-1 px-3 sm:px-5 pb-3 sm:pb-5 mt-2 sm:mt-3 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-2.5 sm:space-y-3 pr-1 sm:pr-2">
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

          {/* Close Button */}
          <div className="p-3 sm:p-5 pt-3 sm:pt-4 border-t border-border/50 bg-muted/10">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-10 sm:h-11 text-sm font-semibold border-border hover:bg-muted hover:border-border/80 transition-all rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
