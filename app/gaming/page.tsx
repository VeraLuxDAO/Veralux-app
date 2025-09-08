"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { GameDiscoveryGrid } from "@/components/game-discovery-grid";
import { GuildOverview } from "@/components/guild-overview";
import { GameFilters } from "@/components/game-filters";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { AchievementsCard } from "@/components/achievements-card";
import { useState } from "react";

export default function GamingHubPage() {
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
            {/* Gaming Hub Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Gaming Hub
                  </h1>
                  <p className="text-muted-foreground">
                    Discover games, join guilds, and compete for glory
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="bg-veralux-yellow hover:bg-veralux-yellow/90 text-black">
                    Join Tournament
                  </Button>
                  <Button
                    variant="outline"
                    className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                  >
                    Create Guild
                  </Button>
                </div>
              </div>
            </div>

            {/* Gaming Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Guild Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-veralux-yellow">
                    #47
                  </div>
                  <p className="text-xs text-veralux-green">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Games Played
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    23
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across 8 titles
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-veralux-yellow">
                    156
                  </div>
                  <p className="text-xs text-veralux-green">+12 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-veralux-green">
                    2.34 ETH
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tournament rewards
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gaming Hub Tabs */}
            <Tabs defaultValue="discover" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card border border-border max-w-lg">
                <TabsTrigger
                  value="discover"
                  className="data-[state=active]:bg-veralux-yellow data-[state=active]:text-black"
                >
                  Discover
                </TabsTrigger>
                <TabsTrigger
                  value="guilds"
                  className="data-[state=active]:bg-veralux-yellow data-[state=active]:text-black"
                >
                  My Guilds
                </TabsTrigger>
                <TabsTrigger
                  value="tournaments"
                  className="data-[state=active]:bg-veralux-yellow data-[state=active]:text-black"
                >
                  Tournaments
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-veralux-yellow data-[state=active]:text-black"
                >
                  Achievements
                </TabsTrigger>
              </TabsList>

              {/* Discover Tab */}
              <TabsContent value="discover">
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Filters Sidebar */}
                  <div className="space-y-6">
                    <GameFilters />
                    <LeaderboardCard />
                  </div>

                  {/* Main Game Grid */}
                  <div className="lg:col-span-3">
                    <div className="mb-6">
                      <div className="flex items-center space-x-4">
                        <Input
                          placeholder="Search games..."
                          className="max-w-md bg-input border-border text-foreground"
                        />
                        <Button
                          variant="outline"
                          className="border-veralux-yellow text-veralux-yellow hover:bg-veralux-yellow hover:text-black bg-transparent"
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                    <GameDiscoveryGrid />
                  </div>
                </div>
              </TabsContent>

              {/* Guilds Tab */}
              <TabsContent value="guilds">
                <GuildOverview />
              </TabsContent>

              {/* Tournaments Tab */}
              <TabsContent value="tournaments">
                <div className="space-y-6">
                  {/* Active Tournaments */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Active Tournaments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-veralux-yellow/20 to-veralux-green/20 border-veralux-yellow/50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-veralux-yellow/30 rounded-lg flex items-center justify-center">
                                <span className="text-veralux-yellow text-lg">
                                  🏆
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">
                                  CryptoQuest Championship
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Ends in 2 days
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Prize Pool
                                </span>
                                <span className="font-semibold text-veralux-green">
                                  50 ETH
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Participants
                                </span>
                                <span className="font-semibold text-card-foreground">
                                  1,247
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-veralux-yellow hover:bg-veralux-yellow/90 text-black"
                              >
                                Join Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-electric-blue/20 to-veralux-green/20 border-electric-blue/50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-electric-blue/30 rounded-lg flex items-center justify-center">
                                <span className="text-electric-blue text-lg">
                                  ⚔️
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">
                                  DeFi Warriors Arena
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Ends in 5 days
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Prize Pool
                                </span>
                                <span className="font-semibold text-veralux-green">
                                  25 ETH
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Participants
                                </span>
                                <span className="font-semibold text-card-foreground">
                                  892
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white"
                              >
                                Join Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-veralux-green/20 to-electric-blue/20 border-veralux-green/50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-veralux-green/30 rounded-lg flex items-center justify-center">
                                <span className="text-veralux-green text-lg">
                                  🎯
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">
                                  NFT Racing League
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Ends in 1 week
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Prize Pool
                                </span>
                                <span className="font-semibold text-veralux-green">
                                  15 ETH
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Participants
                                </span>
                                <span className="font-semibold text-card-foreground">
                                  456
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-veralux-green hover:bg-veralux-green/90 text-white"
                              >
                                Join Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tournament History */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Your Tournament History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                          <div className="w-12 h-12 bg-veralux-yellow/20 rounded-lg flex items-center justify-center">
                            <span className="text-veralux-yellow text-xl">
                              🥇
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-card-foreground">
                              CryptoQuest Spring Championship
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              1st Place • Won 5.2 ETH
                            </p>
                          </div>
                          <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                            Champion
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                          <div className="w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                            <span className="text-electric-blue text-xl">
                              🥈
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-card-foreground">
                              DeFi Warriors Winter Cup
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              2nd Place • Won 2.1 ETH
                            </p>
                          </div>
                          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                            Runner-up
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <AchievementsCard />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
