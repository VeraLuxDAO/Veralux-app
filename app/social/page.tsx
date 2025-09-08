"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SocialFeed } from "@/components/social-feed";
import { CreateFlowModal } from "@/components/create-flow-modal";
import { TrendingTopics } from "@/components/trending-topics";
import { SuggestedConnections } from "@/components/suggested-connections";
import { useState } from "react";

export default function SocialHubPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onMobileSidebarToggle={handleMobileSidebarToggle} />
      <div className="flex">
        <DashboardSidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] dashboard-main">
          <div className="max-w-7xl mx-auto">
            {/* Social Hub Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Social Hub
                  </h1>
                  <p className="text-muted-foreground">
                    Connect, share, and engage with the Web3 community
                  </p>
                </div>
                <CreateFlowModal />
              </div>
            </div>

            {/* Social Hub Tabs */}
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="grid w-fit grid-cols-4 bg-card border border-border max-w-md flex justify-between w-full">
                <TabsTrigger
                  value="feed"
                  className="data-[state=active]:bg-electric-blue data-[state=active]:text-white"
                >
                  Feed
                </TabsTrigger>
                <TabsTrigger
                  value="discover"
                  className="data-[state=active]:bg-electric-blue data-[state=active]:text-white"
                >
                  Discover
                </TabsTrigger>
              </TabsList>

              {/* Main Feed Tab */}
              <TabsContent value="feed">
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Left Sidebar - Quick Stats */}
                  <div className="space-y-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Your Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Flows Posted
                          </span>
                          <span className="text-sm font-semibold text-card-foreground">
                            23
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Glows Given
                          </span>
                          <span className="text-sm font-semibold text-veralux-green">
                            156
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Tips Sent
                          </span>
                          <span className="text-sm font-semibold text-veralux-yellow">
                            0.12 ETH
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Connections
                          </span>
                          <span className="text-sm font-semibold text-electric-blue">
                            892
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <TrendingTopics />
                  </div>

                  {/* Main Feed */}
                  <div className="lg:col-span-2">
                    <SocialFeed />
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                    <SuggestedConnections />

                    {/* Active Rooms */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Active Rooms
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-xs">
                              🔒
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              DeFi Builders
                            </p>
                            <p className="text-xs text-muted-foreground">
                              47 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-xs">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Gaming Alpha
                            </p>
                            <p className="text-xs text-muted-foreground">
                              23 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-8 h-8 bg-veralux-green/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-green text-xs">
                              💎
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              NFT Collectors
                            </p>
                            <p className="text-xs text-muted-foreground">
                              31 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Rooms Tab */}
              <TabsContent value="rooms">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-card border-border hover:border-electric-blue/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                          <span className="text-electric-blue text-xl">🔒</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            DeFi Builders
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Private Room
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Exclusive community for DeFi protocol developers and
                        researchers.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            47 members
                          </span>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                          <span className="text-xs text-veralux-green">
                            Active
                          </span>
                        </div>
                        <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                          Joined
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-veralux-yellow/20 rounded-lg flex items-center justify-center">
                          <span className="text-veralux-yellow text-xl">
                            🎮
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            Gaming Alpha
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Public Room
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share gaming strategies, alpha, and connect with fellow
                        Web3 gamers.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            234 members
                          </span>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                          <span className="text-xs text-veralux-green">
                            Active
                          </span>
                        </div>
                        <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                          Joined
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-veralux-green/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-veralux-green/20 rounded-lg flex items-center justify-center">
                          <span className="text-veralux-green text-xl">💎</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            NFT Collectors
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Public Room
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Discover, discuss, and trade NFTs with passionate
                        collectors.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            156 members
                          </span>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                          <span className="text-xs text-veralux-green">
                            Active
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Circles Tab */}
              <TabsContent value="circles">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-card border-border hover:border-electric-blue/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                          <span className="text-electric-blue text-xl">⚡</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            Ethereum Builders DAO
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            DAO Circle
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Decentralized community building the future of Ethereum
                        ecosystem.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            1.2K members
                          </span>
                          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                            Governance
                          </Badge>
                        </div>
                        <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                          Member
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-veralux-yellow/20 rounded-lg flex items-center justify-center">
                          <span className="text-veralux-yellow text-xl">
                            🏆
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            CryptoQuest Guild
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Gaming Guild
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Elite gaming guild competing in Web3 tournaments and
                        earning rewards.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            89 members
                          </span>
                          <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30 text-xs">
                            Champions
                          </Badge>
                        </div>
                        <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                          Member
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-veralux-green/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-veralux-green/20 rounded-lg flex items-center justify-center">
                          <span className="text-veralux-green text-xl">🌱</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            Green Web3 Initiative
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Impact DAO
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Building sustainable and environmentally conscious Web3
                        solutions.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            456 members
                          </span>
                          <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30 text-xs">
                            Impact
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Discover Tab */}
              <TabsContent value="discover">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Trending Creators
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/diverse-user-avatars.png" />
                            <AvatarFallback>VB</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Vitalik Buterin
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ethereum Foundation
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-electric-blue border-electric-blue bg-transparent"
                          >
                            Follow
                          </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/diverse-female-avatar.png" />
                            <AvatarFallback>AC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Andreessen Crypto
                            </p>
                            <p className="text-xs text-muted-foreground">
                              a16z crypto
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-electric-blue border-electric-blue bg-transparent"
                          >
                            Follow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Hot Topics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-card-foreground">
                            #EthereumUpgrade
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            12.4K
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-card-foreground">
                            #DeFiYield
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            8.7K
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-card-foreground">
                            #NFTGaming
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            6.2K
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Recommended Rooms
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-xs">
                              ⚡
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Layer 2 Builders
                            </p>
                            <p className="text-xs text-muted-foreground">
                              89 members
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-veralux-green/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-green text-xs">
                              🎨
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              NFT Artists
                            </p>
                            <p className="text-xs text-muted-foreground">
                              234 members
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
