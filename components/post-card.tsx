"use client";

import { memo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card
      className="border-none transition-all duration-200 rounded-xl shadow-lg w-full"
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
      }}
    >
      <CardContent className="p-4 sm:p-5 md:py-0.5 md:px-3">
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-6">
          <Avatar className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-sm">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm sm:text-base">
                {post.author.name}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                {post.author.username}
              </span>
              {post.author.verified && isMounted && (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "rgba(250, 222, 253, 1)" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-xs sm:text-sm text-gray-500">
                • {post.timestamp}
              </span>
            </div>
            {post.author.badges.length > 0 && (
              <div className="mt-1">
                <Badge
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "rgba(250, 222, 253, 0.1)",
                    color: "rgba(250, 222, 253, 1)",
                    border: "1px solid rgba(250, 222, 253, 0.2)",
                  }}
                >
                  {post.author.badges[0]}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-gray-100 whitespace-pre-line leading-relaxed text-base sm:text-[17px]">
            {post.content}
          </p>
        </div>

        {/* Post Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 mt-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors"
                style={{
                  backgroundColor: "rgba(31, 43, 49, 0.56)",
                  color: "rgb(137, 167, 193)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onGlow(post.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isMounted && (
                <svg
                  className="w-5 h-5"
                  style={{ color: "rgba(250, 222, 253, 1)" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>
              )}
              <span
                className="text-base font-medium"
                style={{ color: "rgba(155, 182, 204, 1)" }}
              >
                {post.glows}
              </span>
            </button>

            <button
              onClick={() => onTip(post.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isMounted && (
                <svg
                  className="w-5 h-5"
                  style={{ color: "rgba(250, 222, 253, 1)" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span
                className="text-base font-medium"
                style={{ color: "rgba(155, 182, 204, 1)" }}
              >
                {post.tips}
              </span>
            </button>

            <button className="flex items-center gap-2 cursor-pointer">
              {isMounted && (
                <svg
                  className="w-5 h-5"
                  style={{ color: "rgba(250, 222, 253, 1)" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span
                className="text-base font-medium"
                style={{ color: "rgba(155, 182, 204, 1)" }}
              >
                {post.replies}
              </span>
            </button>
          </div>

          <button className="flex items-center gap-2 cursor-pointer">
            {isMounted && (
              <svg
                className="w-5 h-5"
                style={{ color: "rgba(250, 222, 253, 1)" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span
              className="text-base font-medium"
              style={{ color: "rgba(155, 182, 204, 1)" }}
            >
              Share
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";
