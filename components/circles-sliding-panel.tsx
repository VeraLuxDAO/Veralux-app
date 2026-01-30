"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { type ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { getCirclesRecord, type Circle } from "@/lib/circles-data";
import { MemberProfileView } from "@/components/member-profile-view";
import { CircleHeader } from "@/components/circles/circle-header";
import { ChannelsList } from "@/components/circles/channels-list";
import { MembersList } from "@/components/circles/members-list";
import { CircleChatArea } from "@/components/circles/circle-chat-area";
import { CircleAvatarRail } from "@/components/circles/circle-avatar-rail";
import {
  mockChannelCategories,
  mockMembers,
  mockMessages,
  type ChannelCategory,
  type Member,
} from "@/lib/circles-mock-data";

interface CirclesSlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const circlesList = Object.values(getCirclesRecord());

export function CirclesSlidingPanel({
  isOpen,
  onClose,
}: CirclesSlidingPanelProps) {
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [channelCategories, setChannelCategories] = useState(mockChannelCategories);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [isMembersVisible, setIsMembersVisible] = useState(true);
  const [mobileView, setMobileView] = useState<"channel" | "chatting" | "members">("channel");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMemberProfileOpen, setIsMemberProfileOpen] = useState(false);
  const [leftSidebarWidth] = useState(300);
  const [rightSidebarWidth] = useState(270);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Sync selectedCircle and activeChannelId with URL
  useEffect(() => {
    const circleSlug = searchParams.get("circle");
    const channelSlug = searchParams.get("channel");
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile || isOpen) {
      if (circleSlug) {
        const circle = circlesList.find(
          (c) => slugifyCircleName(c.name) === circleSlug
        );
        
        if (circle) {
          setSelectedCircle(circle);
          
          if (channelSlug) {
            setActiveChannelId(channelSlug);
          } else {
            // Only update URL if channel is not already set to general
            if (activeChannelId !== "general") {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("private_rooms");
              params.set("channel", "general");
              const currentPath = pathname || "/";
              if (isMobile) {
                router.push(`${currentPath}?${params.toString()}#channel`);
              } else {
                router.push(`${currentPath}?${params.toString()}`);
              }
            }
            setActiveChannelId("general");
          }
        } else {
          setSelectedCircle(null);
          setActiveChannelId("general");
        }
      } else {
        setSelectedCircle(null);
        setActiveChannelId("general");
      }
    }
  }, [isOpen, searchParams, router]);

  // Sync mobile view with URL hash
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile && selectedCircle) {
      const hash = window.location.hash;
      if (hash === "#members") {
        setMobileView("members");
        setIsMembersVisible(true);
      } else if (hash === "#chatting") {
        setMobileView("chatting");
        setIsMembersVisible(false);
      } else {
        setMobileView("channel");
        setIsMembersVisible(false);
        if (!hash) {
          const params = new URLSearchParams(searchParams.toString());
          const currentPath = pathname || "/";
          router.push(`${currentPath}?${params.toString()}#channel`);
        }
      }
    }
  }, [selectedCircle, router, searchParams, pathname]);

  // Listen to hash changes
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#members") {
        setMobileView("members");
        setIsMembersVisible(true);
      } else if (hash === "#chatting") {
        setMobileView("chatting");
        setIsMembersVisible(false);
      } else if (hash === "#channel") {
        setMobileView("channel");
        setIsMembersVisible(false);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Lock body scroll when panel is open
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

  // Hide AI button when circles panel is open
  useEffect(() => {
    const aiButton = document.querySelector(".desktop-ai-tab-container");
    if (aiButton) {
      if (isOpen) {
        (aiButton as HTMLElement).style.transition = "opacity 0.3s ease";
        (aiButton as HTMLElement).style.opacity = "0";
        (aiButton as HTMLElement).style.pointerEvents = "none";
      } else {
        (aiButton as HTMLElement).style.transition = "opacity 0.3s ease";
        (aiButton as HTMLElement).style.opacity = "1";
        (aiButton as HTMLElement).style.pointerEvents = "auto";
      }
    }

    return () => {
      const aiButton = document.querySelector(".desktop-ai-tab-container");
      if (aiButton) {
        (aiButton as HTMLElement).style.opacity = "1";
        (aiButton as HTMLElement).style.pointerEvents = "auto";
      }
    };
  }, [isOpen]);

  const handleSendMessage = useCallback((content: string, images?: File[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;

    if (images && images.length > 0) {
      const imagePromises = Array.from(images).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((imageUrls) => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content,
          authorId: "current-user",
          authorName: "You",
          timestamp: new Date(),
          type: imageUrls.length > 0 ? "image" : "text",
          isOwn: true,
          images: imageUrls,
        };
        setMessages((prev) => [...prev, newMessage]);
      });
    } else {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        authorId: "current-user",
        authorName: "You",
        timestamp: new Date(),
        type: "text",
        isOwn: true,
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  }, []);

  const handleExitCircle = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    onClose();
  };

  const handleSwitchCircle = useCallback((circle: Circle) => {
    const circleSlug = slugifyCircleName(circle.name);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const params = new URLSearchParams(searchParams.toString());
    // Remove private_rooms parameter when switching to a circle
    params.delete("private_rooms");
    params.set("circle", circleSlug);
    params.set("channel", "general");
    const currentPath = pathname || "/";
    
    if (isMobile) {
      router.push(`${currentPath}?${params.toString()}#channel`);
    } else {
      router.push(`${currentPath}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const handleChannelSelect = useCallback((channelId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setActiveChannelId(channelId);
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile && selectedCircle) {
      const circleSlug = slugifyCircleName(selectedCircle.name);
      const params = new URLSearchParams(searchParams.toString());
      // Remove private_rooms parameter when switching channels
      params.delete("private_rooms");
      params.set("circle", circleSlug);
      params.set("channel", channelId);
      const currentPath = pathname || "/";
      router.push(`${currentPath}?${params.toString()}#chatting`);
      setMobileView("chatting");
      return;
    }
    
    if (selectedCircle) {
      const circleSlug = slugifyCircleName(selectedCircle.name);
      const params = new URLSearchParams(searchParams.toString());
      // Remove private_rooms parameter when switching channels
      params.delete("private_rooms");
      params.set("circle", circleSlug);
      params.set("channel", channelId);
      const currentPath = pathname || "/";
      router.push(`${currentPath}?${params.toString()}`);
    }
  }, [selectedCircle, searchParams, pathname, router]);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setChannelCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isCollapsed: !category.isCollapsed }
          : category
      )
    );
  }, []);

  const activeChannel = useMemo(() => {
    return channelCategories
      .flatMap((cat) => cat.channels)
      .find((ch) => ch.id === activeChannelId);
  }, [channelCategories, activeChannelId]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldShowMobile = isMobile && selectedCircle;
  const shouldShowDesktop = isOpen;

  if (!shouldShowMobile && !shouldShowDesktop) return null;

  return (
    <>
      {/* Backdrop - Desktop Only */}
      <div
        className={cn(
          "fixed inset-0 z-[44]",
          "hidden md:block",
          "bg-[rgba(8,14,17,0.92)] backdrop-blur-[18px]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Mobile View - Responsive Layout (Channel Sidebar + Chat Area) when Circle Selected */}
      {shouldShowMobile && selectedCircle && (
        <>
          <div className="fixed inset-0 z-[130] md:hidden bg-[#05080d] flex flex-row pt-0">
            {/* Channel Sidebar - Show when hash is #channel */}
            {mobileView === "channel" && (
              <div className="flex flex-col relative overflow-hidden w-full flex-shrink-0 bg-[#0000004A]">
                <div className="px-4 pt-5 pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10"
                      title="Close circle"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-lg">{selectedCircle.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-white truncate leading-tight font-['Geist']">
                          {selectedCircle.name}
                        </h2>
                        <p className="text-xs text-[#9BB6CC99] leading-tight font-['Geist']">
                          {selectedCircle.onlineMembers} online
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <ChannelsList
                  categories={channelCategories}
                  activeChannelId={activeChannelId}
                  onChannelSelect={handleChannelSelect}
                  onCategoryToggle={handleCategoryToggle}
                />
              </div>
            )}

            {/* Chat Area - Show when hash is #chatting */}
            {mobileView === "chatting" && activeChannelId && activeChannel && (
              <div className="flex flex-col relative overflow-hidden w-full flex-shrink-0">
                <div className="flex-shrink-0 px-4 pt-8 pb-4 bg-[#0000004A] border-b border-[#FFFFFF14]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          const currentPath = pathname || "/";
                          router.push(`${currentPath}?${params.toString()}#channel`);
                          setMobileView("channel");
                        }}
                        className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 mr-2"
                        title="Back to channels"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <h3 className="font-semibold text-white text-base flex items-center gap-2">
                        {activeChannel.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 z-10" />
                      <Input
                        placeholder="Search in channel"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mobile-search-input pr-4 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-sm placeholder:text-[#9BB6CC99] focus:ring-0 border-0 h-9 font-['Geist']"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newHash = window.location.hash === "#members" ? "#chatting" : "#members";
                        const params = new URLSearchParams(searchParams.toString());
                        const currentPath = pathname || "/";
                        router.push(`${currentPath}?${params.toString()}${newHash}`);
                        setMobileView(newHash === "#members" ? "members" : "chatting");
                        setIsMembersVisible(newHash === "#members");
                      }}
                      className="p-0 rounded-full text-white hover:bg-white/10 bg-gradient-to-b from-[#45D4A7] to-[#4DF3FF] flex-shrink-0 h-9 w-9"
                      title={isMembersVisible ? "Hide members" : "Show members"}
                    >
                      <Users className="h-5 w-5 transition-colors text-white" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pt-6 pb-3" style={{
                  background: "radial-gradient(circle at top, rgba(61,80,120,0.25), transparent 45%), #05080d",
                }}>
                  <ChatInput onSendMessage={handleSendMessage} placeholder="Send Message" />
                </div>
              </div>
            )}

            {/* Members Full Page - Show when hash is #members */}
            {mobileView === "members" && selectedCircle && (
              <div className="flex flex-col relative overflow-hidden w-full h-full flex-shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-right-2 bg-[#05080d]">
                {isMemberProfileOpen && selectedMember ? (
                  <MemberProfileView
                    member={selectedMember}
                    isOpen={true}
                    onClose={() => {
                      setIsMemberProfileOpen(false);
                      setSelectedMember(null);
                    }}
                    isMobile={true}
                    showInPlace={true}
                  />
                ) : (
                  <MembersList
                    circle={selectedCircle}
                    members={mockMembers}
                    searchQuery={memberSearchQuery}
                    onSearchChange={setMemberSearchQuery}
                    onMemberClick={(member) => {
                      setSelectedMember(member);
                      setIsMemberProfileOpen(true);
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {mobileView === "channel" && (
            <div className="fixed bottom-0 left-0 right-0 z-[120] md:hidden">
              <MobileBottomBar />
            </div>
          )}
        </>
      )}

      {/* Desktop Sliding Panel */}
      <div
        className={cn(
          "fixed inset-0 z-[48]",
          "hidden md:block overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full pt-[96px]">
          {selectedCircle ? (
            <div className="flex h-full overflow-hidden relative pb-[12px] px-[12px]">
              <CircleAvatarRail
                circles={circlesList}
                selectedCircleId={selectedCircle?.id}
                onSelect={handleSwitchCircle}
                onAdd={() => console.log("Open circles modal")}
                className="mr-3"
              />

              <div className="flex-shrink-0 flex flex-col relative overflow-visible border border-[#FFFFFF14] rounded-[24px]" style={{ width: `${leftSidebarWidth}px` }}>
                <CircleHeader circle={selectedCircle} onBack={handleExitCircle} />
                <div className="flex-1 flex min-h-0">
                  <ChannelsList
                    categories={channelCategories}
                    activeChannelId={activeChannelId}
                    onChannelSelect={handleChannelSelect}
                    onCategoryToggle={handleCategoryToggle}
                  />
                </div>
              </div>

              {activeChannel && (
                <CircleChatArea
                  channel={activeChannel}
                  messages={messages}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSendMessage={handleSendMessage}
                  isMembersVisible={isMembersVisible}
                  onToggleMembers={() => setIsMembersVisible(!isMembersVisible)}
                  mobileView={mobileView}
                />
              )}

              {isMembersVisible && (
                <div className="hidden md:flex flex-shrink-0 flex-col relative overflow-hidden border border-[#FFFFFF14] rounded-[24px]" style={{ width: `${rightSidebarWidth}px`, zIndex: 10 }}>
                  {isMemberProfileOpen && selectedMember ? (
                    <MemberProfileView
                      member={selectedMember}
                      isOpen={true}
                      onClose={() => {
                        setIsMemberProfileOpen(false);
                        setSelectedMember(null);
                      }}
                      isMobile={false}
                      showInPlace={true}
                    />
                  ) : (
                    <MembersList
                      circle={selectedCircle}
                      members={mockMembers}
                      searchQuery={memberSearchQuery}
                      onSearchChange={setMemberSearchQuery}
                      onMemberClick={(member) => {
                        setSelectedMember(member);
                        setIsMemberProfileOpen(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-[#0000004A]">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-16 w-16 text-[#9BB6CC]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Select a Circle
                </h3>
                <p className="text-[#9BB6CC] text-sm">
                  Choose a circle to start chatting with your community
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Profile View - Mobile Only */}
      {typeof window !== 'undefined' && window.innerWidth < 768 && (
        <MemberProfileView
          member={selectedMember}
          isOpen={isMemberProfileOpen}
          onClose={() => {
            setIsMemberProfileOpen(false);
            setSelectedMember(null);
          }}
          isMobile={true}
        />
      )}
    </>
  );
}
