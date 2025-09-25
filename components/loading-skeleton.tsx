"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
  showStats?: boolean;
}

export function LoadingSkeleton({
  className,
  lines = 3,
  showAvatar = false,
  showStats = false,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-1/3"></div>
            <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-1/2"></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {showStats && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div
                className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              ></div>
              <div
                className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CardLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("p-6 border rounded-lg bg-card animate-pulse", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-1/3"></div>
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-full"></div>
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg w-2/3"></div>
      </div>
    </div>
  );
}

export function StatsLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2 text-center">
          <div
            className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg mx-auto w-20"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
          <div
            className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg mx-auto w-16"
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
          ></div>
        </div>
      ))}
    </div>
  );
}
