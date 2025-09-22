import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FlowPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badges: string[];
  };
  content: string;
  timestamp: string;
  glows: number;
  tips: number;
  replies: number;
  hasGlowed: boolean;
  hasTipped: boolean;
  tags: string[];
}

interface PostCardProps {
  post: FlowPost;
  onGlow: (postId: string) => void;
  onTip: (postId: string) => void;
}

export const PostCard = memo<PostCardProps>(({ post, onGlow, onTip }) => {
  return (
    <Card className="bg-card border-border mx-2 sm:mx-0">
      <CardContent className="p-3 sm:p-6">
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-3 sm:mb-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-card-foreground text-sm sm:text-base truncate">
                {post.author.name}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                {post.author.username}
              </span>
              {post.author.verified && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-veralux-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                •
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {post.timestamp}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              {post.author.badges.map((badge, index) => (
                <Badge
                  key={index}
                  className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-3 sm:mb-4">
          <p className="text-card-foreground whitespace-pre-line leading-relaxed text-sm sm:text-base">
            {post.content}
          </p>
        </div>

        {/* Post Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGlow(post.id)}
              className={`flex items-center space-x-1 min-h-8 px-2 ${
                post.hasGlowed
                  ? "text-veralux-green hover:text-veralux-green/80"
                  : "text-muted-foreground hover:text-veralux-green"
              }`}
            >
              <span className="text-sm sm:text-lg">⚡</span>
              <span className="text-xs sm:text-sm font-medium">
                {post.glows}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTip(post.id)}
              className={`flex items-center space-x-1 min-h-8 px-2 ${
                post.hasTipped
                  ? "text-veralux-yellow hover:text-veralux-yellow/80"
                  : "text-muted-foreground hover:text-veralux-yellow"
              }`}
            >
              <span className="text-sm sm:text-lg">💰</span>
              <span className="text-xs sm:text-sm font-medium">
                {post.tips}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 min-h-8 px-2 text-muted-foreground hover:text-electric-blue"
            >
              <span className="text-sm sm:text-lg">💬</span>
              <span className="text-xs sm:text-sm font-medium">
                {post.replies}
              </span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 min-h-8 px-2 text-muted-foreground hover:text-electric-blue"
          >
            <span className="text-sm sm:text-lg">🔗</span>
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              Share
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";
