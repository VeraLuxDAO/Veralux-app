"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hash,
  Volume2,
  Lock,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  isPrivate: boolean;
  unreadCount?: number;
  isActive?: boolean;
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
  isCollapsed?: boolean;
}

interface ChannelSidebarProps {
  categories: ChannelCategory[];
  activeChannelId?: string;
  onChannelSelect: (channelId: string) => void;
  onCategoryToggle: (categoryId: string) => void;
  className?: string;
}

export function ChannelSidebar({
  categories,
  activeChannelId,
  onChannelSelect,
  onCategoryToggle,
  className,
}: ChannelSidebarProps) {
  const ChannelItem = ({ channel }: { channel: Channel }) => {
    const isActive = channel.id === activeChannelId;

    return (
      <Button
        variant="ghost"
        onClick={() => onChannelSelect(channel.id)}
        className={cn(
          "w-full justify-start h-8 px-2 text-sm font-normal",
          "hover:bg-muted/50 transition-colors",
          isActive && "bg-muted text-foreground font-medium"
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Channel Icon */}
          {channel.type === "text" ? (
            <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}

          {/* Channel Name */}
          <span className="truncate flex-1 text-left">{channel.name}</span>

          {/* Private Channel Indicator */}
          {channel.isPrivate && (
            <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}

          {/* Unread Badge */}
          {channel.unreadCount && channel.unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs h-5 px-1.5 flex-shrink-0">
              {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
            </Badge>
          )}
        </div>
      </Button>
    );
  };

  const CategoryHeader = ({ category }: { category: ChannelCategory }) => (
    <Button
      variant="ghost"
      onClick={() => onCategoryToggle(category.id)}
      className="w-full justify-start h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider"
    >
      <div className="flex items-center gap-1">
        {category.isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        <span>{category.name}</span>
      </div>
    </Button>
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              <CategoryHeader category={category} />

              {!category.isCollapsed && (
                <div className="ml-2 space-y-0.5">
                  {category.channels.map((channel) => (
                    <ChannelItem key={channel.id} channel={channel} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Settings Footer */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4 mr-2" />
          Circle Settings
        </Button>
      </div>
    </div>
  );
}
