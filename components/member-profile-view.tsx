"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  UserPlus,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  Users,
  Hash,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  role?: string;
}

interface MemberProfileViewProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  showInPlace?: boolean; // If true, render content directly without Sheet/Dialog wrapper
}

// Extended member data (in a real app, this would come from an API)
const getMemberDetails = (memberId: string) => {
  const details: Record<string, {
    bio?: string;
    email?: string;
    memberSince?: string;
    reputationScore?: number;
    circlesJoined?: number;
    messagesSent?: number;
    verified?: boolean;
    proMember?: boolean;
  }> = {
    "1": {
      bio: "Co-founder of Ethereum. Passionate about blockchain technology, cryptography, and decentralized systems.",
      email: "vitalik@example.com",
      memberSince: "Jan 2024",
      reputationScore: 9850,
      circlesJoined: 8,
      messagesSent: 1247,
      verified: true,
      proMember: true,
    },
    "2": {
      bio: "Community moderator and DeFi enthusiast. Love helping others navigate the crypto space.",
      email: "sarah@example.com",
      memberSince: "Mar 2024",
      reputationScore: 7234,
      circlesJoined: 12,
      messagesSent: 892,
      verified: true,
      proMember: false,
    },
    "3": {
      bio: "Full-stack developer building Web3 applications. Always learning and sharing knowledge.",
      email: "mike@example.com",
      memberSince: "Feb 2024",
      reputationScore: 5421,
      circlesJoined: 6,
      messagesSent: 456,
      verified: false,
      proMember: false,
    },
    "4": {
      bio: "Product designer focused on UX/UI for decentralized applications.",
      email: "clara@example.com",
      memberSince: "Apr 2024",
      reputationScore: 3890,
      circlesJoined: 5,
      messagesSent: 234,
      verified: false,
      proMember: false,
    },
    "5": {
      bio: "Blockchain researcher and educator. Passionate about making crypto accessible to everyone.",
      email: "maxwell@example.com",
      memberSince: "May 2024",
      reputationScore: 2156,
      circlesJoined: 3,
      messagesSent: 123,
      verified: false,
      proMember: false,
    },
  };

  return details[memberId] || {
    bio: "Member of the community.",
    email: "user@example.com",
    memberSince: "2024",
    reputationScore: 1000,
    circlesJoined: 1,
    messagesSent: 0,
    verified: false,
    proMember: false,
  };
};

