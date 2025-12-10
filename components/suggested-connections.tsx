import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CirclePlus } from "lucide-react";

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
  ];

  return (
    <Card className="bg-transparent border-none py-0 md:py-4">
      <CardHeader className="md:px-3">
        <CardTitle
          className="font-semibold"
          style={{ color: "rgba(229, 247, 253, 0.4)", fontSize: "12px", paddingRight:"0px !important" }}
        >
          Suggested Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-[10px] md:space-y-5 px-0 md:px-3 pt-0 md:pt-6">
        {suggestions.map((person, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start md:gap-3 gap-6">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarImage src={person.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-sm">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p
                    className="font-medium text-card-foreground truncate"
                    style={{ fontSize: "15px" }}
                  >
                    {person.name}
                  </p>
                  <p
                    className="truncate"
                    style={{ fontSize: "15px", color: "#9BB6CC" }}
                  >
                    {person.username}
                  </p>
                </div>
                <p
                  className="mb-3 line-clamp-2"
                  style={{ fontSize: "15px", color: "#9BB6CC" }}
                >
                  {person.bio}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {person.badges.map((badge, badgeIndex) => (
                    <Badge
                      key={badgeIndex}
                      variant="secondary"
                      className="px-2 py-1 bg-[rgba(155,182,204,0.08)] rounded-[10px]"
                      style={{ fontSize: "15px" }}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
                <p
                  className="mb-3"
                  style={{ fontSize: "15px", color: "#9BB6CC" }}
                >
                  {person.mutualConnections} mutual connections
                </p>
                <button
                  className="w-full h-8 flex items-center justify-center gap-2 px-4 py-1 rounded-full transition-colors hover:bg-opacity-80"
                  style={{
                    fontSize: "15px",
                    backgroundColor: "rgba(155, 182, 204, 0.06)",
                    border: "1px solid rgba(155, 182, 204, 0.1)",
                  }}
                >
                  <CirclePlus className="w-4 h-4" />
                  Connect
                </button>
              </div>
            </div>
            {index < suggestions.length - 1 && (
              <div className="border-b border-border"></div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
