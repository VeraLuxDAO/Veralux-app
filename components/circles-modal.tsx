"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Lock, Globe, Crown, Shield, Hash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { joinedCircles, discoverCircles, type Circle } from "@/lib/circles-data";

interface CirclesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Re-export for backward compatibility
export const mockJoinedCircles = joinedCircles;
const mockDiscoverCircles = discoverCircles;

export function CirclesModal({ isOpen, onClose }: CirclesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("joined");
  const router = useRouter();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [isOpen]);

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

  const filteredJoinedCircles = mockJoinedCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (circle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const filteredDiscoverCircles = mockDiscoverCircles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (circle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

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
              <h3 className="font-medium text-base text-white truncate mb-0.5">
                {circle.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-[#9BB6CC99] truncate">
                {circle.description}
              </p>
            </div>

            {/* Notification badge - far right - Only show if unreadCount > 0 */}
            {circle.unreadCount && circle.unreadCount > 0 && (
              <div className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs text-white font-medium">
                  {circle.unreadCount}
                </span>
              </div>
            )}
          </div>

          {/* Stats Row - Start at same position as icon */}
          <div className="flex items-center gap-4 text-sm pl-3">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#9BB6CC99]" />
              <span className="text-sm text-white font-medium">
                {circle.memberCount}
              </span>
              <span className="text-xs text-[#9BB6CC99]">members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#4bd865] rounded-full flex-shrink-0" />
              <span className="text-sm text-white font-medium">
                {circle.onlineMembers}
              </span>
              <span className="text-xs text-[#9BB6CC99]">Online</span>
            </div>
            {circle.isJoined && (
              <Badge
                className="text-xs h-5 px-2 bg-[rgba(76,216,101,0.2)] text-[#4bd865] border-0 font-normal ml-auto"
              >
                Joined
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl h-[85vh] max-h-[600px] bg-[#080E1199] p-0 gap-0 border-[0.4px] border-[rgba(255,255,255,0.08)] rounded-[16px]"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        showCloseButton={false}
      >
        <DialogHeader className="p-4 sm:p-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + Title + Tagline */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(76, 216, 101, 0.2)" }}>
                <Users className="h-5 w-5" style={{ color: "#4bd865" }} />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-semibold text-white text-left mb-0.5">
                  Circles
                </DialogTitle>
                <p className="text-xs text-[#9BB6CC99] text-left">
                  Connect with your communities
                </p>
              </div>
            </div>

            {/* Right: Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-[#9BB6CC99] hover:text-white transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Bar */}
          <div className="px-4 sm:px-4">
            <div className="relative flex flex-row items-center py-2 px-3 w-full h-10 bg-[rgba(229,247,253,0.06)] rounded-full">
              {/* Search Icon - Inside Left */}
              <Search className="w-4 h-4 text-[rgba(255,255,255,0.4)] mr-2 flex-shrink-0" />
              <Input
                placeholder="Search circles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={false}
                className="w-full h-full border-0 bg-transparent font-medium text-sm text-left text-white placeholder:text-[rgba(255,255,255,0.4)] focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
              {/* Clear Button (if searching) */}
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-white/10 text-[#9BB6CC99] hover:text-white transition-colors flex-shrink-0"
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
              className="mx-4 sm:mx-4 mt-4 grid w-auto grid-cols-2 gap-1"
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
              className="flex-1 px-4 sm:px-4 pb-3 sm:pb-4 mt-3 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-0">
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
            </TabsContent>

            {/* Discover Circles Tab */}
            <TabsContent
              value="discover"
              className="flex-1 px-4 sm:px-5 pb-3 sm:pb-5 mt-3 overflow-hidden"
            >
              <div className="h-full overflow-y-auto space-y-0 pr-1 sm:pr-2">
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
            </TabsContent>
          </Tabs>

          {/* Close Button */}
          <div className="p-4 sm:p-5 pt-3 border-t border-white/10">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-10 text-sm font-medium bg-[rgba(255,255,255,0.05)] border-white/10 text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-white/20 transition-all rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
