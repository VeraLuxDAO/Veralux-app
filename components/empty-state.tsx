"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 space-y-4",
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-2 transition-all duration-300 hover:scale-110">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {description}
        </p>
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          className="mt-4 transition-all duration-300 hover:scale-105"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function TokenEmptyState({ onAddToken }: { onAddToken: () => void }) {
  return (
    <EmptyState
      title="No Tokens Yet"
      description="Start building your portfolio by adding your first token. Track your investments and see your portfolio grow over time."
      action={{
        label: "Add Your First Token",
        onClick: onAddToken,
      }}
      className="py-12"
    />
  );
}

export function BadgeEmptyState({ className }: { className?: string }) {
  return (
    <EmptyState
      title="No Badges Earned"
      description="Complete challenges and participate in the community to earn your first badges. Show off your achievements and unlock special perks."
      className={cn("py-12", className)}
    />
  );
}

export function NFTEmptyState({ className }: { className?: string }) {
  return (
    <EmptyState
      title="No NFTs in Collection"
      description="Your NFT collection is waiting to be filled. Discover, create, or trade NFTs to build your unique digital asset portfolio."
      className={cn("py-12", className)}
    />
  );
}

