"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MarketplaceGrid } from "@/components/marketplace-grid";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { TrustedSellers } from "@/components/trusted-sellers";
import { MarketplaceStats } from "@/components/marketplace-stats";
import { useState } from "react";

export default function MarketplaceHubPage() {
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
            {/* Marketplace Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Marketplace Hub
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Trade with confidence using vetted listings and secure
                    escrow
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button className="bg-veralux-green hover:bg-veralux-green/90 text-white w-full sm:w-auto">
                    List Item
                  </Button>
                  <Button
                    variant="outline"
                    className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    My Listings
                  </Button>
                </div>
              </div>
            </div>

            {/* Marketplace Stats */}
            <MarketplaceStats />

            {/* Marketplace Tabs */}
            <Tabs defaultValue="browse" className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card border border-border max-w-full sm:max-w-lg">
                <TabsTrigger
                  value="browse"
                  className="data-[state=active]:bg-veralux-green data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Browse
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-veralux-green data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger
                  value="auctions"
                  className="data-[state=active]:bg-veralux-green data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Auctions
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-veralux-green data-[state=active]:text-white text-xs sm:text-sm"
                >
                  History
                </TabsTrigger>
              </TabsList>

              {/* Browse Tab */}
              <TabsContent value="browse">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Filters Sidebar */}
                  <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
                    <MarketplaceFilters />
                    <TrustedSellers />
                  </div>

                  {/* Main Marketplace Grid */}
                  <div className="md:col-span-2 lg:col-span-3 order-1 md:order-2">
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <Input
                          placeholder="Search items, collections, or sellers..."
                          className="flex-1 bg-input border-border text-foreground"
                        />
                        <Button
                          variant="outline"
                          className="border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent w-full sm:w-auto"
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                    <MarketplaceGrid />
                  </div>
                </div>
              </TabsContent>

              {/* Featured Tab */}
              <TabsContent value="featured">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="bg-gradient-to-br from-veralux-green/10 to-electric-blue/10 border-veralux-green/50">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Featured Collections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <Card className="bg-card border-border hover:border-veralux-green/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-veralux-green/20 to-electric-blue/20 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-4xl">🎨</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-card-foreground">
                                  Digital Art Masters
                                </h3>
                                <div className="w-4 h-4 bg-veralux-green rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Curated collection of premium digital artwork
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Floor: 2.5 ETH
                                </span>
                                <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-electric-blue/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-electric-blue/20 to-veralux-yellow/20 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-4xl">🎮</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-card-foreground">
                                  Gaming Assets Pro
                                </h3>
                                <div className="w-4 h-4 bg-veralux-green rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Rare gaming items and characters
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Floor: 1.8 ETH
                                </span>
                                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                                  Trending
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-veralux-yellow/20 to-veralux-green/20 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-4xl">💎</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-card-foreground">
                                  Luxury Collectibles
                                </h3>
                                <div className="w-4 h-4 bg-veralux-green rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                High-value luxury digital items
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Floor: 5.0 ETH
                                </span>
                                <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                                  Premium
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Auctions Tab */}
              <TabsContent value="auctions">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Live Auctions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[
                          {
                            title: "Rare CryptoQuest Sword",
                            currentBid: "3.2 ETH",
                            timeLeft: "2h 34m",
                            bidders: 12,
                            image: "⚔️",
                          },
                          {
                            title: "Digital Art Masterpiece",
                            currentBid: "5.7 ETH",
                            timeLeft: "1d 5h",
                            bidders: 8,
                            image: "🎨",
                          },
                          {
                            title: "Premium Gaming Avatar",
                            currentBid: "2.1 ETH",
                            timeLeft: "4h 12m",
                            bidders: 15,
                            image: "👤",
                          },
                        ].map((auction, index) => (
                          <Card
                            key={index}
                            className="bg-gradient-to-br from-veralux-yellow/10 to-veralux-green/10 border-veralux-yellow/50"
                          >
                            <CardContent className="p-4">
                              <div className="aspect-square bg-gradient-to-br from-veralux-yellow/20 to-veralux-green/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-4xl">
                                  {auction.image}
                                </span>
                              </div>
                              <div className="space-y-3">
                                <h3 className="font-semibold text-card-foreground">
                                  {auction.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Current Bid
                                    </p>
                                    <p className="text-lg font-bold text-veralux-green">
                                      {auction.currentBid}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                      Time Left
                                    </p>
                                    <p className="text-sm font-semibold text-veralux-yellow">
                                      {auction.timeLeft}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {auction.bidders} bidders
                                  </span>
                                  <Button
                                    size="sm"
                                    className="bg-veralux-yellow hover:bg-veralux-yellow/90 text-black"
                                  >
                                    Place Bid
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Your Transaction History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          {
                            type: "Purchase",
                            item: "Legendary Gaming Sword",
                            price: "2.5 ETH",
                            date: "2 days ago",
                            status: "Completed",
                            seller: "DragonMaster",
                          },
                          {
                            type: "Sale",
                            item: "Digital Art Collection #47",
                            price: "1.8 ETH",
                            date: "1 week ago",
                            status: "Completed",
                            seller: "ArtCollector92",
                          },
                          {
                            type: "Purchase",
                            item: "Rare NFT Avatar",
                            price: "0.9 ETH",
                            date: "2 weeks ago",
                            status: "Completed",
                            seller: "NFTCreator",
                          },
                        ].map((transaction, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                transaction.type === "Purchase"
                                  ? "bg-electric-blue/20 text-electric-blue"
                                  : "bg-veralux-green/20 text-veralux-green"
                              }`}
                            >
                              <span className="text-lg">
                                {transaction.type === "Purchase" ? "📥" : "📤"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-card-foreground">
                                  {transaction.item}
                                </h4>
                                <Badge
                                  className={`text-xs ${
                                    transaction.type === "Purchase"
                                      ? "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
                                      : "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
                                  }`}
                                >
                                  {transaction.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {transaction.type === "Purchase"
                                  ? "From"
                                  : "To"}
                                : {transaction.seller}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-card-foreground">
                                {transaction.price}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.date}
                              </p>
                            </div>
                            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">
                              {transaction.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
