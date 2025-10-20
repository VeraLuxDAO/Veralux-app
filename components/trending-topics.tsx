import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TrendingTopics() {
  const trendingTopics = [
    { tag: "#DeFiSummer", posts: "12.4K", trend: "Hot" },
    { tag: "#EthereumUpgrade", posts: "8.7K", trend: "Rising" },
    { tag: "#NFTGaming", posts: "6.2K", trend: "New" },
    { tag: "#Layer2", posts: "4.8K", trend: "Trending" },
    { tag: "#CrossChain", posts: "3.9K", trend: "Growing" },
  ];

  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="pb-4">
        <CardTitle
          className="font-semibold"
          style={{ color: "rgba(229, 247, 253, 0.4)", fontSize: "12px" }}
        >
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic, index) => (
          <div
            key={index}
            className="flex items-center justify-between hover:bg-muted/50 p-3 rounded cursor-pointer transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-medium text-card-foreground truncate"
                style={{ fontSize: "15px" }}
              >
                {topic.tag}
              </p>
              <p
                className="text-muted-foreground mt-1"
                style={{ fontSize: "15px" }}
              >
                {topic.posts} flows
              </p>
            </div>
            <Badge
              variant="secondary"
              className={`text-xs px-2 lg:px-2.5 py-0.5 lg:py-1 flex-shrink-0 ${
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
  );
}
