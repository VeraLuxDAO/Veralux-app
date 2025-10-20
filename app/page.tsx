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
    <NavigationLayout
      className="bg-background"
      header={
        /* Social Hub Header - Between Top Nav and Main Content */
        <div className="w-full  py-6 md:py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4">
              Social Hub
            </h1>
            {/* Activity Stats Inline - Compact Design */}
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: "10px" }}
            >
              <div
                className="flex items-center gap-1.5 rounded-md"
                style={{
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "rgba(155, 182, 204, 0.08)",
                }}
              >
                <span className="text-base md:text-lg font-bold text-white">
                  23
                </span>
                <span className="text-xs md:text-sm text-gray-400">Flows</span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-md"
                style={{
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "rgba(155, 182, 204, 0.08)",
                }}
              >
                <span className="text-base md:text-lg font-bold text-orange-700">
                  156
                </span>
                <span className="text-xs md:text-sm text-gray-400">Glows</span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-md"
                style={{
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "rgba(155, 182, 204, 0.08)",
                }}
              >
                <span className="text-base md:text-lg font-bold text-teal-700">
                  0.12
                </span>
                <span className="text-xs md:text-sm text-gray-400">ETH</span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-md"
                style={{
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "rgba(155, 182, 204, 0.08)",
                }}
              >
                <span className="text-base md:text-lg font-bold text-slate-300">
                  892
                </span>
                <span className="text-xs md:text-sm text-gray-400">
                  Connect
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {/* Content Container - Constrained width with proper margins */}
      <div className="w-full max-w-[1600px] mx-auto">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Trending Topics */}
                    <TrendingTopics />

                    {/* Trending Creators */}
                    <Card className="bg-transparent border-none">
                      <CardHeader className="pb-4">
                        <CardTitle
                          className="font-semibold"
                          style={{
                            color: "rgba(229, 247, 253, 0.4)",
                            fontSize: "12px",
                          }}
                        >
                          Trending Creators
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/diverse-user-avatars.png" />
                            <AvatarFallback>VB</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              Vitalik Buterin
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              Ethereum Foundation
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/diverse-female-avatar.png" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              Sarah Miller
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              DeFi Researcher
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/developer-avatar.png" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              Mike Chen
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              Smart Contract Dev
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Suggested Connections */}
                    <SuggestedConnections />

                    {/* Active Rooms */}
                    <Card className="bg-transparent border-none">
                      <CardHeader className="pb-4">
                        <CardTitle
                          className="font-semibold"
                          style={{
                            color: "rgba(229, 247, 253, 0.4)",
                            fontSize: "12px",
                          }}
                        >
                          Active Rooms
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-sm">
                              🔒
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              DeFi Builders
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              47 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-sm">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              Gaming Alpha
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              23 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-green/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-green text-sm">
                              💎
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              NFT Collectors
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              31 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Communities */}
                    <Card className="bg-transparent border-none">
                      <CardHeader className="pb-4">
                        <CardTitle
                          className="font-semibold"
                          style={{
                            color: "rgba(229, 247, 253, 0.4)",
                            fontSize: "12px",
                          }}
                        >
                          Popular Communities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-sm">
                              🏗️
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              DeFi Builders
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              1.2k members
                            </p>
                          </div>
                          <button
                            className="flex items-center justify-center rounded-[10px] transition-all"
                            style={{
                              width: "63.88px",
                              height: "32px",
                              backgroundColor: "rgba(250, 222, 253, 1)",
                              border: "1px solid rgba(0, 20, 37, 1)",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#000",
                            }}
                          >
                            Join
                          </button>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-sm">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="font-medium text-card-foreground"
                              style={{ fontSize: "15px" }}
                            >
                              NFT Gaming
                            </p>
                            <p
                              className="text-muted-foreground mt-1"
                              style={{ fontSize: "15px" }}
                            >
                              856 members
                            </p>
                          </div>
                          <button
                            className="flex items-center justify-center rounded-[10px] transition-all"
                            style={{
                              width: "63.88px",
                              height: "32px",
                              backgroundColor: "rgba(250, 222, 253, 1)",
                              border: "1px solid rgba(0, 20, 37, 1)",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#000",
                            }}
                          >
                            Join
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Equal 70px gaps on left and right */}
        <div className="hidden lg:block">
          <div className="flex gap-[70px] w-full">
            {/* Left Column: Feed - Grows to fill available space */}
            <div className="flex-1 min-w-0 max-w-full">
              <SocialFeed />
            </div>

            {/* Right Column: Sidebar - Responsive width */}
            <div className="space-y-6 w-[300px] xl:w-[340px] 2xl:w-[380px] flex-shrink-0">
              {/* Trending Topics */}
              <TrendingTopics />

              {/* Trending Creators */}
              <Card className="bg-transparent border-none">
                <CardHeader className="pb-4">
                  <CardTitle
                    className="font-semibold"
                    style={{
                      color: "rgba(229, 247, 253, 0.4)",
                      fontSize: "12px",
                    }}
                  >
                    Trending Creators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback>VB</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        Vitalik Buterin
                      </p>
                      <p
                        className="text-muted-foreground truncate mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        Ethereum Foundation
                      </p>
                    </div>
                    <button className="flex items-center justify-center w-[60px] lg:w-[65px] xl:w-[68px] h-8 lg:h-9 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs lg:text-sm font-medium text-black hover:bg-[#FADEFD]/90 transition-all flex-shrink-0">
                      Follow
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/diverse-female-avatar.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        Sarah Miller
                      </p>
                      <p
                        className="text-muted-foreground truncate mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        DeFi Researcher
                      </p>
                    </div>
                    <button className="flex items-center justify-center w-[60px] lg:w-[65px] xl:w-[68px] h-8 lg:h-9 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs lg:text-sm font-medium text-black hover:bg-[#FADEFD]/90 transition-all flex-shrink-0">
                      Follow
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <SuggestedConnections />

              {/* Active Rooms */}
              <Card className="bg-transparent border-none">
                <CardHeader className="pb-4">
                  <CardTitle
                    className="font-semibold"
                    style={{
                      color: "rgba(229, 247, 253, 0.4)",
                      fontSize: "12px",
                    }}
                  >
                    Active Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-blue text-sm">🔒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        DeFi Builders
                      </p>
                      <p
                        className="text-muted-foreground mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        47 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-yellow text-sm">🎮</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        Gaming Alpha
                      </p>
                      <p
                        className="text-muted-foreground mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        23 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-green text-sm">💎</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        NFT Collectors
                      </p>
                      <p
                        className="text-muted-foreground mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        31 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Communities */}
              <Card className="bg-transparent border-none">
                <CardHeader className="pb-4">
                  <CardTitle
                    className="font-semibold"
                    style={{
                      color: "rgba(229, 247, 253, 0.4)",
                      fontSize: "12px",
                    }}
                  >
                    Popular Communities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-blue text-sm">🏗️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        DeFi Builders
                      </p>
                      <p
                        className="text-muted-foreground mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        1.2k members
                      </p>
                    </div>
                    <button
                      className="flex items-center justify-center rounded-[10px] transition-all flex-shrink-0"
                      style={{
                        width: "63.88px",
                        height: "32px",
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        border: "1px solid rgba(0, 20, 37, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#000",
                      }}
                    >
                      Join
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-yellow text-sm">🎮</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-card-foreground truncate"
                        style={{ fontSize: "15px" }}
                      >
                        NFT Gaming
                      </p>
                      <p
                        className="text-muted-foreground mt-1"
                        style={{ fontSize: "15px" }}
                      >
                        856 members
                      </p>
                    </div>
                    <button
                      className="flex items-center justify-center rounded-[10px] transition-all flex-shrink-0"
                      style={{
                        width: "63.88px",
                        height: "32px",
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        border: "1px solid rgba(0, 20, 37, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#000",
                      }}
                    >
                      Join
                    </button>
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
