"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CirclesModal } from "@/components/circles-modal";
import { joinedCircles } from "@/lib/circles-data";

interface DesktopLeftSidebarProps {
  className?: string;
}

export function DesktopLeftSidebar({ className }: DesktopLeftSidebarProps) {
  const router = useRouter();
  const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const slugifyCircleName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

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

  // Map shared circles data to sidebar format
  const circleColors: Record<string, string> = {
    "defi-builders": "bg-blue-500/10 text-blue-400",
    "kings-alliance": "bg-purple-500/10 text-purple-400",
    "governance-circle": "bg-green-500/10 text-green-400",
    "defi-community": "bg-cyan-500/10 text-cyan-400",
    "ynx-dao": "bg-yellow-500/10 text-yellow-400",
    "our-space": "bg-pink-500/10 text-pink-400",
  };

  // Use shared circles data - show first 4 joined circles in sidebar
  const circles = joinedCircles.slice(0, 4).map((circle) => ({
    name: circle.name,
    members: circle.memberCount,
    icon: circle.icon,
    color: circleColors[circle.id] || "bg-gray-500/10 text-gray-400",
    routeId: circle.id,
  }));

  return (
    <aside
      className={cn(
        "desktop-left-sidebar fixed z-[60]",
        // Hide on all mobile and tablet sizes, only show on desktop (1024px+)
        "hidden lg:block",
        // Responsive positioning and sizing
        "left-[14px] top-[14px]",
        "w-[200px] lg:w-[220px] xl:w-[250px]", // Responsive width
        "bg-[#080E11]/40 border border-white/[0.08] backdrop-blur-[20px]",
        "rounded-[24px]",
        "transition-all duration-300 ease-out",
        "flex flex-col",
        "overflow-hidden", // Prevent outer scroll, we'll handle scrolling internally
        className
      )}
      style={{
        maxHeight: "calc(100vh - 14px - 24px)", // 14px from top, 24px from bottom
        height: "calc(100vh - 14px - 24px)", // Responsive height: grows with viewport
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section - Fixed at top, doesn't scroll */}
      <div 
        className="flex items-center justify-start cursor-pointer transition-transform hover:scale-105"
        onClick={() => handleNavigation("/")}
        style={{
          paddingTop: "1.5rem",
          paddingBottom: "1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          flexShrink: 0,
        }}
      >
        <svg width="88" height="26" viewBox="0 0 88 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2129_5590)">
              <path d="M20.1587 18.1199V0.000244141H26.0001V26.0002H19.3569L5.84154 7.84639V26.0002H0.00012207V0.000244141H6.72721L20.1587 18.1199Z" fill="#9BB6CC"/>
              <g filter="url(#filter0_dddd_2129_5590)">
                <path d="M6.72059 0.0131836L12.9104 8.36321C12.9682 8.44121 13.0849 8.44133 13.1429 8.36345L19.3586 0.0131836H25.9739L18.0838 10.6249C17.041 12.0273 17.0401 13.9471 18.0814 15.3506L25.9739 25.9869H19.3636L13.1314 17.6159C13.0734 17.5378 12.9565 17.5381 12.8988 17.6163L6.72058 25.9869H0.0264443L7.95126 15.4099C9.00374 14.0053 9.00668 12.0755 7.95851 10.6676L0.0263672 0.0131836H6.72059Z" fill="#E5F7FD"/>
              </g>
              <g filter="url(#filter1_dddd_2129_5590)">
                <path d="M6.71405 0.0131836L12.9103 8.36327C12.9682 8.44124 13.0849 8.44129 13.1428 8.36338L19.3521 0.0131836H25.9674L17.4561 11.4614C16.4414 12.8261 15.8935 14.4813 15.8935 16.1819V25.9869H10.1133V16.1847C10.1133 14.4823 9.56427 12.8256 8.54781 11.4601L0.0263672 0.0131836H6.71405Z" fill="#E5F7FD"/>
              </g>
            </g>
            <path d="M34 4.85278H38.108L42.045 9.98603C42.0952 10.0514 42.1938 10.0514 42.2439 9.98603L46.181 4.85278H50.2932L45.4332 11.4388C44.4788 12.7321 43.9639 14.2972 43.9639 15.9046V21.1475H40.3251V15.9033C40.3251 14.2967 39.8107 12.7324 38.8572 11.4394L34 4.85278Z" fill="#9BB6CC"/>
            <path d="M65.0115 16.252V4.85278H68.6721V21.1475H64.5091L56.0395 9.7701V21.1475H52.3789V4.85278H56.4876L65.0115 16.252Z" fill="#9BB6CC"/>
            <path d="M87.0507 21.1475L82.6573 15.272C81.6615 13.9403 81.6586 12.1126 82.65 10.7777L87.0507 4.85278H82.9379L78.9073 10.2569L74.8663 4.85278H70.7576L75.1688 10.7784C76.1616 12.1121 76.1607 13.9395 75.1667 15.2722L70.8077 21.1168H74.9707L78.9133 15.8086L82.8877 21.1475H87.0507Z" fill="#9BB6CC"/>
            <defs>
              <filter id="filter0_dddd_2129_5590" x="-229.974" y="-42.9868" width="485.948" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="36"/>
                <feGaussianBlur stdDeviation="39.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="144"/>
                <feGaussianBlur stdDeviation="72"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_2129_5590" result="effect2_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="323"/>
                <feGaussianBlur stdDeviation="97"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                <feBlend mode="normal" in2="effect2_dropShadow_2129_5590" result="effect3_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="574"/>
                <feGaussianBlur stdDeviation="115"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                <feBlend mode="normal" in2="effect3_dropShadow_2129_5590" result="effect4_dropShadow_2129_5590"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_2129_5590" result="shape"/>
              </filter>
              <filter id="filter1_dddd_2129_5590" x="-229.974" y="-42.9868" width="485.941" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="36"/>
                <feGaussianBlur stdDeviation="39.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="144"/>
                <feGaussianBlur stdDeviation="72"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_2129_5590" result="effect2_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="323"/>
                <feGaussianBlur stdDeviation="97"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                <feBlend mode="normal" in2="effect2_dropShadow_2129_5590" result="effect3_dropShadow_2129_5590"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="574"/>
                <feGaussianBlur stdDeviation="115"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                <feBlend mode="normal" in2="effect3_dropShadow_2129_5590" result="effect4_dropShadow_2129_5590"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_2129_5590" result="shape"/>
              </filter>
              <clipPath id="clip0_2129_5590">
                <rect width="26" height="26" fill="white"/>
              </clipPath>
            </defs>
        </svg>
      </div>

      {/* Scrollable Content - Connections and Circles */}
      <div 
        className="flex flex-col overflow-y-auto sidebar-scrollable"
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingBottom: "1.5rem",
          flex: "1 1 0%",
          minHeight: 0,
          maxHeight: "100%",
          overflowY: "auto",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
          {/* Connections Section */}
          <div className="flex flex-col gap-3 flex-shrink-0" style={{ paddingTop: "1rem" }}>
          <h3 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wider">
            Connections
          </h3>
          <div className="flex flex-col gap-2">
            {connections.slice(0, 9).map((user, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 pb-1 rounded-lg hover:bg-white/5 transition-colors group"
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
                  <p
                    className="truncate"
                    style={{
                      fontFamily: "'Geist'",
                      fontStyle: "normal",
                      fontWeight: 400,
                      color: "#9BB6CC",
                      fontSize: "16px",
                    }}
                  >
                    {user.name}
                  </p>
                </div>
              </button>
            ))}
            <div className="flex gap-2 justify-between">
              <button
                onClick={() => handleNavigation("/connections")}
                className="flex items-center px-2.5 py-1.5 gap-2 w-[95.89px] h-[28px] bg-[rgba(229,247,253,0.06)] rounded-[10px]"
              >
                <MoreHorizontal className="h-3.5 w-3.5" style={{ color: "#9BB6CC" }} />
                <span className="text-xs" style={{ color: "#9BB6CC" }}>See more</span>
              </button>
              <button className="flex justify-center items-center p-1 gap-[10px] w-[28px] h-[28px] bg-[rgba(229,247,253,0.08)] rounded-full">
                <Users className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          </div>

          {/* Circles Section - Grows to fill available space when sidebar height increases */}
          <div 
            className="flex flex-col flex-1" 
            style={{ 
              marginTop: "2rem",
            }}
          >
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Circles
            </h3>
            <div 
              className="flex flex-col flex-1"
              style={{ 
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              <div className="flex flex-col flex-1">  
              {circles.map((circle, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(`/?circle=${slugifyCircleName(circle.name)}`)}
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
                    <p
                      className="truncate"
                      style={{
                        fontFamily: "'Geist'",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                      }}
                    >
                      {circle.name}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        color: "#FADEFD",
                        fontSize: "12px",
                      }}
                    >
                      {circle.members} members
                    </p>
                  </div>
                </button>
              ))}
              </div>
              <div className="flex gap-2 justify-between flex-shrink-0" style={{ marginTop: "auto" }}>
                <button
                  onClick={() => setIsCirclesModalOpen(true)}
                  className="flex items-center px-2.5 py-1.5 gap-2 w-[95.89px] h-[28px] bg-[rgba(229,247,253,0.06)] rounded-[10px]"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" style={{ color: "#9BB6CC" }} />
                  <span className="text-xs" style={{ color: "#9BB6CC" }}>See more</span>
                </button>
                <button className="flex justify-center items-center p-1 gap-[10px] w-[28px] h-[28px] bg-[rgba(229,247,253,0.08)] rounded-full">
                  <Users className="h-3.5 w-3.5" />
                </button>
            </div>
          </div>
          </div>
        </div>
        {/* End of Scrollable Content */}

      {/* Circles Modal */}
      <CirclesModal
        isOpen={isCirclesModalOpen}
        onClose={() => setIsCirclesModalOpen(false)}
      />
    </aside>
  );
}
