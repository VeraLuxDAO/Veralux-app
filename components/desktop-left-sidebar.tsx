"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CirclesModal } from "@/components/circles-modal";

interface DesktopLeftSidebarProps {
  className?: string;
}

export function DesktopLeftSidebar({ className }: DesktopLeftSidebarProps) {
  const router = useRouter();
  const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const connections = [
    {
      name: "Vitalik Buterin",
      avatar: "/diverse-user-avatars.png",
      isOnline: true,
    },
    {
      name: "Sarah Miller",
      avatar: "/diverse-female-avatar.png",
      isOnline: true,
    },
    {
      name: "Mike Chen",
      avatar: "/developer-avatar.png",
      isOnline: false,
    },
    {
      name: "Sarah Miller",
      avatar: "/diverse-female-avatar.png",
      isOnline: true,
    },
    {
      name: "Mike Chen",
      avatar: "/developer-avatar.png",
      isOnline: false,
    },
    {
      name: "Mike Chen",
      avatar: "/developer-avatar.png",
      isOnline: false,
    },
    {
      name: "Vitalik Buterin",
      avatar: "/diverse-user-avatars.png",
      isOnline: true,
    },
    {
      name: "Sarah Miller",
      avatar: "/diverse-female-avatar.png",
      isOnline: true,
    },
    {
      name: "Mike Chen",
      avatar: "/developer-avatar.png",
      isOnline: false,
    },
  ];

  const circles = [
    {
      name: "DeFi Builders",
      members: 47,
      icon: "🏗️",
      color: "bg-blue-500/10 text-blue-400",
      routeId: "defi-builders",
    },
    {
      name: "Gaming Alpha",
      members: 23,
      icon: "🎮",
      color: "bg-purple-500/10 text-purple-400",
      routeId: "gaming-alpha",
    },
    {
      name: "NFT Collectors",
      members: 31,
      icon: "💎",
      color: "bg-green-500/10 text-green-400",
      routeId: "nft-collectors",
    },
  ];

  return (
    <aside
      className={cn(
        "desktop-left-sidebar fixed z-[60] hidden md:block",
        // Responsive positioning and sizing
        "left-[14px] top-[14px]",
        "h-[calc(100vh-80px)]",
        "w-[180px] lg:w-[200px] xl:w-[230px]", // Responsive width
        "bg-[#080E11]/40 border border-white/[0.08] backdrop-blur-[20px]",
        "rounded-[24px]",
        "transition-all duration-300 ease-out",
        "overflow-y-auto",
        className
      )}
    >
      <div className="flex flex-col h-full py-6 px-4 gap-8">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 4L4 8L8 12L12 8L8 4Z" />
              <path d="M16 4L12 8L16 12L20 8L16 4Z" />
              <path d="M12 10L8 14L12 18L16 14L12 10Z" />
            </svg>
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            YNX
          </span>
        </div>

        {/* Connections Section */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Connections
          </h3>
          <div className="flex flex-col gap-2">
            {connections.slice(0, 9).map((user, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-[#080E11] rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {user.name}
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={() => handleNavigation("/connections")}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">See more</span>
              <Users className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Circles Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Circles
          </h3>
          <div className="flex flex-col gap-2">
            {circles.map((circle, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(`/chat/${circle.routeId}`)}
                className="w-full flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    circle.color
                  )}
                >
                  <span className="text-base">{circle.icon}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {circle.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {circle.members} members
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setIsCirclesModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">See more</span>
              <Users className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Circles Modal */}
      <CirclesModal
        isOpen={isCirclesModalOpen}
        onClose={() => setIsCirclesModalOpen(false)}
      />
    </aside>
  );
}
