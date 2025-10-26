import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LeaderboardCard() {
  const leaderboard = [
    {
      rank: 1,
      name: "DragonSlayer",
      guild: "CryptoQuest Guild",
      score: "15,847",
      avatar: "/diverse-user-avatars.png",
    },
    {
      rank: 2,
      name: "DeFiMaster",
      guild: "Warriors Alliance",
      score: "14,923",
      avatar: "/diverse-female-avatar.png",
    },
    {
      rank: 3,
      name: "SpeedRacer",
      guild: "Racing Legends",
      score: "13,756",
      avatar: "/developer-avatar.png",
    },
    {
      rank: 4,
      name: "AlexChen",
      guild: "Elite Builders",
      score: "12,834",
      avatar: "/user-profile-illustration.png",
    },
  ];

  return (
    <Card
      className="border-none"
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.map((player) => (
          <div key={player.rank} className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                player.rank === 1
                  ? "bg-veralux-yellow text-black"
                  : player.rank === 2
                  ? "bg-muted text-muted-foreground"
                  : player.rank === 3
                  ? "bg-veralux-green/20 text-veralux-green"
                  : "bg-electric-blue/20 text-electric-blue"
              }`}
            >
              {player.rank}
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src={player.avatar || "/placeholder.svg"} />
              <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {player.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {player.guild}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-veralux-yellow">
                {player.score}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
