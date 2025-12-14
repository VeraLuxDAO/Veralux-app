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
    <div className="flex flex-col h-full">
      {/* Header with Avatar */}
      <div className="relative">
        <div className="bg-gradient-to-br from-[#45D4A7]/20 via-[#4DF3FF]/20 to-purple-500/20 p-6 pb-16">
          {/* Back Button - Mobile Only */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 left-4 z-10 h-9 w-9 rounded-full text-white hover:bg-white/20 transition-all"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white/20 shadow-xl">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-[#2b3642] text-white text-2xl md:text-3xl">
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-4 border-white shadow-lg",
                  statusColors[member.status]
                )}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {member.name}
                </h2>
                {details.verified && (
                  <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {details.proMember && (
                  <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                    <Award className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              {member.role && (
                <Badge className="bg-violet-500/30 text-violet-200 text-xs px-3 py-1 border border-violet-400/30">
                  {member.role}
                </Badge>
              )}
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <div className={cn("w-2 h-2 rounded-full", statusColors[member.status])} />
                <span>{statusLabels[member.status]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#1a1f2e] px-4 md:px-6 py-6">
        {/* Bio */}
        {details.bio && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#E5F7FD] mb-2 uppercase tracking-wide">
              About
            </h3>
            <p className="text-sm md:text-base text-[#9BB6CC] leading-relaxed">
              {details.bio}
            </p>
          </div>
        )}

        <Separator className="bg-white/10 mb-6" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#45D4A7]" />
              <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Reputation</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">
              {details.reputationScore?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-[#4DF3FF]" />
              <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Circles</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">
              {details.circlesJoined}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Messages</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">
              {details.messagesSent?.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Additional Info */}
        <div className="space-y-4">
          {details.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#9BB6CC]" />
              <span className="text-sm text-[#9BB6CC]">{details.email}</span>
            </div>
          )}
          {details.memberSince && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#9BB6CC]" />
              <span className="text-sm text-[#9BB6CC]">
                Member since {details.memberSince}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-white/10 my-6" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-gradient-to-r from-[#45D4A7] to-[#4DF3FF] text-white hover:opacity-90 transition-opacity"
            onClick={() => {
              // Handle message action
              console.log("Message", member.name);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              // Handle add friend action
              console.log("Add friend", member.name);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>
      </div>
    </div>
  );

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

