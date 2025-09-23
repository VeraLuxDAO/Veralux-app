"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  User,
  Gamepad2,
  Wrench,
  ShoppingCart,
  Wallet,
  Crown,
  Settings,
  UserPlus,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface DesktopLeftSidebarProps {
  className?: string;
}

export function DesktopLeftSidebar({ className }: DesktopLeftSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const modules = [
    {
      icon: MessageSquare,
      label: "Social Hub",
      path: "/",
      badge: "5",
    },
    {
      icon: Gamepad2,
      label: "Gaming",
      path: "/gaming",
      badge: "New",
    },
    {
      icon: Wrench,
      label: "Build",
      path: "/dev",
      badge: null,
    },
    {
      icon: ShoppingCart,
      label: "Marketplace",
      path: "/marketplace",
      badge: null,
    },
  ];

  const connections = {
    following: [
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
      { name: "Mike Chen", avatar: "/developer-avatar.png", isOnline: false },
    ],
    circles: [
      { name: "DeFi Builders", icon: "🔒", members: 47, isActive: true },
      { name: "Gaming Alpha", icon: "🎮", members: 23, isActive: true },
      { name: "NFT Collectors", icon: "💎", members: 31, isActive: false },
    ],
  };

  return (
    <aside
      className={cn(
        "desktop-left-sidebar fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 z-40 hidden md:block",
        "bg-card/95 backdrop-blur-md border-r border-border overflow-y-auto",
        "transition-all duration-500 ease-out transform-gpu will-change-transform",
        className
      )}
      style={{
        willChange: "transform, opacity",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-2">
          <Link href="/profile">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname === "/profile"
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-foreground hover:text-primary hover:bg-accent"
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              My Profile
            </Button>
          </Link>
        </nav>

        <Separator />

        {/* Modules */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Modules
          </h3>
          <nav className="space-y-1">
            {modules.map((module) => (
              <Button
                key={module.path}
                variant="ghost"
                onClick={() => handleNavigation(module.path)}
                className={`w-full justify-start ${
                  pathname === module.path
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <module.icon className="mr-3 h-5 w-5" />
                {module.label}
                {module.badge && (
                  <Badge className="ml-auto bg-primary/20 text-primary border-primary/30 text-xs">
                    {module.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>

        <Separator />

        {/* Connections */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Connections
          </h3>

          {/* Following */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-card-foreground">
                Following
              </h4>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {connections.following.slice(0, 3).map((user, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-veralux-green border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {user.name}
                    </p>
                  </div>
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/following")}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="mr-2 h-4 w-4" />
                See more
              </Button>
            </div>
          </div>

          {/* Circles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-card-foreground">
                Circles
              </h4>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {connections.circles.slice(0, 3).map((circle, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">{circle.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {circle.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {circle.members} members
                    </p>
                  </div>
                  {circle.isActive && (
                    <div className="w-2 h-2 bg-veralux-green rounded-full" />
                  )}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/circles")}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="mr-2 h-4 w-4" />
                See more
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/wallet")}
            className="w-full justify-start"
          >
            <Wallet className="mr-3 h-5 w-5" />
            Wallet & Staking
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/upgrade")}
            className="w-full justify-start"
          >
            <Crown className="mr-3 h-5 w-5 text-veralux-yellow" />
            Upgrade
            <Badge className="ml-auto bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30 text-xs">
              Pro
            </Badge>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/settings")}
            className="w-full justify-start"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </div>
      </div>
    </aside>
  );
}
