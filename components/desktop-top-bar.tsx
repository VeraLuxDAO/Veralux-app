"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LighthouseLogo } from "@/components/lighthouse-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import {
  Search,
  Bell,
  MessageCircle,
  TrendingUp,
  Hash,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface DesktopTopBarProps {
  className?: string;
}

export function DesktopTopBar({ className }: DesktopTopBarProps) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  const trendingItems = [
    { icon: TrendingUp, label: "#DeFiSummer", count: "12.4K" },
    { icon: Hash, label: "#NFTGaming", count: "8.7K" },
    { icon: Users, label: "#Web3Community", count: "6.2K" },
    { icon: Zap, label: "#BuildInPublic", count: "4.1K" },
  ];

  return (
    <header
      className={cn(
        "desktop-top-bar fixed top-0 left-0 right-0 z-50 hidden md:block",
        "bg-card/95 backdrop-blur-md border-b border-border",
        "transition-all duration-500 ease-out transform-gpu will-change-transform",
        className
      )}
      style={{
        willChange: "transform, opacity",
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Logo */}
        <div className="flex items-center space-x-4">
          <LighthouseLogo
            size="lg"
            onClick={handleLogoClick}
            className="flex-shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">VeraLux</span>
            <span className="text-xs text-muted-foreground">
              Web3 Social Platform
            </span>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <div className="relative">
            <Input
              placeholder="Search flows, users, topics..."
              className="w-full pl-12 pr-4 py-3 bg-muted/50 border-border rounded-full"
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <kbd className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-muted rounded px-2 py-1">
              ⌘K
            </kbd>
          </div>

          {/* Trending Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50 transform-gpu transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0 scale-in-95">
              <h4 className="text-sm font-medium text-card-foreground mb-3">
                Trending
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {trendingItems.map((item, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-card-foreground">
                        {item.label}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => router.push("/notifications")}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => router.push("/messages")}
          >
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
              2
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wallet Connect */}
          <WalletConnectButton showAddress={false} />

          {/* Profile */}
          {auth.isAuthenticated && (
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
              className="p-1"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={auth.user?.picture} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {auth.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
