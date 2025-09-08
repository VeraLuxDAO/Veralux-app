import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SuggestedConnections() {
  const suggestions = [
    {
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "/diverse-female-avatar.png",
      bio: "DeFi researcher & protocol designer",
      mutualConnections: 12,
      badges: ["DeFi Expert"],
    },
    {
      name: "David Park",
      username: "@davidp",
      avatar: "/developer-avatar.png",
      bio: "Smart contract auditor",
      mutualConnections: 8,
      badges: ["Security Pro"],
    },
    {
      name: "Lisa Chen",
      username: "@lisac",
      avatar: "/diverse-user-avatars.png",
      bio: "NFT artist & community builder",
      mutualConnections: 15,
      badges: ["Artist", "Creator"],
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">Suggested Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((person, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={person.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.username}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{person.bio}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {person.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{person.mutualConnections} mutual connections</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                >
                  Connect
                </Button>
              </div>
            </div>
            {index < suggestions.length - 1 && <div className="border-b border-border"></div>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
