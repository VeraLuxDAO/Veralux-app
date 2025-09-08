import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProfileAnalytics() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">12,847</div>
            <p className="text-xs text-veralux-green">+23% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">8.4%</div>
            <p className="text-xs text-veralux-green">+1.2% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flow Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">45.2K</div>
            <p className="text-xs text-veralux-yellow">+15% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">+127</div>
            <p className="text-xs text-veralux-green">New connections</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
                  <span className="text-sm text-card-foreground">Social Hub</span>
                </div>
                <span className="text-sm font-semibold text-card-foreground">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-veralux-yellow rounded-full"></div>
                  <span className="text-sm text-card-foreground">Gaming Hub</span>
                </div>
                <span className="text-sm font-semibold text-card-foreground">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-veralux-green rounded-full"></div>
                  <span className="text-sm text-card-foreground">Marketplace</span>
                </div>
                <span className="text-sm font-semibold text-card-foreground">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-foreground rounded-full"></div>
                  <span className="text-sm text-card-foreground">Dev Hub</span>
                </div>
                <span className="text-sm font-semibold text-card-foreground">9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Top Performing Flows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">DeFi Yield Farming Guide</p>
                <p className="text-xs text-muted-foreground">2.4K views • 89 glows</p>
              </div>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Viral</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Smart Contract Security Tips</p>
                <p className="text-xs text-muted-foreground">1.8K views • 67 glows</p>
              </div>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Trending</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">NFT Marketplace Analysis</p>
                <p className="text-xs text-muted-foreground">1.2K views • 45 glows</p>
              </div>
              <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">Popular</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Top Interests</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">DeFi</Badge>
                <Badge variant="secondary">Smart Contracts</Badge>
                <Badge variant="secondary">NFTs</Badge>
                <Badge variant="secondary">Web3 Development</Badge>
                <Badge variant="secondary">Gaming</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Geographic Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">North America</span>
                  <span className="text-sm font-semibold text-card-foreground">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Europe</span>
                  <span className="text-sm font-semibold text-card-foreground">31%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Asia</span>
                  <span className="text-sm font-semibold text-card-foreground">19%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Other</span>
                  <span className="text-sm font-semibold text-card-foreground">8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Follower Growth</span>
                <span className="text-sm font-semibold text-veralux-green">+12.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement Growth</span>
                <span className="text-sm font-semibold text-veralux-green">+8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reputation Growth</span>
                <span className="text-sm font-semibold text-veralux-green">+15.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Expansion</span>
                <span className="text-sm font-semibold text-veralux-yellow">+23.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
