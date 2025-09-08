import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function AchievementsCard() {
  const achievements = [
    {
      title: "First Victory",
      description: "Win your first tournament",
      icon: "🏆",
      earned: true,
      rarity: "Common",
      progress: 100,
    },
    {
      title: "Guild Master",
      description: "Lead a guild to top 5 ranking",
      icon: "👑",
      earned: true,
      rarity: "Legendary",
      progress: 100,
    },
    {
      title: "High Roller",
      description: "Earn 100+ ETH in tournaments",
      icon: "💎",
      earned: true,
      rarity: "Epic",
      progress: 100,
    },
    {
      title: "Speed Demon",
      description: "Win 10 racing tournaments",
      icon: "🏎️",
      earned: false,
      rarity: "Rare",
      progress: 70,
    },
    {
      title: "Social Butterfly",
      description: "Connect with 1000+ players",
      icon: "🦋",
      earned: false,
      rarity: "Uncommon",
      progress: 45,
    },
    {
      title: "Crypto Whale",
      description: "Earn 1000+ ETH total",
      icon: "🐋",
      earned: false,
      rarity: "Mythic",
      progress: 23,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-muted text-muted-foreground"
      case "Uncommon":
        return "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
      case "Rare":
        return "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
      case "Epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Legendary":
        return "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
      case "Mythic":
        return "bg-gradient-to-r from-veralux-yellow to-veralux-green text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-veralux-yellow mb-1">156</div>
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-veralux-green mb-1">23</div>
            <p className="text-sm text-muted-foreground">Rare+</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-electric-blue mb-1">87%</div>
            <p className="text-sm text-muted-foreground">Completion</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">#47</div>
            <p className="text-sm text-muted-foreground">Global Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`border transition-all ${
              achievement.earned
                ? "bg-gradient-to-br from-veralux-yellow/10 to-veralux-green/10 border-veralux-yellow/50"
                : "bg-card border-border opacity-75"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    achievement.earned ? "bg-veralux-yellow/20" : "bg-muted"
                  }`}
                >
                  {achievement.earned ? achievement.icon : "🔒"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3
                      className={`font-semibold ${
                        achievement.earned ? "text-card-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      achievement.earned ? "text-muted-foreground" : "text-muted-foreground/70"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {!achievement.earned && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-semibold text-card-foreground">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
