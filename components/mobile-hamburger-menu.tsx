"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  User,
  MessageSquare,
  Gamepad2,
  Wrench,
  Wallet,
  Crown,
  Settings,
  LogOut,
  LogIn,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface MobileHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileHamburgerMenu({
  isOpen,
  onClose,
  className,
}: MobileHamburgerMenuProps) {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const modules = [
    {
      icon: MessageSquare,
      label: "Social",
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
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Panel - Fills exact space between top and bottom bars */}
      <div
        className={cn(
          "mobile-hamburger-menu fixed w-80 max-w-[90vw] z-40 md:hidden",
          "bg-card border-r border-border shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        style={{
          top: "64px", // Exact height of top bar
          bottom: "80px", // Exact height of bottom bar
          left: "0px",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Section */}
            {auth.isAuthenticated ? (
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={auth.user?.picture} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {auth.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      {auth.user?.name || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {auth.user?.email}
                    </p>
                  </div>
                </div>

                {/* Followers/Following */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-card-foreground">49</strong>{" "}
                    Following
                  </span>
                  <span>
                    <strong className="text-card-foreground">134</strong>{" "}
                    Followers
                  </span>
                </div>
              </div>
            ) : null}

            <Separator />

            {/* Profile */}
            <div className="p-4">
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/profile")}
                className="w-full justify-start"
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </Button>
            </div>

            <Separator />

            {/* Modules */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Modules
              </h4>
              <div className="space-y-1">
                {modules.map((module) => (
                  <Button
                    key={module.path}
                    variant="ghost"
                    onClick={() => handleNavigation(module.path)}
                    className="w-full justify-start"
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
              </div>
            </div>

            <Separator />

            {/* Other Options */}
            <div className="p-4 space-y-1">
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

            <Separator />

            {/* Theme Toggle */}
            <div className="p-4 space-y-1">
              <Button
                variant="ghost"
                onClick={handleThemeToggle}
                className="w-full justify-start group"
              >
                <div className="mr-3 h-5 w-5 flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  ) : (
                    <Sun className="h-5 w-5 transition-transform group-hover:scale-110" />
                  )}
                </div>
                <span className="flex-1 text-left">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
                <div
                  className={cn(
                    "ml-auto flex h-6 w-11 items-center rounded-full px-1 transition-colors",
                    theme === "dark" ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full bg-white shadow-md transition-transform",
                      theme === "dark" ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </div>
              </Button>
            </div>

            <Separator />

            {/* Auth Actions */}
            <div className="p-4">
              {auth.isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    auth.signOut();
                    onClose();
                  }}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Log Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    auth.signInWithGoogle();
                    onClose();
                  }}
                  className="w-full justify-start"
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
