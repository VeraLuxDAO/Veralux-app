import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Volume2, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChannelCategory } from "@/lib/circles-mock-data";

interface ChannelsListProps {
  categories: ChannelCategory[];
  activeChannelId: string;
  onChannelSelect: (channelId: string, e?: React.MouseEvent) => void;
  onCategoryToggle: (categoryId: string) => void;
}

export const ChannelsList = memo(function ChannelsList({
  categories,
  activeChannelId,
  onChannelSelect,
  onCategoryToggle,
}: ChannelsListProps) {
  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div className="px-4 pb-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-4">
            <button
              onClick={() => onCategoryToggle(category.id)}
              className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#9BB6CC] hover:text-white transition-colors uppercase tracking-wide"
            >
              <span>{category.name}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  category.isCollapsed && "-rotate-90"
                )}
              />
            </button>
            {!category.isCollapsed && (
              <div className="mt-1 space-y-0.5">
                {category.channels.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={(e) => onChannelSelect(channel.id, e)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all",
                      activeChannelId === channel.id
                        ? "bg-[#5865F2]/20 text-white"
                        : "text-[#9BB6CC] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {channel.type === "text" ? (
                      <Hash className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Volume2 className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="flex-1 truncate text-left">
                      {channel.name}
                    </span>
                    {channel.isPrivate && (
                      <Lock className="h-3 w-3 flex-shrink-0" />
                    )}
                    {channel.unreadCount && channel.unreadCount > 0 && (
                      <Badge className="h-4 min-w-4 px-1 text-xs bg-[#FADEFD] text-[#000205]">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});
