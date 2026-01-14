import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Circle } from "@/lib/circles-data";

interface CircleAvatarRailProps {
  circles: Circle[];
  selectedCircleId?: string | null;
  onSelect: (circle: Circle) => void;
  onAdd?: () => void;
  className?: string;
}

export function CircleAvatarRail({
  circles,
  selectedCircleId,
  onSelect,
  onAdd,
  className,
}: CircleAvatarRailProps) {
  return (
    <div className={cn("flex-shrink-0 w-[36px] min-w-[36px] pt-6", className)}>
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center gap-3 pb-4">
          {circles.map((circle) => (
            <button
              key={circle.id}
              onClick={() => onSelect(circle)}
              title={circle.name}
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-lg transition-all",
                "hover:bg-white/10",
                selectedCircleId === circle.id && "ring-2 ring-white/20"
              )}
            >
              {circle.icon}
            </button>
          ))}
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              title="Add circle"
              className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
