"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationLayout } from "@/components/navigation-layout";
import { SocialFeed } from "@/components/social-feed";
import { TrendingTopics } from "@/components/trending-topics";
import { SuggestedConnections } from "@/components/suggested-connections";

export default function HomePage() {
  return (
    <NavigationLayout>
      <div className="max-w-full mx-auto">
        {/* Social Hub Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Social Hub
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect, share, and engage with the Web3 community
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: Tabs Layout */}
        <div className="block lg:hidden">
          <Tabs defaultValue="feed" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
              <TabsTrigger
                value="feed"
                className="data-[state=active]:bg-electric-blue data-[state=active]:text-white text-xs sm:text-sm"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-electric-blue data-[state=active]:text-white text-xs sm:text-sm"
              >
                Discover
              </TabsTrigger>
            </TabsList>

            {/* Main Feed Tab - Only the Feed */}
            <TabsContent value="feed">
              <div className="w-full max-w-2xl mx-auto">
                <SocialFeed />
              </div>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover">
              <div className="space-y-4 sm:space-y-6">
                {/* Your Activity Stats */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground text-sm">
                      Your Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-card-foreground">
                        23
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Flows Posted
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-veralux-green">
                        156
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Glows Given
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-veralux-yellow">
                        0.12 ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tips Sent
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-electric-blue">
                        892
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Connections
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Trending Topics */}
                    <TrendingTopics />

                    {/* Trending Creators */}
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
                            className="text-xs"
                          >
                            Follow
                          </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/diverse-female-avatar.png" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Sarah Miller
                            </p>
                            <p className="text-xs text-muted-foreground">
                              DeFi Researcher
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Follow
                          </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/developer-avatar.png" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              Mike Chen
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Smart Contract Dev
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Follow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Suggested Connections */}
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

                    {/* Popular Communities */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground text-sm">
                          Popular Communities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-xs">
                              🏗️
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              DeFi Builders
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1.2k members
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs">
                            Join
                          </Button>
                        </div>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-xs">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">
                              NFT Gaming
                            </p>
                            <p className="text-xs text-muted-foreground">
                              856 members
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs">
                            Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Fixed Columns Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Feed (66% - 2 out of 3 columns) */}
            <div className="col-span-2">
              <SocialFeed />
            </div>

            {/* Right Column: Discover (33% - 1 out of 3 columns) */}
            <div className="col-span-1 space-y-6">
              {/* Your Activity Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground text-sm">
                    Your Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-base font-bold text-card-foreground">
                      23
                    </div>
                    <div className="text-xs text-muted-foreground">Flows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-veralux-green">
                      156
                    </div>
                    <div className="text-xs text-muted-foreground">Glows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-veralux-yellow">
                      0.12
                    </div>
                    <div className="text-xs text-muted-foreground">ETH</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-electric-blue">
                      892
                    </div>
                    <div className="text-xs text-muted-foreground">Connect</div>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <TrendingTopics />

              {/* Trending Creators */}
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
                    <Button size="sm" variant="outline" className="text-xs">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/diverse-female-avatar.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        Sarah Miller
                      </p>
                      <p className="text-xs text-muted-foreground">
                        DeFi Researcher
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Connections */}
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
                      <span className="text-electric-blue text-xs">🔒</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        DeFi Builders
                      </p>
                      <p className="text-xs text-muted-foreground">47 online</p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                      <span className="text-veralux-yellow text-xs">🎮</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        Gaming Alpha
                      </p>
                      <p className="text-xs text-muted-foreground">23 online</p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-veralux-green/20 rounded-full flex items-center justify-center">
                      <span className="text-veralux-green text-xs">💎</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        NFT Collectors
                      </p>
                      <p className="text-xs text-muted-foreground">31 online</p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Communities */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground text-sm">
                    Popular Communities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                      <span className="text-electric-blue text-xs">🏗️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        DeFi Builders
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1.2k members
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                      <span className="text-veralux-yellow text-xs">🎮</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        NFT Gaming
                      </p>
                      <p className="text-xs text-muted-foreground">
                        856 members
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
