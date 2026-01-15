import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Circle } from "@/lib/circles-data";

interface CircleHeaderProps {
  circle: Circle;
  onBack: () => void;
}

export function CircleHeader({ circle, onBack }: CircleHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4 flex-shrink-0 relative">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-lg">{circle.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-sm font-semibold text-white truncate leading-tight font-['Geist']"
            >
              {circle.name}
            </h2>
            <p className="text-xs text-[#9BB6CC99] leading-tight font-['Geist']">
              {circle.onlineMembers} online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
