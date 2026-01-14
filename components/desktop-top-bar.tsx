"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LighthouseLogo } from "@/components/lighthouse-logo";
import {
  Search,
  Bell,
  MessageCircle,
  Users,
  Headphones,
  Gamepad2,
  Wrench,
  ShoppingCart,
  X,
  Copy,
  Check,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CirclesModal } from "@/components/circles-modal";
import { CirclesPopover } from "@/components/circles-popover";
import { RoomsSlidingPanel } from "@/components/rooms-sliding-panel";
import { CirclesSlidingPanel } from "@/components/circles-sliding-panel";
import { NotificationCenterPopover } from "@/components/notification-center-popover";
import { joinedCircles } from "@/lib/circles-data";
import { PrivateRoomsPopover } from "@/components/private-rooms-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWallet } from "@suiet/wallet-kit";
import { WalletAccountModal } from "@/components/wallet-account-modal";

interface DesktopTopBarProps {
  className?: string;
}

export function DesktopTopBar({ className }: DesktopTopBarProps) {
  const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);
  const [isConnectionsPanelOpen, setIsConnectionsPanelOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isPrivateRoomsPopoverOpen, setIsPrivateRoomsPopoverOpen] =
    useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const wallet = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Desktop Rooms (private messages) panel is considered "open"
  // whenever the current path starts with /private_rooms
  const isRoomsPanelOpen = pathname.startsWith("/private_rooms");
  
  // Desktop Circles panel is considered "open" whenever the circle parameter is present (on any page)
  const isCirclesPanelOpen = searchParams.get("circle") !== null;

  // Close the private rooms popover whenever the dedicated panel route is active
  useEffect(() => {
    if (isRoomsPanelOpen) {
      setIsPrivateRoomsPopoverOpen(false);
    }
  }, [isRoomsPanelOpen]);

  const userInitial = auth.user?.name?.charAt(0) || "U";
  const walletAddress =
    wallet.connected && wallet.account?.address ? wallet.account.address : "";

  const truncatedAddress = useMemo(() => {
    if (!walletAddress) return "";
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 150);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
  };

  const handleSearchBlur = () => {
    // Only close if there's no search query
    if (!searchQuery.trim()) {
      setTimeout(() => {
        setIsSearchExpanded(false);
      }, 200);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchExpanded) {
        const target = event.target as Node;
        const searchContainer = document.getElementById("search-container");
        const searchButton = document.getElementById("search-button");

        if (
          searchContainer &&
          !searchContainer.contains(target) &&
          searchButton &&
          !searchButton.contains(target)
        ) {
          handleSearchClose();
        }
      }
    };

    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const handleCopyAddress = async () => {
    if (!walletAddress || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy address", error);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setIsUserMenuOpen(false);
  };

  const renderUserMenu = () => (
    <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center justify-center focus:outline-none">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary/30 transition-all">
            <AvatarImage src={auth.user?.picture} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#080E11] rounded-full" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[260px] border border-white/10 bg-[#0B1317] text-white shadow-xl"
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 border border-white/10">
            <AvatarImage src={auth.user?.picture} />
            <AvatarFallback className="bg-primary/20 text-primary text-base font-medium">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-tight">
                {auth.user?.name || "Unnamed user"}
              </p>
              <span className="text-[11px] text-veralux-green">Online</span>
            </div>
            {walletAddress && (
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1">
                <span className="text-xs font-mono text-[#9BB6CC] truncate">
                  {truncatedAddress}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Copy wallet address"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-veralux-green" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            )}
            <p className="text-xs text-[#9BB6CC]">
              Signed in with Google · zkLogin
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {wallet.connected && (
            <Button
              variant="secondary"
              onClick={() => {
                setIsAccountModalOpen(true);
                setIsUserMenuOpen(false);
              }}
              className="w-full h-9 text-sm bg-white/10 hover:bg-white/15 border border-white/10"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Manage wallet
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push("/profile")}
              className="h-9 text-sm bg-white/10 hover:bg-white/15 border border-white/10"
            >
              View profile
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="h-9 text-sm text-red-200 hover:bg-red-500/10 border border-white/5"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const navItems = [
    { icon: Headphones, label: "Connect", path: "/" },
    { icon: Gamepad2, label: "Play", path: "/gaming" },
    { icon: Wrench, label: "Build", path: "/dev" },
    { icon: ShoppingCart, label: "Trade", path: "/marketplace" },
  ];

  return (
    <>
      <header
        className={cn(
          "desktop-top-bar fixed top-0 left-0 right-0 z-50 hidden md:block",
          "bg-transparent",
          "transition-all duration-300 ease-out",
          className
        )}
      >
        <div className="flex items-center justify-center px-8 pt-4 pb-3.5 relative">
          {/* Center - Navigation Pills with Icons - Centered ignoring sidebar */}
          <nav className="flex items-center gap-3 bg-[#080E11]/40 border border-white/[0.08] rounded-[24px] p-3 backdrop-blur-[40px] h-[60px]">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const isHovered = hoveredNavItem === item.path;
              const showLabel = isActive || isHovered;
              // Play, Build, Trade buttons should use #E5F7FD99 when not active
              const shouldUseHighlightColor = !isActive && (item.path === "/gaming" || item.path === "/dev" || item.path === "/marketplace");
              
              // Preserve circle and channel query parameters when navigating
              // Except for Connect button which always goes to clean home page
              const handleNavigation = () => {
                // Connect button always navigates to clean home page
                if (item.path === "/" && item.label === "Connect") {
                  router.push("/");
                  return;
                }
                
                const circle = searchParams.get("circle");
                const channel = searchParams.get("channel");
                
                let newPath = item.path;
                if (circle) {
                  newPath += `?circle=${circle}`;
                  if (channel) {
                    newPath += `&channel=${channel}`;
                  }
                }
                
                router.push(newPath);
              };
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={handleNavigation}
                  onMouseEnter={() => setHoveredNavItem(item.path)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                  className={cn(
                    "flex items-center rounded-[12px] text-sm h-9",
                    showLabel ? "px-4 py-2" : "px-3 py-2",
                    isActive ? "text-foreground" : "hover:bg-white/10 hover:text-foreground",
                    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  )}
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    ...(isActive
                      ? { backgroundColor: "#E5F7FD33" }
                      : { color: shouldUseHighlightColor ? "#E5F7FD99" : "rgba(230, 253, 229, 0.6)" })
                  }}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <div
                    className="overflow-hidden inline-block"
                    style={{
                      width: showLabel ? '60px' : '0px',
                      transition: 'width 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                      willChange: 'width'
                    }}
                  >
                    <span 
                      className="whitespace-nowrap inline-block"
                      style={{
                        opacity: showLabel ? 1 : 0,
                        transition: showLabel 
                          ? 'opacity 200ms cubic-bezier(0.4, 0, 1, 1) 150ms'
                          : 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                        willChange: 'opacity'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </nav>

          {/* Right Side - Actions Container - Aligned with sidebar at 24px from edge */}
          <div className="fixed right-[24px]" id="search-container">
            {auth.isAuthenticated ? (
              /* Authenticated State */
              isSearchExpanded ? (
                /* Search Expanded - Full width container */
                <div className="flex items-center p-3 gap-6 w-[502px] h-[60px] bg-[rgba(8,14,17,0.4)] border border-[#E5F7FD]/20 backdrop-blur-[20px] rounded-[20px] transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95">
                  {/* Search Input */}
                  <div className="relative flex-1 animate-in fade-in slide-in-from-left-4 duration-300">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={handleSearchBlur}
                      placeholder="Search flows, users, topics"
                      className="w-full h-9 pl-10 pr-3 bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </div>

                  {/* Vertical Separator */}
                  <div
                    className="h-6 w-0.5"
                    style={{
                      backgroundColor: "rgba(155, 182, 204, 0.4)",
                    }}
                  />

                  {/* Notifications */}
                  <button
                    data-notification-trigger
                    onClick={() =>
                      setIsNotificationsPanelOpen(!isNotificationsPanelOpen)
                    }
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isNotificationsPanelOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <Bell className="h-5 w-5 text-white" />
                    <Badge
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        color: "rgba(0, 2, 5, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      3
                    </Badge>
                  </button>

                  {/* Connections Button - Opens Circles Popover */}
                  <button
                    data-circles-trigger
                    onClick={() => setIsCirclesModalOpen(!isCirclesModalOpen)}
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isCirclesModalOpen || isConnectionsPanelOpen || isCirclesPanelOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <Users className="h-5 w-5 text-white" />
                  </button>

                  {/* Messages Button - navigates to /private_rooms (desktop private rooms) */}
                  <button
                    data-private-rooms-trigger
                    onClick={() => {
                      setIsPrivateRoomsPopoverOpen(!isPrivateRoomsPopoverOpen);
                      setIsNotificationsPanelOpen(false);
                      setIsCirclesModalOpen(false);
                    }}
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isRoomsPanelOpen || isPrivateRoomsPopoverOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                    <Badge
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        color: "rgba(0, 2, 5, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      2
                    </Badge>
                  </button>

                  {/* Profile Avatar */}
                  {renderUserMenu()}
                </div>
              ) : (
                /* Search Collapsed - Compact container */
                <div className="flex flex-row justify-center items-center p-3 gap-4 h-[60px] bg-[rgba(8,14,17,0.4)] border border-[rgba(255,255,255,0.08)] rounded-[24px] backdrop-blur-[20px] flex-none">
                  {/* Search Icon Button */}
                  <button
                    id="search-button"
                    onClick={handleSearchIconClick}
                    className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Vertical Separator */}
                  <div
                    className="h-6 w-0.5"
                    style={{
                      backgroundColor: "rgba(155, 182, 204, 0.4)",
                    }}
                  />

                  {/* Notifications */}
                  <button
                    data-notification-trigger
                    onClick={() =>
                      setIsNotificationsPanelOpen(!isNotificationsPanelOpen)
                    }
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isNotificationsPanelOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <Bell className="h-5 w-5 text-white" />
                    <Badge
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        color: "rgba(0, 2, 5, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      3
                    </Badge>
                  </button>

                  {/* Connections Button - Opens Circles Popover */}
                  <button
                    data-circles-trigger
                    onClick={() => setIsCirclesModalOpen(!isCirclesModalOpen)}
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isCirclesModalOpen || isConnectionsPanelOpen || isCirclesPanelOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <Users className="h-5 w-5 text-white" />
                  </button>

                  {/* Messages Button - navigates to /private_rooms (desktop private rooms) */}
                  <button
                    data-private-rooms-trigger
                    onClick={() => {
                      setIsPrivateRoomsPopoverOpen(!isPrivateRoomsPopoverOpen);
                      setIsNotificationsPanelOpen(false);
                      setIsCirclesModalOpen(false);
                    }}
                    className={cn(
                      "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                      isRoomsPanelOpen || isPrivateRoomsPopoverOpen
                        ? "bg-[#FFFFFF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                    <Badge
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(250, 222, 253, 1)",
                        color: "rgba(0, 2, 5, 1)",
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      2
                    </Badge>
                  </button>

                  {/* Profile Avatar */}
                  {renderUserMenu()}
                </div>
              )
            ) : /* Not Authenticated State */
            isSearchExpanded ? (
              /* Search Expanded - Show input + Sign In */
              <div className="flex items-center justify-evenly p-3 gap-4 w-[350px] h-[60px] bg-[#080E11]/90 border border-[#E5F7FD]/20 backdrop-blur-[20px] rounded-[20px] transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95">
                {/* Search Input */}
                <div className="relative flex-1 animate-in fade-in slide-in-from-left-4 duration-300">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleSearchBlur}
                    placeholder="Search flows, users, topics"
                    className="w-full h-9 pl-10 pr-3 bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>

                {/* Sign In Button */}
                <button
                  onClick={auth.signInWithGoogle}
                  disabled={auth.isLoading}
                  className="flex items-center justify-center px-[18px] py-2.5 gap-2.5 w-[82px] h-8 bg-white text-black font-medium text-sm rounded-2xl shadow-[0px_12px_5px_rgba(255,255,255,0.01),0px_7px_4px_rgba(255,255,255,0.05),0px_3px_3px_rgba(255,255,255,0.09),0px_1px_2px_rgba(255,255,255,0.1)] hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {auth.isLoading ? "..." : "Sign In"}
                </button>
              </div>
            ) : (
              /* Search Collapsed - Compact container */
              <div
                className="flex items-center px-4 py-3 h-[60px] transition-all duration-300 ease-in-out"
                style={{
                  background: "rgba(8, 14, 17, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderRadius: "18px",
                }}
              >
                {/* Search Icon Button */}
                <button
                  id="search-button"
                  onClick={handleSearchIconClick}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Space: 26px */}
                <div style={{ width: "6px" }} />

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-[rgba(255,255,255,0.2)]" />

                {/* Space: 24px */}
                <div style={{ width: "24px" }} />

                {/* Sign In Button */}
                <button
                  onClick={auth.signInWithGoogle}
                  disabled={auth.isLoading}
                  className="flex items-center justify-center px-[12.5px] py-[10PX] h-9 bg-white text-black font-weight-500 text-[12px] rounded-[20px] transition-all disabled:opacity-50 hover:shadow-lg"
                  style={{
                    boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.25)",
                  }}
                >
                  {auth.isLoading ? "..." : "Sign In"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Circles Popover - Desktop Only */}
      <div className="hidden md:block">
        <CirclesPopover
          isOpen={isCirclesModalOpen}
          onClose={() => setIsCirclesModalOpen(false)}
        />
      </div>

      {/* Private Rooms Popover - Desktop Only */}
      <PrivateRoomsPopover
        isOpen={isPrivateRoomsPopoverOpen}
        onClose={() => setIsPrivateRoomsPopoverOpen(false)}
      />

      {/* Rooms Sliding Panel (desktop only, opened/closed based on /private_rooms path) */}
      <RoomsSlidingPanel
        isOpen={isRoomsPanelOpen}
        onClose={() => router.push("/")}
      />

      {/* Circles Sliding Panel (desktop only, opened/closed based on ?circle parameter) */}
      <CirclesSlidingPanel
        isOpen={isCirclesPanelOpen}
        onClose={() => router.push("/")}
      />

      {/* Notification Center Popover */}
      <NotificationCenterPopover
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />

      {/* Wallet Account Modal */}
      <WalletAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