export function MemberProfileView({
  member,
  isOpen,
  onClose,
  isMobile = false,
  showInPlace = false,
}: MemberProfileViewProps) {
  if (!member) return null;

  const details = getMemberDetails(member.id);
  const statusColors = {
    online: "bg-[#3ba55d]",
    idle: "bg-[#faa81a]",
    offline: "bg-[#747f8d]",
  };

  const statusLabels = {
    online: "Online",
    idle: "Idle",
    offline: "Offline",
  };

  const ProfileContent = () => (
    <div className={cn(
      "flex flex-col h-full w-full overflow-hidden",
      showInPlace && "bg-[#0000004A]"
    )}>
      {/* Header with Avatar - Enhanced UI & Responsive */}
      <div className="relative flex-shrink-0">
        <div className={cn(
          "bg-gradient-to-br from-[#45D4A7]/20 via-[#4DF3FF]/20 to-purple-500/20 p-4 sm:p-6 pb-10 sm:pb-14 md:pb-16",
          "relative overflow-hidden",
          showInPlace && "bg-gradient-to-br from-[#45D4A7]/20 via-[#4DF3FF]/20 to-purple-500/20"
        )}>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
          
          {/* Back Button - Mobile or In-Place */}
          {(isMobile || showInPlace) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm shadow-lg"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 pt-2 relative z-10">
            <div className="relative group">
              <Avatar className={cn(
                "border-4 border-white/20 shadow-2xl transition-all duration-300",
                "hover:scale-105 hover:shadow-[0_0_30px_rgba(69,212,167,0.4)]",
                showInPlace ? "h-20 w-20 sm:h-24 sm:w-24" : "h-24 w-24 md:h-32 md:w-32"
              )}>
                <AvatarImage src={member.avatar} />
                <AvatarFallback className={cn(
                  "bg-gradient-to-br from-[#2b3642] to-[#1a2332] text-white font-semibold",
                  showInPlace ? "text-xl sm:text-2xl" : "text-2xl md:text-3xl"
                )}>
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-0 right-0 rounded-full border-4 border-white shadow-xl transition-all",
                  "group-hover:scale-110",
                  showInPlace ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6 md:w-7 md:h-7",
                  statusColors[member.status]
                )}
              />
            </div>
            <div className="space-y-2 sm:space-y-2.5 px-4 w-full">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className={cn(
                  "font-bold text-white drop-shadow-lg",
                  showInPlace ? "text-lg sm:text-xl" : "text-xl md:text-2xl lg:text-3xl"
                )}>
                  {member.name}
                </h2>
                {details.verified && (
                  <Badge className="bg-emerald-500/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 shadow-md hover:bg-emerald-500 transition-colors">
                    <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {details.proMember && (
                  <Badge className="bg-orange-500/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 shadow-md hover:bg-orange-500 transition-colors">
                    <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              {member.role && (
                <Badge className="bg-violet-500/30 text-violet-200 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 border border-violet-400/30 shadow-sm">
                  {member.role}
                </Badge>
              )}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/90 font-medium">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full shadow-sm animate-pulse",
                  statusColors[member.status]
                )} />
                <span className="drop-shadow-sm">{statusLabels[member.status]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Responsive */}
      <div className={cn(
        "flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6",
        showInPlace ? "bg-transparent" : "bg-[#1a1f2e]"
      )}>
        {/* Bio - Enhanced UI */}
        {details.bio && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#E5F7FD] mb-3 uppercase tracking-wider flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E5F7FD]/30 to-transparent" />
              <span>About</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E5F7FD]/30 to-transparent" />
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#9BB6CC] leading-relaxed px-1">
              {details.bio}
            </p>
          </div>
        )}

        <Separator className="bg-white/10 mb-4 sm:mb-6" />

        {/* Stats Grid - Enhanced Responsive */}
        <div className={cn(
          "grid mb-4 sm:mb-6 member-profile-stats-grid",
          // For in-place (narrow sidebar): Stack vertically when narrow, horizontal when wide
          showInPlace ? "grid-cols-1 min-[280px]:grid-cols-3 gap-2" : 
          // For modal/dialog: Responsive grid - stack on mobile, 2 cols on small, 3 on larger
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
        )}>
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-colors min-w-0 overflow-hidden member-profile-stats-card">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 md:mb-2">
              <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#45D4A7] flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] md:text-xs text-[#9BB6CC] uppercase tracking-wide truncate member-profile-stats-label">
                Reputation
              </span>
            </div>
            <p className={cn(
              "font-bold text-white leading-tight break-all member-profile-stats-value",
              showInPlace 
                ? "text-sm sm:text-base" 
                : "text-base sm:text-lg md:text-xl lg:text-2xl"
            )}>
              {details.reputationScore?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-colors min-w-0 overflow-hidden member-profile-stats-card">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 md:mb-2">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#4DF3FF] flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] md:text-xs text-[#9BB6CC] uppercase tracking-wide truncate member-profile-stats-label">
                Circles
              </span>
            </div>
            <p className={cn(
              "font-bold text-white leading-tight break-all member-profile-stats-value",
              showInPlace 
                ? "text-sm sm:text-base" 
                : "text-base sm:text-lg md:text-xl lg:text-2xl"
            )}>
              {details.circlesJoined}
            </p>
          </div>
          <div className={cn(
            "bg-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-colors min-w-0 overflow-hidden member-profile-stats-card",
            !showInPlace && "col-span-1 sm:col-span-2 lg:col-span-1"
          )}>
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 md:mb-2">
              <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-purple-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] md:text-xs text-[#9BB6CC] uppercase tracking-wide truncate member-profile-stats-label">
                Messages
              </span>
            </div>
            <p className={cn(
              "font-bold text-white leading-tight break-all member-profile-stats-value",
              showInPlace 
                ? "text-sm sm:text-base" 
                : "text-base sm:text-lg md:text-xl lg:text-2xl"
            )}>
              {details.messagesSent?.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator className="bg-white/10 mb-4 sm:mb-6" />

        {/* Additional Info */}
        <div className="space-y-3 sm:space-y-4">
          {details.email && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#9BB6CC] flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#9BB6CC] truncate">{details.email}</span>
            </div>
          )}
          {details.memberSince && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#9BB6CC] flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#9BB6CC]">
                Member since {details.memberSince}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-white/10 my-4 sm:my-6" />

        {/* Action Buttons - Enhanced UI & Responsive */}
        <div className={cn(
          "flex gap-2.5 sm:gap-3 member-profile-actions",
          // Stack vertically on narrow panels or small screens, horizontal on larger
          showInPlace ? "flex-col" : "flex-col sm:flex-row"
        )}>
          <Button
            className={cn(
              "flex-1 bg-gradient-to-r from-[#45D4A7] via-[#4DF3FF] to-[#45D4A7] text-white",
              "hover:opacity-95 hover:shadow-lg hover:shadow-[#45D4A7]/30",
              "active:scale-[0.98] transition-all duration-200",
              "min-h-[44px] sm:min-h-[40px] md:min-h-[44px]",
              "text-xs sm:text-sm font-semibold",
              "h-auto py-2.5 sm:py-2.5 md:py-2.5",
              "flex items-center justify-center gap-1.5 sm:gap-2",
              "w-full member-profile-button",
              "border border-transparent hover:border-white/20",
              "shadow-md"
            )}
            onClick={() => {
              // Handle message action
              console.log("Message", member.name);
            }}
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Message</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex-1 border-white/30 text-white",
              "bg-white/5 hover:bg-white/15 hover:border-white/40",
              "active:scale-[0.98] transition-all duration-200",
              "min-h-[44px] sm:min-h-[40px] md:min-h-[44px]",
              "text-xs sm:text-sm font-semibold",
              "h-auto py-2.5 sm:py-2.5 md:py-2.5",
              "flex items-center justify-center gap-1.5 sm:gap-2",
              "w-full member-profile-button",
              "shadow-sm hover:shadow-md"
            )}
            onClick={() => {
              // Handle add friend action
              console.log("Add friend", member.name);
            }}
          >
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Add Friend</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // If showInPlace is true, render content directly without wrapper
  if (showInPlace) {
    return <ProfileContent />;
  }

  // Use Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] p-0 bg-[#1a1f2e] border-l border-white/10 overflow-hidden"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{member.name}'s Profile</SheetTitle>
          </SheetHeader>
          <ProfileContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg p-0 bg-[#1a1f2e] border-white/10 overflow-hidden max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{member.name}'s Profile</DialogTitle>
        </DialogHeader>
        <ProfileContent />
      </DialogContent>
    </Dialog>
  );
}

