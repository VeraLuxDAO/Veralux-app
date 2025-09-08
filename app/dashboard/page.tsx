import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WalletDemo } from "@/components/wallet-demo";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <DashboardNav />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, Alex
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening in your Web3 world today
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Reputation Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-veralux-green">
                    8,547
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-electric-blue">
                    2.47 SUI
                  </div>
                  <p className="text-xs text-muted-foreground">$4,234.56 USD</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Flows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-veralux-yellow">
                    23
                  </div>
                  <p className="text-xs text-muted-foreground">+5 new today</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Guild Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">#47</div>
                  <p className="text-xs text-muted-foreground">
                    Top 5% globally
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">
                      Recent Activity Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Feed Item 1 */}
                    <div className="flex space-x-3 p-4 rounded-lg bg-muted/50">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/diverse-user-avatars.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-card-foreground">
                            John Doe
                          </span>
                          <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">
                            Verified Dev
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            2h ago
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Just deployed a new smart contract for cross-chain NFT
                          transfers. The future is interoperable!
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-veralux-green transition-colors">
                            <span>⚡</span>
                            <span>24 Glows</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-veralux-yellow transition-colors">
                            <span>💰</span>
                            <span>5 Tips</span>
                          </button>
                          <button className="hover:text-electric-blue transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Feed Item 2 */}
                    <div className="flex space-x-3 p-4 rounded-lg bg-muted/50">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/diverse-female-avatar.png" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-card-foreground">
                            Sarah Miller
                          </span>
                          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                            Gaming Pro
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            4h ago
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Our guild just won the championship in CryptoQuest!
                          Amazing teamwork from everyone 🏆
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-veralux-green transition-colors">
                            <span>⚡</span>
                            <span>67 Glows</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-veralux-yellow transition-colors">
                            <span>💰</span>
                            <span>12 Tips</span>
                          </button>
                          <button className="hover:text-electric-blue transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Feed Item 3 */}
                    <div className="flex space-x-3 p-4 rounded-lg bg-muted/50">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/developer-avatar.png" />
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-card-foreground">
                            Mike Kim
                          </span>
                          <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                            Trader
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            6h ago
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Market analysis: DeFi tokens showing strong momentum.
                          Perfect time for strategic positions.
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-veralux-green transition-colors">
                            <span>⚡</span>
                            <span>31 Glows</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-veralux-yellow transition-colors">
                            <span>💰</span>
                            <span>8 Tips</span>
                          </button>
                          <button className="hover:text-electric-blue transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white">
                      Create New Flow
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
                    >
                      Join Gaming Session
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-veralux-yellow text-veralux-yellow hover:bg-veralux-yellow hover:text-black bg-transparent"
                    >
                      Browse Marketplace
                    </Button>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">
                      Trending in Web3
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">
                        #DeFiSummer
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Hot
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">
                        #NFTGaming
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Rising
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">
                        #CrossChain
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">
                        #DAOGovernance
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Trending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Demo */}
                <WalletDemo />

                {/* Reputation Breakdown */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">
                      Reputation Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Social Engagement
                      </span>
                      <span className="text-sm font-semibold text-veralux-green">
                        2,847
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gaming Achievements
                      </span>
                      <span className="text-sm font-semibold text-veralux-yellow">
                        1,923
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Trading History
                      </span>
                      <span className="text-sm font-semibold text-electric-blue">
                        2,156
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Development
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        1,621
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-sm text-card-foreground">
                        Total Score
                      </span>
                      <span className="text-sm text-veralux-green">8,547</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
