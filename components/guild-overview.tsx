import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function GuildOverview() {
  return (
    <div className="space-y-6">
      {/* My Primary Guild */}
      <Card className="bg-gradient-to-br from-veralux-yellow/10 to-veralux-green/10 border-veralux-yellow/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">CryptoQuest Guild Alpha</CardTitle>
            <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">Leader</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Guild Stats */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Guild Rank</p>
                <p className="text-2xl font-bold text-veralux-yellow">#3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-xl font-semibold text-card-foreground">47/50</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-xl font-semibold text-veralux-green">234.7 ETH</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                  <p className="text-sm text-muted-foreground">Won CryptoQuest Tournament</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-veralux-yellow rounded-full"></div>
                  <p className="text-sm text-muted-foreground">3 new members joined</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  <p className="text-sm text-muted-foreground">Ranked up to #3</p>
                </div>
              </div>
            </div>

            {/* Guild Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-veralux-yellow hover:bg-veralux-yellow/90 text-black">Manage Guild</Button>
              <Button
                variant="outline"
                className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
              >
                View Members
              </Button>
              <Button
                variant="outline"
                className="w-full border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
              >
                Guild Chat
              </Button>
            </div>
          </div>

          {/* Guild Members Preview */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Top Members</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Sarah Miller", role: "Co-Leader", score: "8,947", avatar: "/diverse-female-avatar.png" },
                { name: "Mike Kim", role: "Strategist", score: "7,823", avatar: "/developer-avatar.png" },
                { name: "Emma Wilson", role: "Scout", score: "6,756", avatar: "/diverse-user-avatars.png" },
              ].map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card/50">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-veralux-yellow">{member.score}</p>
                    <div className="w-2 h-2 bg-veralux-green rounded-full ml-auto mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Guilds */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-base">DeFi Warriors Alliance</CardTitle>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Member</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rank</span>
              <span className="font-semibold text-electric-blue">#7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Members</span>
              <span className="font-semibold text-card-foreground">89/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Contribution</span>
              <span className="font-semibold text-veralux-green">12.4 ETH</span>
            </div>
            <Button
              variant="outline"
              className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
            >
              View Guild
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-base">NFT Racing Legends</CardTitle>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Member</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rank</span>
              <span className="font-semibold text-veralux-green">#12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Members</span>
              <span className="font-semibold text-card-foreground">34/50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Contribution</span>
              <span className="font-semibold text-veralux-green">8.7 ETH</span>
            </div>
            <Button
              variant="outline"
              className="w-full border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
            >
              View Guild
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
