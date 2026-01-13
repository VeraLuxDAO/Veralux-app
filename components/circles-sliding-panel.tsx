"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  Hash,
  Volume2,
  Lock,
  ChevronDown,
  Users,
  Plus,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import {
  ChatMessageComponent,
  type ChatMessage,
} from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { getCirclesRecord, type Circle } from "@/lib/circles-data";
import { MemberProfileView } from "@/components/member-profile-view";

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  isPrivate: boolean;
  unreadCount?: number;
}

interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
  isCollapsed?: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  role?: string;
}

interface CirclesSlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Use shared circles data
const mockCircles = getCirclesRecord();

const mockChannelCategories: ChannelCategory[] = [
  {
    id: "text-channels",
    name: "Text Channels",
    channels: [
      {
        id: "general",
        name: "general",
        type: "text",
        isPrivate: false,
        unreadCount: 3,
      },
      {
        id: "announcements",
        name: "announcements",
        type: "text",
        isPrivate: false,
      },
      {
        id: "dev-discussion",
        name: "dev-discussion",
        type: "text",
        isPrivate: false,
        unreadCount: 1,
      },
      {
        id: "trading-signals",
        name: "trading-signals",
        type: "text",
        isPrivate: true,
        unreadCount: 5,
      },
    ],
  },
  {
    id: "voice-channels",
    name: "Voice Channels",
    channels: [
      { id: "general-voice", name: "General", type: "voice", isPrivate: false },
      { id: "dev-hangout", name: "Dev Hangout", type: "voice", isPrivate: false },
      { id: "trading-room", name: "Trading Room", type: "voice", isPrivate: true },
    ],
  },
];

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Vitalik Buterin",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    role: "Admin",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/diverse-female-avatar.png",
    status: "online",
    role: "Moderator",
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "/developer-avatar.png",
    status: "idle",
  },
  {
    id: "4",
    name: "Clara Jin",
    status: "online",
  },
  {
    id: "5",
    name: "Maxwell",
    status: "offline",
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Welcome to the DeFi Builders circle! 🎉",
    authorId: "system",
    authorName: "System",
    timestamp: new Date(Date.now() - 86400000),
    type: "system",
    isOwn: false,
  },
  {
    id: "2",
    content:
      "Hey everyone! Just deployed a new liquidity pool on Uniswap V4. The gas optimizations are incredible! 🚀",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3600000),
    type: "text",
    isOwn: false,
    reactions: [
      { emoji: "🚀", count: 12, hasReacted: false },
      { emoji: "🔥", count: 8, hasReacted: true },
    ],
  },
  {
    id: "3",
    content: "That's amazing! What kind of gas savings are you seeing compared to V3?",
    authorId: "sarah",
    authorName: "Sarah Miller",
    authorAvatar: "/diverse-female-avatar.png",
    timestamp: new Date(Date.now() - 3500000),
    type: "text",
    isOwn: false,
    replyTo: {
      id: "2",
      authorName: "Vitalik Buterin",
      content: "Hey everyone! Just deployed a new liquidity pool on Uniswap V4...",
    },
  },
  {
    id: "4",
    content: "Around 40% reduction in gas costs for complex swaps. The hook system is a game changer!",
    authorId: "vitalik",
    authorName: "Vitalik Buterin",
    authorAvatar: "/diverse-user-avatars.png",
    timestamp: new Date(Date.now() - 3400000),
    type: "text",
    isOwn: false,
  },
  {
    id: "5",
    content: "This is exactly what we need for mainstream adoption. Lower fees = more users 💪",
    authorId: "current-user",
    authorName: "You",
    timestamp: new Date(Date.now() - 1800000),
    type: "text",
    isOwn: true,
  },
];

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
  const [mobileView, setMobileView] = useState<"channel" | "chatting" | "members">("channel"); // Mobile view state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMemberProfileOpen, setIsMemberProfileOpen] = useState(false);
  const [isSwitchCircleOpen, setIsSwitchCircleOpen] = useState(false);
  const [switchCircleSearch, setSwitchCircleSearch] = useState("");
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(300);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(240);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const switchCircleRef = useRef<HTMLDivElement>(null);
  const switchCirclePopupRef = useRef<HTMLDivElement>(null);
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // Load saved sidebar widths from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLeftWidth = localStorage.getItem('circle-left-sidebar-width');
      const savedRightWidth = localStorage.getItem('circle-right-sidebar-width');
      if (savedLeftWidth) {
        setLeftSidebarWidth(parseInt(savedLeftWidth, 10));
      }
      if (savedRightWidth) {
        setRightSidebarWidth(parseInt(savedRightWidth, 10));
      }
    }
  }, []);

  // Save sidebar widths to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('circle-left-sidebar-width', leftSidebarWidth.toString());
    }
  }, [leftSidebarWidth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('circle-right-sidebar-width', rightSidebarWidth.toString());
    }
  }, [rightSidebarWidth]);

  // Handle left sidebar resize
  useEffect(() => {
    if (!isResizingLeft) return;

    const panel = leftResizeRef.current?.closest('.circles-sliding-panel') as HTMLElement;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const panelLeft = panel.getBoundingClientRect().left;
      const newWidth = e.clientX - panelLeft;
      // Min width: 200px, Max width: 500px
      const clampedWidth = Math.max(200, Math.min(500, newWidth));
      setLeftSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft]);

  // Handle right sidebar resize
  useEffect(() => {
    if (!isResizingRight) return;

    const panel = rightResizeRef.current?.closest('.circles-sliding-panel') as HTMLElement;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const panelRight = panel.getBoundingClientRect().right;
      const newWidth = panelRight - e.clientX;
      // Min width: 200px, Max width: 500px (increased for better profile view)
      const clampedWidth = Math.max(200, Math.min(500, newWidth));
      setRightSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizingRight(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingRight]);

  // Sync selectedCircle and activeChannelId with URL
  useEffect(() => {
    const circleSlug = searchParams.get("circle");
    const channelSlug = searchParams.get("channel");
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Always check URL for circle selection when panel is open or on mobile
    if (isMobile || isOpen) {
      if (circleSlug) {
        const circle = Object.values(mockCircles).find(
          (c) => slugifyCircleName(c.name) === circleSlug
        );
        
        if (circle) {
          setSelectedCircle(circle);
          
          // If channel is in URL, set it as active
          if (channelSlug) {
            setActiveChannelId(channelSlug);
          } else {
            // If circle is selected but no channel, default to "general" and update URL
            if (typeof window !== 'undefined') {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set("channel", "general");
              // On mobile, add #channel hash by default
              if (isMobile) {
                currentUrl.hash = "#channel";
              }
              router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
            }
            setActiveChannelId("general");
          }
        } else {
          // Circle not found - reset selection
          setSelectedCircle(null);
          setActiveChannelId("general");
        }
      } else {
        setSelectedCircle(null);
        setActiveChannelId("general");
      }
    } else if (!isOpen && !isMobile) {
      // On desktop, when panel closes, keep the selection but don't update URL
      // This allows the circle to persist when navigating
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
        // If no hash and circle is selected, set default hash to #channel
        if (!hash) {
          const currentUrl = new URL(window.location.href);
          currentUrl.hash = "#channel";
          router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
        }
      }
    }
  }, [selectedCircle, router]);

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

    // Call immediately to sync on mount
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

  const handleSendMessage = (content: string, images?: File[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;

    // Convert images to data URLs
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
      // No images, create message immediately
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
  };

  const handleSwitchCircle = (circle: Circle) => {
    const circleSlug = slugifyCircleName(circle.name);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      router.push(`/?circle=${circleSlug}&channel=general#channel`);
    } else {
      router.push(`/?circle=${circleSlug}&channel=general`);
    }
    
    setIsSwitchCircleOpen(false);
    setSwitchCircleSearch("");
  };

  // Close popup when clicking outside (but allow scrolling)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside the popup or the button that opens it
      const isInsidePopup = switchCirclePopupRef.current?.contains(target);
      const isInsideButton = switchCircleRef.current?.contains(target);
      
      // Only close if click is outside both the popup and the button
      if (!isInsidePopup && !isInsideButton) {
        setIsSwitchCircleOpen(false);
      }
    };

    if (isSwitchCircleOpen) {
      // Use a small delay to avoid closing immediately when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    return undefined;
  }, [isSwitchCircleOpen]);

  const handleChannelSelect = (channelId: string, e?: React.MouseEvent) => {
    // Prevent default button behavior and event propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setActiveChannelId(channelId);
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // On mobile, update URL with channel parameter and hash
    if (isMobile && selectedCircle) {
      const circleSlug = slugifyCircleName(selectedCircle.name);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("circle", circleSlug);
      currentUrl.searchParams.set("channel", channelId);
      // Set hash to #chatting when channel is selected
      currentUrl.hash = "#chatting";
      router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
      setMobileView("chatting");
      
      // Dispatch custom event to notify navigation layout of hash change
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("hash-updated"));
        // Also manually update window.location.hash to ensure it's set
        if (window.location.hash !== "#chatting") {
          window.history.replaceState(null, "", currentUrl.pathname + currentUrl.search + currentUrl.hash);
        }
      }, 0);
      
      return; // Don't navigate away, just update URL
    }
    
    // On desktop, update URL with channel parameter
    if (selectedCircle) {
      const circleSlug = slugifyCircleName(selectedCircle.name);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("circle", circleSlug);
      currentUrl.searchParams.set("channel", channelId);
      router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setChannelCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isCollapsed: !category.isCollapsed }
          : category
      )
    );
  };

  const activeChannel = channelCategories
    .flatMap((cat) => cat.channels)
    .find((ch) => ch.id === activeChannelId);

  // On mobile, show the view if there's a selected circle (from URL), even if panel isn't "open"
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldShowMobile = isMobile && selectedCircle;
  const shouldShowDesktop = isOpen;

  if (!shouldShowMobile && !shouldShowDesktop) return null;

  return (
    <>
      {/* Backdrop - Desktop Only */}
      <div
        className={cn(
          "fixed inset-0 z-[65] transition-opacity duration-300",
          "hidden md:block",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        style={{ top: "5rem" }}
      />

      {/* Mobile View - Responsive Layout (Channel Sidebar + Chat Area) when Circle Selected */}
      {shouldShowMobile && selectedCircle && (
        <>
          <div
            className={cn(
              "fixed inset-0 z-[130] md:hidden",
              "bg-[#05080d]",
              "flex flex-row",
              "pt-0" // Space for bottom navigation bar
            )}
          >
            {/* Channel Sidebar - Show when hash is #channel */}
            {mobileView === "channel" && (
              <div
                className="flex flex-col relative overflow-hidden w-full flex-shrink-0 transition-all duration-300"
                style={{
                  background: "#0000004A",
                }}
              >
              {/* Circle Header */}
              <div className="px-4 pt-5 pb-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
                    title="Close circle"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-lg">{selectedCircle.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm font-semibold text-white truncate leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.name}
                      </h2>
                      <p
                        className="text-xs text-[#9BB6CC99] leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.onlineMembers} online
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channels List */}
              <ScrollArea className="flex-1 overflow-hidden">
                <div className="px-6 pb-4">
                  {channelCategories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(category.id)}
                        className="w-full flex items-center justify-between  py-1 text-xs font-semibold text-white hover:text-white transition-colors uppercase tracking-wide"
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            category.isCollapsed && "-rotate-90"
                          )}
                        />
                      </button>
                      {!category.isCollapsed && (
                        <div className="mt-1 space-y-0.5">
                          {category.channels.map((channel) => (
                            <button
                              key={channel.id}
                              type="button"
                              onClick={(e) => handleChannelSelect(channel.id, e)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all",
                                activeChannelId === channel.id
                                  ? "bg-[#5865F2]/20 text-white"
                                  : "text-[#9BB6CC] hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {channel.type === "text" ? (
                                <Hash className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <Volume2 className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="flex-1 truncate text-left">
                                {channel.name}
                              </span>
                              {channel.isPrivate && (
                                <Lock className="h-3 w-3 flex-shrink-0" />
                              )}
                              {channel.unreadCount && channel.unreadCount > 0 && (
                                <Badge className="h-4 min-w-4 px-1 text-xs bg-[#FADEFD] text-[#000205]">
                                  {channel.unreadCount}
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              </div>
            )}

            {/* Chat Area - Show when hash is #chatting */}
            {mobileView === "chatting" && activeChannelId && activeChannel && (
              <div className="flex flex-col relative overflow-hidden w-full flex-shrink-0 transition-all duration-300">
                {/* Chat Header */}
                <div className="flex-shrink-0 px-4 pt-8 pb-4 bg-[#0000004A] border-b border-[#FFFFFF14]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentUrl = new URL(window.location.href);
                          currentUrl.hash = "#channel";
                          router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                          setMobileView("channel");
                        }}
                        className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all mr-2"
                        title="Back to channels"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      {activeChannel.type === "text" ? (
                        <Hash className="h-5 w-5 text-[#9BB6CC]" />
                      ) : (
                        <Volume2 className="h-5 w-5 text-[#9BB6CC]" />
                      )}
                      <h3 className="font-semibold text-white text-base">
                        {activeChannel.name}
                      </h3>
                      {activeChannel.isPrivate && (
                        <Lock className="h-4 w-4 text-[#9BB6CC]" />
                      )}
                    </div>
                  </div>
                  {/* Search and Userlist buttons - Mobile only */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 z-10" />
                      <Input
                        placeholder="Search in channel"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mobile-search-input pr-4 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-sm placeholder:text-[#9BB6CC99] focus:ring-0 border-0"
                        style={{ 
                          fontFamily: "'Geist'",
                          height: "36px !important",
                          maxHeight: "36px !important",
                          minHeight: "36px !important"
                        }}
                      />
                    </div>
                    {/* User List Toggle Button - Mobile: 36x36 */}
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        if (isMobile && selectedCircle) {
                          const currentUrl = new URL(window.location.href);
                          if (window.location.hash === "#members") {
                            // Close members - go back to chatting view
                            currentUrl.hash = "#chatting";
                            router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                            setMobileView("chatting");
                            setIsMembersVisible(false);
                          } else {
                            // Open members - set hash to #members
                            currentUrl.hash = "#members";
                            router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                            setMobileView("members");
                            setIsMembersVisible(true);
                          }
                        } else {
                          // Desktop: toggle sidebar
                          setIsMembersVisible(!isMembersVisible);
                        }
                      }}
                      className="mobile-members-button p-0 rounded-full text-white hover:bg-white/10 transition-all bg-gradient-to-b from-[#45D4A7] to-[#4DF3FF] flex-shrink-0 h-9 w-9 cursor-pointer"
                      style={{
                        height: "36px",
                        width: "36px",
                        minHeight: "36px",
                        minWidth: "36px",
                        maxHeight: "36px",
                        maxWidth: "36px"
                      }}
                      title={isMembersVisible ? "Hide members" : "Show members"}
                    >
                      <Users className={cn(
                        "h-5 w-5 md:h-4 md:w-4 transition-colors",
                        isMembersVisible ? "text-white" : "text-[#9BB6CC]"
                      )} />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  className="flex-1 overflow-y-auto px-4 pt-6 pb-3"
                  style={{
                    background:
                      "radial-gradient(circle at top, rgba(61,80,120,0.25), transparent 45%), #05080d",
                  }}
                >
                  <div className="space-y-3 max-w-4xl">
                    {messages.map((message, index) => {
                      const showAvatar =
                        index === 0 ||
                        messages[index - 1]?.authorId !== message.authorId;
                      const isGrouped =
                        !showAvatar &&
                        message.type !== "system" &&
                        messages[index - 1]?.type !== "system";

                      return (
                        <ChatMessageComponent
                          key={message.id}
                          message={message}
                          showAvatar={showAvatar}
                          isGrouped={isGrouped}
                        />
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div 
                  className="flex-shrink-0 pt-3 pb-8 border-t border-white/5"
                  style={{
                    background: "rgba(8, 14, 17, 0.6)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    placeholder="Send Message"
                  />
                </div>
              </div>
            )}

            {/* Members Full Page - Show when hash is #members */}
            {mobileView === "members" && selectedCircle && (
              <div className="flex flex-col relative overflow-hidden w-full h-full flex-shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-right-2 bg-[#05080d]">
                {/* Show Member Profile or Member List */}
                {isMemberProfileOpen && selectedMember ? (
                  /* Member Profile View - In Place (Mobile) */
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
                  <>
                    {/* Members Header */}
                    <div className="px-4 pt-5 pb-4 flex-shrink-0 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentUrl = new URL(window.location.href);
                              // Go back to chatting view if we came from there, otherwise go to channel
                              if (activeChannelId) {
                                currentUrl.hash = "#chatting";
                                router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                                setMobileView("chatting");
                              } else {
                                currentUrl.hash = "#channel";
                                router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                                setMobileView("channel");
                              }
                              setIsMembersVisible(false);
                            }}
                            className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all mr-2"
                            title="Back"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <div className="flex items-center gap-2">
                            {/* Icon - colorful geometric shape */}
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#5865F2] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center">
                              <Users className="h-3 w-3 text-white" />
                            </div>
                            <h3
                              className="text-[16px] font-semibold text-white"
                              style={{ fontFamily: "'Geist'" }}
                            >
                              Members
                            </h3>
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#9BB6CC] ml-11">
                        {selectedCircle.memberCount}&nbsp; • <span className="text-[#45D4A7]">{selectedCircle.onlineMembers}</span>&nbsp;Online
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="px-4 py-3 flex-shrink-0 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99]" />
                        <Input
                          placeholder="Search Members"
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          className="pl-10 pr-3 h-9 bg-[rgba(229,247,253,0.06)] border border-white/10 rounded-full text-sm text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:border-white/30"
                          style={{ fontFamily: "'Geist'" }}
                        />
                      </div>
                    </div>

                    {/* Members List */}
                    <ScrollArea className="flex-1 overflow-hidden">
                      <div className="px-2 py-6">
                        {/* Filter members by search and status */}
                        {(() => {
                          const filteredMembers = mockMembers.filter((member) =>
                            member.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
                          );
                          const onlineMembers = filteredMembers.filter(
                            (member) => member.status === "online" || member.status === "idle"
                          );
                          const offlineMembers = filteredMembers.filter(
                            (member) => member.status === "offline"
                          );

                          return (
                            <>
                              {/* ONLINE Section */}
                              {onlineMembers.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                                    ONLINE
                                  </h4>
                                  <div className="space-y-0.5">
                                    {onlineMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        onClick={() => {
                                          setSelectedMember(member);
                                          setIsMemberProfileOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-2 py-[6px] rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                      >
                                        <div className="relative">
                                          <Avatar className="h-9 w-9">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                                              {member.name[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div
                                            className={cn(
                                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2",
                                              member.status === "online"
                                                ? "bg-[#3ba55d] border-[#2b3642]"
                                                : "bg-[#faa81a] border-[#2b3642]"
                                            )}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[14px] text-[#9BB6CC] truncate">
                                            {member.name}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* OFFLINE Section */}
                              {offlineMembers.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                                    OFFLINE
                                  </h4>
                                  <div className="space-y-0.5">
                                    {offlineMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        onClick={() => {
                                          setSelectedMember(member);
                                          setIsMemberProfileOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                      >
                                        <div className="relative">
                                          <Avatar className="h-9 w-9">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                                              {member.name[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[14px] text-[#9BB6CC99] truncate">
                                            {member.name}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* No results */}
                              {filteredMembers.length === 0 && (
                                <div className="px-2 py-4 text-center">
                                  <p className="text-xs text-[#9BB6CC]">No members found</p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Bottom Bar - Only show when hash is #channel */}
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
          "circles-sliding-panel",
          "fixed h-[calc(100vh-5rem)] z-[70]",
          "shadow-[0_20px_45px_rgba(0,0,0,0.45)]",
          "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hidden md:block",
          "overflow-hidden",
          "md:left-[238px] lg:left-[258px] xl:left-[288px]",
          "md:right-[24px]",
          "w-[90vw] md:w-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          top: "5rem",
          background:
            "linear-gradient(145deg, rgba(14,20,28,0.95) 0%, rgba(8,12,18,0.92) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
        }}
      >
        {selectedCircle ? (
          <div className="flex h-full overflow-hidden relative">
            {/* Left Sidebar - Channels */}
            <div
              className="flex-shrink-0 flex flex-col relative overflow-visible"
              style={{ 
                width: `${leftSidebarWidth}px`,
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#0000004A",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Circle Header */}
              <div className="px-4 pt-5 pb-4 flex-shrink-0 relative">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
                    title="Close circle"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-lg">{selectedCircle.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm font-semibold text-white truncate leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.name}
                      </h2>
                      <p
                        className="text-xs text-[#9BB6CC99] leading-tight"
                        style={{ fontFamily: "'Geist'" }}
                      >
                        {selectedCircle.onlineMembers} online
                      </p>
                    </div>
                  </div>

                  <div className="relative" ref={switchCircleRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSwitchCircleOpen(!isSwitchCircleOpen)}
                      className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10 transition-all"
                      title="Switch circle"
                    >
                      {isSwitchCircleOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Switch Circle Popup - Positioned in sidebar */}
                {isSwitchCircleOpen && (
                  <div
                    ref={switchCirclePopupRef}
                    className="absolute top-full left-2 right-2 -mt-4 rounded-2xl z-[100] flex flex-col border border-white/8 backdrop-blur-[40px]"
                    style={{
                      background: "rgba(8, 14, 17, 0.95)",
                      boxShadow: "0px 334px 94px rgba(0, 0, 0, 0.01), 0px 214px 86px rgba(0, 0, 0, 0.04), 0px 120px 72px rgba(0, 0, 0, 0.15), 0px 53px 53px rgba(0, 0, 0, 0.26), 0px 13px 29px rgba(0, 0, 0, 0.29)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      maxHeight: "400px",
                      overflow: "hidden",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 flex-shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-[rgba(76,216,101,0.3)]" style={{ background: "rgba(76, 216, 101, 0.2)" }}>
                            <Users className="w-6 h-6 md:w-5 md:h-5" style={{ color: "#4bd865" }} />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-base md:text-[16px] font-semibold text-white">Switch Circle</h3>
                            <p className="text-[12px] text-[#9BB6CC99]" style={{ fontFamily: "'Geist'" }}>Connect with your communities</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 md:h-7 md:w-7 p-0 rounded-md hover:bg-white/10 text-white flex-shrink-0 border border-white/10 bg-white/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Open circles modal to create/join new circles
                            console.log("Open circles modal");
                          }}
                        >
                          <Plus className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="px-4 pb-6 flex-shrink-0">
                      <div className="relative flex flex-row items-center pl-3 w-full h-10 bg-[rgba(229,247,253,0.06)] rounded-full">
                        {/* Search Icon - Inside Left */}
                        <Search className="w-4 h-4 text-[rgba(255,255,255,0.4)] mr-2 flex-shrink-0" />
                        <Input
                          placeholder="Search circles.."
                          value={switchCircleSearch}
                          onChange={(e) => setSwitchCircleSearch(e.target.value)}
                          autoFocus={false}
                          className="w-full h-full border-0 bg-transparent font-medium text-sm text-left text-white placeholder:text-[rgba(255,255,255,0.4)] focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        />
                        {/* Clear Button (if searching) */}
                        {switchCircleSearch && (
                          <Button
                            onClick={() => setSwitchCircleSearch("")}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full hover:bg-white/10 text-[#9BB6CC99] hover:text-white transition-colors flex-shrink-0 mr-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Circles List - Scrollable */}
                    <ScrollArea 
                      className="w-full"
                      style={{ 
                        maxHeight: "400px",
                        height: "400px"
                      }}
                    >
                      <div >
                        {Object.values(mockCircles)
                          .filter((circle) =>
                            circle.name.toLowerCase().includes(switchCircleSearch.toLowerCase())
                          )
                          .map((circle) => (
                            <button
                              key={circle.id}
                              onClick={() => handleSwitchCircle(circle)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left",
                                selectedCircle?.id === circle.id && "bg-white/5"
                              )}
                            >
                              <div className="h-12 w-12 md:h-9 md:w-9 rounded-lg flex items-center justify-center text-xl md:text-lg flex-shrink-0">
                                {circle.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-white truncate">
                                    {circle.name}
                                  </p>
                                  {circle.unreadCount && circle.unreadCount > 0 && (
                                    <Badge className="h-4 min-w-4 px-1 text-xs bg-[rgba(255,255,255,0.15)] text-white">
                                      {circle.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-[#9BB6CC99] mt-0.5">
                                  {circle.memberCount} • {circle.onlineMembers} Online
                                </p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>

              {/* Channels List */}
              <ScrollArea 
                className="flex-1 overflow-hidden"
                style={{ 
                  position: 'relative',
                  zIndex: isSwitchCircleOpen ? 10 : 'auto',
                  pointerEvents: 'auto'
                }}
              >
                <div className="px-2 pb-4">
                  {channelCategories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <button
                        onClick={() => handleCategoryToggle(category.id)}
                        className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#9BB6CC] hover:text-white transition-colors uppercase tracking-wide"
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            category.isCollapsed && "-rotate-90"
                          )}
                        />
                      </button>
                      {!category.isCollapsed && (
                        <div className="mt-1 space-y-0.5">
                          {category.channels.map((channel) => (
                            <button
                              key={channel.id}
                              type="button"
                              onClick={(e) => handleChannelSelect(channel.id, e)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all",
                                activeChannelId === channel.id
                                  ? "bg-[#5865F2]/20 text-white"
                                  : "text-[#9BB6CC] hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {channel.type === "text" ? (
                                <Hash className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <Volume2 className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="flex-1 truncate text-left">
                                {channel.name}
                              </span>
                              {channel.isPrivate && (
                                <Lock className="h-3 w-3 flex-shrink-0" />
                              )}
                              {channel.unreadCount && channel.unreadCount > 0 && (
                                <Badge className="h-4 min-w-4 px-1 text-xs bg-[#FADEFD] text-[#000205]">
                                  {channel.unreadCount}
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Left Resize Border */}
            <div
              ref={leftResizeRef}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingLeft(true);
              }}
              className="absolute top-0 bottom-0 z-20 hover:cursor-col-resize"
              style={{
                left: `${leftSidebarWidth}px`,
                transform: 'translateX(-50%)',
                width: '4px',
                cursor: 'col-resize',
              }}
            >
              <div
                className={cn(
                  "absolute top-0 bottom-0 left-1/2 -translate-x-1/2 transition-all pointer-events-none",
                  "w-[1px] hover:w-[2px]",
                  isResizingLeft
                    ? "bg-[#5865F2] opacity-100 w-[2px]"
                    : "bg-transparent hover:bg-[#5865F2]/50"
                )}
              />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative" style={{ background: "transparent" }}>
              {/* Chat Header */}
              <div className="flex-shrink-0 px-4 pt-6 pb-4 bg-[#0000004A] border-b border-[#FFFFFF14]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {activeChannel?.type === "text" ? (
                      <Hash className="h-5 w-5 text-[#9BB6CC]" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-[#9BB6CC]" />
                    )}
                    <h3 className="font-semibold text-white text-base">
                      {activeChannel?.name}
                    </h3>
                    {activeChannel?.isPrivate && (
                      <Lock className="h-4 w-4 text-[#9BB6CC]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative hidden lg:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        placeholder="Search in channel"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-sm placeholder:text-[#9BB6CC99] focus:ring-0 border-0"
                        style={{ 
                          fontFamily: "'Geist'",
                          height: "36px !important",
                          maxHeight: "36px !important",
                          minHeight: "36px !important"
                        }}
                      />
                    </div>
                    {/* User List Toggle Button - Mobile: 36x36 */}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        if (isMobile && selectedCircle) {
                          const currentUrl = new URL(window.location.href);
                          if (window.location.hash === "#members") {
                            // Close members - go back to channel view
                            currentUrl.hash = "#channel";
                            router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                            setMobileView("channel");
                            setIsMembersVisible(false);
                          } else {
                            // Open members - set hash to #members
                            currentUrl.hash = "#members";
                            router.replace(currentUrl.pathname + currentUrl.search + currentUrl.hash, { scroll: false });
                            setMobileView("members");
                            setIsMembersVisible(true);
                          }
                        } else {
                          // Desktop: toggle sidebar
                          setIsMembersVisible(!isMembersVisible);
                        }
                      }}
                      className="mobile-members-button p-0 rounded-full text-white hover:bg-white/10 transition-all bg-gradient-to-b from-[#45D4A7] to-[#4DF3FF] flex-shrink-0 h-9 w-9"
                      style={{
                        height: "36px",
                        width: "36px",
                        minHeight: "36px",
                        minWidth: "36px",
                        maxHeight: "36px",
                        maxWidth: "36px"
                      }}
                      title={isMembersVisible ? "Hide members" : "Show members"}
                    >
                      <Users className={cn(
                        "h-5 w-5 md:h-4 md:w-4 transition-colors",
                        (isMembersVisible || mobileView === "members") ? "text-white" : "text-[#9BB6CC]"
                      )} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-4 pt-4 pb-3"
                style={{
                  background: "#05080d",
                }}
              >
                <div className="space-y-1">
                  {messages.map((message, index) => {
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1]?.authorId !== message.authorId;
                    const isGrouped =
                      !showAvatar &&
                      message.type !== "system" &&
                      messages[index - 1]?.type !== "system";

                    return (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        showAvatar={showAvatar}
                        isGrouped={isGrouped}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-[#2b3642]/50 bg-[#0000004A]">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder={`Message #${activeChannel?.name || "channel"}`}
                />
              </div>
            </div>

            {/* Right Resize Border - Enhanced */}
            {isMembersVisible && (
              <div
                ref={rightResizeRef}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsResizingRight(true);
                }}
                className="absolute top-0 bottom-0 z-30 cursor-col-resize group"
                style={{
                  right: `${rightSidebarWidth}px`,
                  transform: 'translateX(50%)',
                  width: '8px',
                }}
              >
                <div
                  className={cn(
                    "absolute top-0 bottom-0 left-1/2 -translate-x-1/2 transition-all duration-200",
                    "w-[2px] rounded-full",
                    isResizingRight
                      ? "bg-[#5865F2] opacity-100 w-[3px]"
                      : "bg-transparent group-hover:bg-[#5865F2]/60 group-hover:w-[2px]"
                  )}
                />
                {/* Resize indicator dot */}
                <div
                  className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                    "w-1.5 h-8 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                    isResizingRight && "opacity-100 bg-[#5865F2]"
                  )}
                  style={{
                    background: isResizingRight ? '#5865F2' : 'rgba(88, 101, 242, 0.4)'
                  }}
                />
              </div>
            )}

            {/* Right Sidebar - Members (Desktop Only) */}
            {isMembersVisible && (
            <div
              className="hidden md:flex flex-shrink-0 flex flex-col relative overflow-hidden"
              style={{ 
                width: `${rightSidebarWidth}px`,
                borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#0000004A",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                zIndex: 10,
              }}
            >
              {/* Show Member Profile or Member List */}
              {isMemberProfileOpen && selectedMember ? (
                /* Member Profile View - In Place */
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
                <>
                  {/* Members Header */}
                  <div className="px-4 py-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Icon - colorful geometric shape */}
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-[#5865F2] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center">
                          <Users className="h-3 w-3 text-white" />
                        </div>
                        <h3
                          className="text-[16px] font-semibold text-white"
                          style={{ fontFamily: "'Geist'" }}
                        >
                          Members
                        </h3>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#9BB6CC] ml-7">
                    {selectedCircle.memberCount}&nbsp; • <span className="text-[#45D4A7]">{selectedCircle.onlineMembers}</span>&nbsp;Online
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="px-4 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99]" />
                      <Input
                        placeholder="Search Members"
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="pl-10 pr-3 h-9 bg-[rgba(229,247,253,0.06)] border border-white/10 rounded-full text-sm text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:border-white/30"
                        style={{ fontFamily: "'Geist'" }}
                      />
                    </div>
                  </div>

                  {/* Members List */}
                  <ScrollArea className="flex-1 overflow-hidden">
                    <div className="px-2 py-6">
                      {/* Filter members by search and status */}
                      {(() => {
                        const filteredMembers = mockMembers.filter((member) =>
                          member.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
                        );
                        const onlineMembers = filteredMembers.filter(
                          (member) => member.status === "online" || member.status === "idle"
                        );
                        const offlineMembers = filteredMembers.filter(
                          (member) => member.status === "offline"
                        );

                        return (
                          <>
                            {/* ONLINE Section */}
                            {onlineMembers.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                                  ONLINE
                                </h4>
                                <div className="space-y-0.5">
                                  {onlineMembers.map((member) => (
                                    <div
                                      key={member.id}
                                      onClick={() => {
                                        setSelectedMember(member);
                                        setIsMemberProfileOpen(true);
                                      }}
                                      className="flex items-center gap-2 px-2 py-[6px] rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                    >
                                      <div className="relative">
                                        <Avatar className="h-9 w-9">
                                          <AvatarImage src={member.avatar} />
                                          <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                                            {member.name[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div
                                          className={cn(
                                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2",
                                            member.status === "online"
                                              ? "bg-[#3ba55d] border-[#2b3642]"
                                              : "bg-[#faa81a] border-[#2b3642]"
                                          )}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[14px] text-[#9BB6CC] truncate">
                                          {member.name}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* OFFLINE Section */}
                            {offlineMembers.length > 0 && (
                              <div>
                                <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                                  OFFLINE
                                </h4>
                                <div className="space-y-0.5">
                                  {offlineMembers.map((member) => (
                                    <div
                                      key={member.id}
                                      onClick={() => {
                                        setSelectedMember(member);
                                        setIsMemberProfileOpen(true);
                                      }}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                    >
                                      <div className="relative">
                                        <Avatar className="h-9 w-9">
                                          <AvatarImage src={member.avatar} />
                                          <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                                            {member.name[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[14px] text-[#9BB6CC99] truncate">
                                          {member.name}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* No results */}
                            {filteredMembers.length === 0 && (
                              <div className="px-2 py-4 text-center">
                                <p className="text-xs text-[#9BB6CC]">No members found</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
            )}
          </div>
        ) : (
          // No circle selected - show placeholder
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

      {/* Member Profile View - Mobile Only (Desktop shows in-place) */}
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

