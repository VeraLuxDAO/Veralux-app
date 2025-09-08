import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ProfileNFTCustomizer } from "@/components/profile-nft-customizer";
import { ProfileSkills } from "@/components/profile-skills";
import { ProfileAnalytics } from "@/components/profile-analytics";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-scroll h-[calc(100vh-4rem)]">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="mb-8">
              <Card className="profile-header-card border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 profile-avatar-border">
                        <AvatarImage src="/user-profile-illustration.png" />
                        <AvatarFallback className="profile-avatar-fallback">
                          AC
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-veralux-green rounded-full flex items-center justify-center profile-verification-badge">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold profile-name">
                          Alex Chen
                        </h1>
                        <Badge className="profile-badge profile-badge-verified">
                          Verified
                        </Badge>
                        <Badge className="profile-badge profile-badge-pro">
                          Pro Member
                        </Badge>
                      </div>
                      <p className="profile-description mb-4">
                        Full-stack developer passionate about DeFi and NFT
                        innovation. Building the future of Web3.
                      </p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <span className="profile-stat-label">
                            Reputation Score
                          </span>
                          <div className="text-xl font-bold profile-stat-value">
                            8,547
                          </div>
                        </div>
                        <div>
                          <span className="profile-stat-label">
                            Member Since
                          </span>
                          <div className="text-xl font-bold profile-stat-value">
                            Jan 2024
                          </div>
                        </div>
                        <div>
                          <span className="profile-stat-label">
                            Communities
                          </span>
                          <div className="text-xl font-bold profile-stat-value">
                            12
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button className="profile-edit-button">
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="profile-share-button"
                      >
                        Share Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 profile-tabs-list">
                <TabsTrigger
                  value="about"
                  className="profile-tab-trigger data-[state=active]:profile-tab-active"
                >
                  About Me
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="profile-tab-trigger data-[state=active]:profile-tab-active"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="reputation"
                  className="profile-tab-trigger data-[state=active]:profile-tab-active"
                >
                  Reputation
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="profile-tab-trigger data-[state=active]:profile-tab-active"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* About Me Tab */}
              <TabsContent value="about" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* NFT Profile Customizer */}
                    <ProfileNFTCustomizer />

                    {/* Bio & Details */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground">
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-card-foreground mb-2">
                            Bio
                          </h4>
                          <p className="text-muted-foreground">
                            Passionate full-stack developer with 5+ years of
                            experience in blockchain technology. I specialize in
                            smart contract development, DeFi protocols, and NFT
                            marketplaces. Always excited to collaborate on
                            innovative Web3 projects.
                          </p>
                        </div>
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2">
                              Location
                            </h4>
                            <p className="text-muted-foreground">
                              San Francisco, CA
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2">
                              Website
                            </h4>
                            <p className="text-electric-blue">alexchen.dev</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2">
                              Twitter
                            </h4>
                            <p className="text-electric-blue">@alexchen_dev</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2">
                              GitHub
                            </h4>
                            <p className="text-electric-blue">
                              github.com/alexchen
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground">
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total Flows
                          </span>
                          <span className="font-semibold text-card-foreground">
                            247
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Glows Received
                          </span>
                          <span className="font-semibold text-veralux-green">
                            1,834
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Tips Earned
                          </span>
                          <span className="font-semibold text-veralux-yellow">
                            0.47 ETH
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Followers
                          </span>
                          <span className="font-semibold text-card-foreground">
                            892
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Following
                          </span>
                          <span className="font-semibold text-card-foreground">
                            234
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Achievements */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground">
                          Recent Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-sm">
                              🏆
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">
                              Top Contributor
                            </p>
                            <p className="text-xs text-muted-foreground">
                              DeFi Builders Community
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-veralux-green/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-green text-sm">
                              ⚡
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">
                              100 Glows Milestone
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Social Hub
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-sm">
                              🎮
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">
                              Guild Champion
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Gaming Hub
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                <ProfileSkills />
              </TabsContent>

              {/* Reputation Tab */}
              <TabsContent value="reputation" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Reputation Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-card-foreground">
                            Social Engagement
                          </span>
                          <span className="text-sm font-semibold text-veralux-green">
                            2,847
                          </span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-card-foreground">
                            Gaming Achievements
                          </span>
                          <span className="text-sm font-semibold text-veralux-yellow">
                            1,923
                          </span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-card-foreground">
                            Trading History
                          </span>
                          <span className="text-sm font-semibold text-electric-blue">
                            2,156
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-card-foreground">
                            Development
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            1,621
                          </span>
                        </div>
                        <Progress value={55} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Reputation History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-card-foreground">
                            +125 Social Points
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Viral Flow in DeFi Community
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          2h ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-veralux-yellow rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-card-foreground">
                            +89 Gaming Points
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Guild Tournament Victory
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          1d ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-card-foreground">
                            +67 Trading Points
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Successful NFT Trade
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          3d ago
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <ProfileAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
