"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { joinedCircles, discoverCircles, type Circle } from "@/lib/circles-data";
import { cn } from "@/lib/utils";

interface CirclesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CirclesPopover({ isOpen, onClose }: CirclesPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("joined");
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCircleClick = (circle: Circle) => {
    if (circle.isJoined) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      // On mobile, add #channel hash by default
      if (isMobile) {
        router.push(`/?circle=${slugifyCircleName(circle.name)}&channel=general#channel`);
      } else {
        router.push(`/?circle=${slugifyCircleName(circle.name)}&channel=general`);
      }
      onClose();
    } else {
      // Handle join circle logic
      console.log("Joining circle:", circle.id);
    }
  };

  const filteredJoinedCircles = joinedCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (circle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const filteredDiscoverCircles = discoverCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (circle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the trigger button
        if (!target.closest('[data-circles-trigger]')) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const CircleCard = ({ circle }: { circle: Circle }) => (
    <Card
      className="group border-none py-[0] mb-[16px] transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-[0.98] rounded-lg overflow-hidden bg-[#9BB6CC0A] px-3"
      onClick={() => handleCircleClick(circle)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 py-3">
          {/* Top Row: Icon, Title/Description, Notification */}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl">
                {circle.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="font-[16px] text-base text-white truncate mb-0.5">
                {circle.name}
              </h3>
              
              {/* Description */}
              <p className="text-[12px] text-[#9BB6CC99] truncate">
                {circle.description}
              </p>
            </div>

            {/* Notification badge - far right - Only show if unreadCount > 0 */}
            {(circle.unreadCount ?? 0) > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#FADEFD] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[12px] text-[#000205] font-medium">
                  {circle.unreadCount}
                </span>
              </div>
            )}
          </div>

          {/* Stats Row - Start at same position as icon */}
          <div className="flex items-center gap-4 text-sm pl-3">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#9BB6CC]" />
              <span className="text-[12px] text-[#9BB6CC] font-medium">
                {circle.memberCount}
              </span>
              <span className="text-xs text-[#9BB6CC99]">members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#45D4A7] rounded-full flex-shrink-0" />
              <span className="text-[12px] text-[#45D4A7] font-medium">
                {circle.onlineMembers}
              </span>
              <span className="text-xs text-[#9BB6CC99]">Online</span>
            </div>
            {circle.isJoined && (
              <Badge
                className="text-xs h-5 px-2 bg-[#FADEFD0A] text-[#FADEFD] border-0 font-normal ml-auto"
              >
                Joined
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Circles Popover - Desktop Only */}
      <div
        ref={popoverRef}
        className={cn(
          "circles-popover",
          "fixed z-[60]",
          "shadow-2xl",
          "transform transition-all duration-200 ease-out",
          "hidden md:block",
          "w-[420px]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{
          top: "4.5rem",
          right: "1.5rem",
          height: "488px",
          maxHeight: "488px",
          background: "rgba(8, 14, 17, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(76, 216, 101, 0.2)" }}>
                  <Users className="h-3 w-3" style={{ color: "#4bd865" }} />
                </div>
                <h2 className="text-[15px] font-semibold text-white">
                  Circles
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 w-7 p-0 hover:bg-white/10 text-[#9BB6CC] hover:text-white rounded-md transition-all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-[#9BB6CC99] ml-7">
              Connect with your communities
            </p>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99] pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Search circles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-10 bg-[rgba(229,247,253,0.06)] border border-white/10 rounded-full text-sm text-white placeholder:text-[#9BB6CC99] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/30 transition-colors"
                style={{
                  fontFamily: "'Geist'",
                }}
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-white/10 text-[#9BB6CC99] hover:text-white transition-colors z-10"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList
              className="mx-4 grid w-auto grid-cols-2 gap-1"
              style={{
                background: "rgba(229, 247, 253, 0.04)",
                borderRadius: "22px",
                padding: "4px",
              }}
            >
              <TabsTrigger
                value="joined"
                className="text-sm font-medium text-[#9BB6CC99] relative transition-all py-2 px-4 flex items-center justify-center gap-1.5"
                style={{
                  ...(activeTab === "joined" && {
                    background: "rgba(229, 247, 253, 0.2)",
                    borderRadius: "18px",
                    color: "white",
                  }),
                }}
              >
                <div className="w-1.5 h-1.5 bg-[#4bd865] rounded-full" />
                <span>My</span>
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="text-sm font-medium text-[#9BB6CC99] relative transition-all py-2 px-4 flex items-center justify-center gap-1.5"
                style={{
                  ...(activeTab === "discover" && {
                    background: "rgba(229, 247, 253, 0.2)",
                    borderRadius: "18px",
                    color: "white",
                  }),
                }}
              >
                <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
                <span>Discover</span>
              </TabsTrigger>
            </TabsList>

            {/* Joined Circles Tab */}
            <TabsContent
              value="joined"
              className="flex-1 px-4 pb-3 mt-3 overflow-hidden flex flex-col min-h-0"
            >
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="space-y-0">
                    {filteredJoinedCircles.length > 0 ? (
                      filteredJoinedCircles.map((circle) => (
                        <CircleCard key={circle.id} circle={circle} />
                      ))
                    ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12 text-muted-foreground max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-3xl">🔍</div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        {searchQuery ? "No matches found" : "No circles yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {searchQuery
                          ? "Try adjusting your search terms or browse the Discover tab for new circles."
                          : "Join some circles to connect with communities that interest you."}
                      </p>
                    </div>
                  </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Discover Circles Tab */}
            <TabsContent
              value="discover"
              className="flex-1 px-4 pb-3 mt-3 overflow-hidden flex flex-col min-h-0"
            >
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="space-y-0 pr-1">
                    {filteredDiscoverCircles.length > 0 ? (
                      filteredDiscoverCircles.map((circle) => (
                        <CircleCard key={circle.id} circle={circle} />
                      ))
                    ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12 text-muted-foreground max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-violet-100 to-cyan-100 dark:from-blue-900/30 dark:via-violet-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-3xl">🌐</div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        No circles found
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Try different search terms or check back later for new
                        circles to discover.
                      </p>
                    </div>
                  </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

