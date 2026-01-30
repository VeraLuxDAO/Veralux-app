"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationLayout } from "@/components/navigation-layout";
import { SocialFeed } from "@/components/social-feed";
import { TrendingTopics } from "@/components/trending-topics";
import { SuggestedConnections } from "@/components/suggested-connections";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState('300px');
  const lockedScrollYRef = useRef<number | null>(null);

  // Helper function to slugify circle name
  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Handle Join button click - open the circle
  const handleJoinCircle = (circleName: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const slugifiedName = slugifyCircleName(circleName);
    // On mobile, add #channel hash by default
    if (isMobile) {
      router.push(`/?circle=${slugifiedName}&channel=general#channel`);
    } else {
      router.push(`/?circle=${slugifiedName}&channel=general`);
    }
  };

  useEffect(() => {
    let rafId: number | null = null;
    let isBodyLockedState = false;
    
    // Check if body scroll is locked (pop-up is open)
    const isBodyLocked = () => {
      return document.body.style.position === 'fixed';
    };
    
    const handleScroll = () => {
      if (rafId) return; // Throttle with requestAnimationFrame
      
      rafId = requestAnimationFrame(() => {
        if (!sidebarRef.current || !containerRef.current) {
          rafId = null;
          return;
        }
        
        // If body is locked (pop-up open), completely skip recalculation
        // This prevents the sidebar from jumping when pop-ups open/close
        if (isBodyLocked()) {
          rafId = null;
          return;
        }
        
        // Get sidebar's current position
        const rect = sidebarRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Store original width when not sticky
        if (rect.width && !isSticky) {
          setSidebarWidth(`${rect.width}px`);
        }
        
        // Calculate the original top position on first load
        if (sidebarTop === 0 && rect.top > 90) {
          setSidebarTop(scrollTop + rect.top);
        }
        
        // Stick when scrolled past the original position minus the offset (90px)
        // Add a small threshold to prevent flickering
        const threshold = 5;
        const shouldStick = sidebarTop > 0 && scrollTop > (sidebarTop - 90 + threshold);
        
        if (shouldStick !== isSticky) {
          setIsSticky(shouldStick);
        }
        
        rafId = null;
      });
    };

    // Monitor body style changes to detect when pop-ups open/close
    const observeBodyChanges = () => {
      const observer = new MutationObserver(() => {
        const currentlyLocked = isBodyLocked();
        
        // Only react to state changes (lock -> unlock or unlock -> lock)
        if (currentlyLocked !== isBodyLockedState) {
          isBodyLockedState = currentlyLocked;
          
          if (currentlyLocked) {
            // Body just got locked - store current scroll position
            const bodyTop = document.body.style.top;
            if (bodyTop && bodyTop.startsWith('-')) {
              lockedScrollYRef.current = Math.abs(parseFloat(bodyTop));
            } else {
              lockedScrollYRef.current = window.pageYOffset || document.documentElement.scrollTop;
            }
          } else {
            // Body just got unlocked - wait for scroll restoration then recalculate
            lockedScrollYRef.current = null;
            // Use a longer delay to ensure scroll position is fully restored
            setTimeout(() => {
              handleScroll();
            }, 100);
          }
        }
      });
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style']
      });
      
      return observer;
    };

    // Set initial position
    handleScroll();
    isBodyLockedState = isBodyLocked();
    
    const bodyObserver = observeBodyChanges();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      bodyObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sidebarTop, isSticky]);

  return (
    <>
      {/* Background - Absolute from page top, scrolls with content */}
      {/* Mobile: Height to top of Social Hub title (~140px), Desktop: Full height */}
      <div className="absolute pointer-events-none w-full h-[140px] md:h-[919px] top-0 left-0 bg-[url(/app-background.png)] bg-cover bg-[center_top] bg-no-repeat z-[1]" />
      
      <NavigationLayout
        className="bg-transparent relative z-[2]"
        header={
          /* Social Hub Header - Between Top Nav and Main Content */
          <div className="relative w-full pt-4 pb-4 md:py-6 lg:py-8 z-[10]">
            <div className="relative flex flex-col items-center justify-center text-center">
              <h1 
                className="relative mb-2 md:mb-3 lg:mb-4 z-10 flex items-center justify-center text-center flex-none grow-0 w-[123px] md:w-auto h-[31px] md:h-auto social-hub-title"
                style={{
                  fontFamily: "'Geist'",
                  fontStyle: "normal",
                  fontWeight: 600,
                  color: "#E9F0F5",
                  fontSize: "42px",
                  // Mobile font size handled by CSS class
                  // Desktop sizes handled by media queries in globals.css
                }}
              >
                Social Hub
              </h1>
              {/* Activity Stats Inline - single row, responsive sizing */}
              <div className="relative flex items-center justify-center flex-nowrap gap-[10px] max-[420px]:gap-2 z-10 mt-0 px-3">
                <div className="flex items-center gap-1.5 rounded-md py-0.5 px-2 max-[390px]:px-1.5 bg-[rgba(155,182,204,0.08)]">
                  <span className="text-[13px] max-[390px]:text-[12px] md:text-lg font-bold text-white">
                    23
                  </span>
                  <span className="text-[11px] max-[390px]:text-[10px] md:text-sm text-gray-400">
                    Flows
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md py-0.5 px-2 max-[390px]:px-1.5 bg-[rgba(155,182,204,0.08)]">
                  <span className="text-[13px] max-[390px]:text-[12px] md:text-lg font-bold text-orange-700">
                    156
                  </span>
                  <span className="text-[11px] max-[390px]:text-[10px] md:text-sm text-gray-400">
                    Glows
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md py-0.5 px-2 max-[390px]:px-1.5 bg-[rgba(155,182,204,0.08)]">
                  <span className="text-[13px] max-[390px]:text-[12px] md:text-lg font-bold text-teal-700">
                    204
                  </span>
                  <span className="text-[11px] max-[390px]:text-[10px] md:text-sm text-gray-400">
                    SUI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md py-0.5 px-2 max-[390px]:px-1.5 bg-[rgba(155,182,204,0.08)]">
                  <span className="text-[13px] max-[390px]:text-[12px] md:text-lg font-bold text-slate-300">
                    892
                  </span>
                  <span className="text-[11px] max-[390px]:text-[10px] md:text-sm text-gray-400">
                    Connect
                  </span>
                </div>
              </div>
          </div>
        </div>
      }
    >
      {/* Content Container - Constrained width with proper margins */}
      <div className="w-full max-w-[1600px] mx-auto px-4">
        {/* Mobile: Tabs Layout */}
        <div className="block lg:hidden">
          <Tabs defaultValue="feed" className="space-y-4 sm:space-y-6">
            <TabsList className="feed-discover-tabs flex flex-row items-center p-0 gap-6 w-[152px] h-6 mx-auto bg-transparent border-0">
              <TabsTrigger
                value="feed"
                className="data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent text-[#9BB6CC99] h-6 bg-transparent hover:bg-transparent focus-visible:ring-0 border-0 flex items-center font-medium relative"
                style={{
                  fontFamily: "'Geist'",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "12px !important",
                  lineHeight: "16px",
                }}
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent text-[#9BB6CC99] h-6 bg-transparent hover:bg-transparent focus-visible:ring-0 border-0 flex items-center font-medium relative"
                style={{
                  fontFamily: "'Geist'",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "12px !important",
                  lineHeight: "16px",
                }}
              >
                Discover
              </TabsTrigger>
            </TabsList>

            {/* Main Feed Tab - Only the Feed */}
            <TabsContent value="feed">
              <div className="w-full max-w-2xl mx-auto">
                <SocialFeed />
              </div>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover">
              <div className="space-y-0 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-0 sm:space-y-6">
                    {/* Trending Topics */}
                    <TrendingTopics />

                    {/* Trending Creators */}
                    <Card className="bg-transparent border-none py-0 md:py-4">
                      <CardHeader className="pb-2 md:pb-4 !px-0 md:!px-[12px]">
                        <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                          Trending Creators
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-[10px] md:space-y-4 px-0 md:px-6 pt-0 md:pt-6">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 md:w-9 md:h-9">
                            <AvatarImage src="/diverse-user-avatars.png" />
                            <AvatarFallback>VB</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              Vitalik Buterin
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              Ethereum Foundation
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 md:w-9 md:h-9">
                            <AvatarImage src="/diverse-female-avatar.png" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              Sarah Miller
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              DeFi Researcher
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/developer-avatar.png" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              Mike Chen
                            </p>
                            <p className="text-muted-foreground mt-1 text-[15px]">
                              Smart Contract Dev
                            </p>
                          </div>
                          <button className="flex items-center justify-center w-[63.88px] h-8 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-black hover:bg-[#FADEFD]/90 transition-all">
                            Follow
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-0 sm:space-y-6">
                    {/* Suggested Connections */}
                    <SuggestedConnections />

                    {/* Active Rooms */}
                    <Card className="bg-transparent border-none py-0 md:py-4">
                      <CardHeader className="pb-2 md:pb-4 px-0 md:px-6">
                        <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                          Active Rooms
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-[10px] md:space-y-4 px-0  pt-0 md:pt-6">
                        <div className="flex items-center space-x-3  rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-sm">
                              🔒
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              DeFi Builders
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              47 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-sm">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              Gaming Alpha
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              23 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-green/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-green text-sm">
                              💎
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              NFT Collectors
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              31 online
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-veralux-green rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Communities */}
                    <Card className="bg-transparent border-none">
                      <CardHeader >
                        <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                          Popular Communities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-electric-blue text-sm">
                              🏗️
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              DeFi Builders
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              1.2k members
                            </p>
                          </div>
                          <button 
                            onClick={(e) => handleJoinCircle("DeFi Builders", e)}
                            className="flex items-center justify-center rounded-[10px] transition-all w-[63.88px] h-8 bg-[#fadefe] border border-[#001425] text-xs font-medium text-black hover:bg-[#fadefe]/90"
                          >
                            Join
                          </button>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
                            <span className="text-veralux-yellow text-sm">
                              🎮
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground text-[15px]">
                              NFT Gaming
                            </p>
                            <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                              856 members
                            </p>
                          </div>
                          <button 
                            onClick={(e) => handleJoinCircle("NFT Gaming", e)}
                            className="flex items-center justify-center rounded-[10px] transition-all w-[63.88px] h-8 bg-[#fadefe] border border-[#001425] text-xs font-medium text-black hover:bg-[#fadefe]/90"
                          >
                            Join
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Equal 24px gaps on left and right */}
        <div className="hidden lg:block">
          <div className="flex gap-[24px] w-full items-start">
            {/* Left Column: Feed - Grows to fill available space */}
            <div className="flex-1 min-w-0 max-w-full">
              <SocialFeed />
            </div>

            {/* Right Column: Sidebar - Responsive width, sticky */}
            <div 
              ref={containerRef}
              className="w-[300px] xl:w-[340px] 2xl:w-[380px] flex-shrink-0"
            >
              <aside 
                ref={sidebarRef}
                className={cn(
                  "w-full overflow-y-auto right-sidebar-sticky",
                  isSticky && "right-sidebar-is-sticky"
                )}
                style={{
                  position: isSticky ? 'fixed' : 'static',
                  top: isSticky ? '90px' : 'auto',
                  width: isSticky ? sidebarWidth : '100%',
                  zIndex: isSticky ? 30 : 'auto', // Lower than AI chat (z-50)
                  maxHeight: isSticky ? 'calc(100vh - 90px)' : 'none',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE/Edge
                  transition: 'none', // Disable transition to prevent jumps
                }}
              >
                {/* Content wrapper with spacing */}
                <div className="space-y-6 pb-6">
                {/* Trending Topics */}
                <TrendingTopics />

              {/* Trending Creators */}
              <Card className="bg-transparent border-none py-4">
                <CardHeader className="pb-4 px-[12px]">
                  <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                    Trending Creators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 md:w-9 md:h-9">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback>VB</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        Vitalik Buterin
                      </p>
                      <p className="truncate mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        Ethereum Foundation
                      </p>
                    </div>
                    <button className="flex items-center justify-center w-[60px] lg:w-[65px] xl:w-[68px] h-8 lg:h-9 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs lg:text-sm font-medium text-black hover:bg-[#FADEFD]/90 transition-all flex-shrink-0">
                      Follow
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 md:w-9 md:h-9">
                      <AvatarImage src="/diverse-female-avatar.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        Sarah Miller
                      </p>
                      <p className="truncate mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        DeFi Researcher
                      </p>
                    </div>
                    <button className="flex items-center justify-center w-[60px] lg:w-[65px] xl:w-[68px] h-8 lg:h-9 bg-[#FADEFD] border border-[#001425] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-xs lg:text-sm font-medium text-black hover:bg-[#FADEFD]/90 transition-all flex-shrink-0">
                      Follow
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <SuggestedConnections />

              {/* Active Rooms */}
              <Card className="bg-transparent border-none">
                <CardHeader className="pb-4 px-[12px]">
                  <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                    Active Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-blue text-sm">🔒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        DeFi Builders
                      </p>
                      <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        47 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-yellow text-sm">🎮</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        Gaming Alpha
                      </p>
                      <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        23 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-green text-sm">💎</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        NFT Collectors
                      </p>
                      <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        31 online
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-veralux-green rounded-full flex-shrink-0"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Communities */}
              <Card className="bg-transparent border-none py-4">
                <CardHeader className="pb-4 px-[12px]">
                  <CardTitle className="font-semibold text-[rgba(229,247,253,0.4)] text-xs">
                    Popular Communities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-blue text-sm">🏗️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        DeFi Builders
                      </p>
                      <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        1.2k members
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleJoinCircle("DeFi Builders", e)}
                      className="flex items-center justify-center rounded-[10px] transition-all flex-shrink-0 w-[63.88px] h-8 bg-[#fadefe] border border-[#001425] text-xs font-medium text-black hover:bg-[#fadefe]/90"
                    >
                      Join
                    </button>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-veralux-yellow text-sm">🎮</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate text-[15px]">
                        NFT Gaming
                      </p>
                      <p className="mt-1 text-[15px]" style={{ color: "#9BB6CC" }}>
                        856 members
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleJoinCircle("NFT Gaming", e)}
                      className="flex items-center justify-center rounded-[10px] transition-all flex-shrink-0 w-[63.88px] h-8 bg-[#fadefe] border border-[#001425] text-xs font-medium text-black hover:bg-[#fadefe]/90"
                    >
                      Join
                    </button>
                  </div>
                </CardContent>
              </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
    </>
  );
}
