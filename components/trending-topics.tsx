import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TrendingTopics() {
  const trendingTopics = [
    { tag: "#DeFiSummer", posts: "12.4K", trend: "Hot" },
    { tag: "#EthereumUpgrade", posts: "8.7K", trend: "Rising" },
    { tag: "#NFTGaming", posts: "6.2K", trend: "New" },
    { tag: "#Layer2", posts: "4.8K", trend: "Trending" },
    { tag: "#CrossChain", posts: "3.9K", trend: "Growing" },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">Trending Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded cursor-pointer">
            <div>
              <p className="text-sm font-medium text-card-foreground">{topic.tag}</p>
              <p className="text-xs text-muted-foreground">{topic.posts} flows</p>
            </div>
            <Badge
              variant="secondary"
              className={`text-xs ${
                topic.trend === "Hot"
                  ? "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
                  : topic.trend === "Rising"
                    ? "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
                    : "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
              }`}
            >
              {topic.trend}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
