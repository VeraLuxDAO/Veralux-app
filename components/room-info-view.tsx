"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Mail,
  Calendar,
  Award,
  Users,
  Lock,
  CheckCircle2,
  Search,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarViewer } from "@/components/avatar-viewer";

interface Room {
  id: string;
  name: string;
  avatar?: string;
  type: "dm" | "group";
  isOnline?: boolean;
  isEncrypted: boolean;
  members?: number;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  role?: string;
  isOnline?: boolean;
}

interface RoomInfoViewProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  members?: Member[];
  isMobile?: boolean; // When true, makes it full-width for mobile Sheet
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

// Mock members for group rooms
const getGroupMembers = (roomId: string): Member[] => {
  const membersMap: Record<string, Member[]> = {
    "3": [
      {
        id: "1",
        name: "Vitalik Buterin",
        avatar: "/diverse-user-avatars.png",
        status: "online",
        role: "Admin",
        isOnline: true,
      },
      {
        id: "2",
        name: "Sarah Miller",
        avatar: "/diverse-female-avatar.png",
        status: "online",
        role: "Moderator",
        isOnline: true,
      },
      {
        id: "3",
        name: "Mike Chen",
        avatar: "/developer-avatar.png",
        status: "idle",
        isOnline: false,
      },
      {
        id: "4",
        name: "Clara Jin",
        status: "online",
        isOnline: true,
      },
      {
        id: "5",
        name: "Maxwell",
        status: "offline",
        isOnline: false,
      },
      {
        id: "6",
        name: "John",
        status: "online",
        isOnline: true,
      },
      {
        id: "7",
        name: "Alice",
        avatar: "/diverse-female-avatar.png",
        status: "online",
        isOnline: true,
      },
      {
        id: "8",
        name: "David",
        status: "offline",
        isOnline: false,
      },
    ],
  };

  return membersMap[roomId] || [];
};

export function RoomInfoView({
  room,
  isOpen,
  onClose,
  members = [],
  isMobile = false,
}: RoomInfoViewProps) {
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
  
  if (!room) {
    return null;
  }

  const isDM = room.type === "dm";
  const groupMembers = isDM ? [] : getGroupMembers(room.id);
  const filteredMembers = groupMembers.filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );
  const onlineMembers = filteredMembers.filter((m) => m.status === "online" || m.status === "idle");
  const offlineMembers = filteredMembers.filter((m) => m.status === "offline");

  // For DM, get the other member's details
  const dmMemberDetails = isDM ? getMemberDetails(room.id) : null;

  return (
    <div
      className={cn(
        "flex-shrink-0 flex flex-col relative overflow-hidden",
        !isMobile && "border-l border-white/5",
        "transition-all duration-300 ease-out",
        isMobile
          ? "w-full h-full opacity-100"
          : isOpen
          ? "w-[320px] opacity-100"
          : "w-0 opacity-0 pointer-events-none"
      )}
      style={{
        background: "rgba(5, 8, 13, 0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Close Button */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Info</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/10 text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="flex flex-col">
          {/* Header with Avatar */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#0a0d12]/80 via-[#0d1117]/80 to-[#0a0d12]/80 p-6 pb-16 border-b border-white/5">
              <div className="flex flex-col items-center text-center space-y-4">
                <div 
                  className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  onClick={() => setIsAvatarViewerOpen(true)}
                >
                  <Avatar className="h-24 w-24 border-4 border-white/10 shadow-xl">
                    <AvatarImage src={room.avatar} />
                    <AvatarFallback className="bg-[#0a0d12] text-white text-2xl border border-white/5">
                      {room.type === "group" ? "👥" : room.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {room.isOnline && room.type === "dm" && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#3ba55d] rounded-full border-4 border-white shadow-lg" />
                  )}
                  {room.isEncrypted && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-[#4bd865] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">
                      {room.name}
                    </h2>
                    {isDM && dmMemberDetails?.verified && (
                      <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {isDM && dmMemberDetails?.proMember && (
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                        <Award className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  {room.type === "dm" && (
                    <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                      <div className={cn("w-2 h-2 rounded-full", room.isOnline ? "bg-[#3ba55d]" : "bg-[#747f8d]")} />
                      <span>{room.isOnline ? "Online" : "Last seen recently"}</span>
                    </div>
                  )}
                  {room.type === "group" && (
                    <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                      <Users className="h-4 w-4" />
                      <span>{room.members || groupMembers.length} members</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-6 bg-[#05080d]">
            {isDM ? (
              /* DM Profile View */
              <>
                {dmMemberDetails?.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#E5F7FD] mb-2 uppercase tracking-wide">
                      About
                    </h3>
                    <p className="text-sm text-[#9BB6CC] leading-relaxed">
                      {dmMemberDetails.bio}
                    </p>
                  </div>
                )}

                <Separator className="bg-white/5 mb-6" />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#0a0d12] rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-[#45D4A7]" />
                      <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Reputation</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {dmMemberDetails?.reputationScore?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#0a0d12] rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-[#4DF3FF]" />
                      <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Circles</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {dmMemberDetails?.circlesJoined}
                    </p>
                  </div>
                  <div className="bg-[#0a0d12] rounded-lg p-3 border border-white/5 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-[#9BB6CC] uppercase tracking-wide">Messages</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {dmMemberDetails?.messagesSent?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/5 mb-6" />

                {/* Additional Info */}
                {dmMemberDetails?.email && (
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-4 w-4 text-[#9BB6CC]" />
                    <span className="text-sm text-[#9BB6CC]">{dmMemberDetails.email}</span>
                  </div>
                )}
                {dmMemberDetails?.memberSince && (
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="h-4 w-4 text-[#9BB6CC]" />
                    <span className="text-sm text-[#9BB6CC]">
                      Member since {dmMemberDetails.memberSince}
                    </span>
                  </div>
                )}

                <Separator className="bg-white/5 my-6" />

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      console.log("Call", room.name);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </>
            ) : (
              /* Group Members List View */
              <>
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC66]" />
                    <Input
                      placeholder="Search members..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="pl-10 pr-4 h-9 bg-[#0a0d12] border border-white/5 rounded-lg text-sm text-white placeholder:text-[#9BB6CC66] focus:ring-0 focus:border-white/10"
                    />
                  </div>
                </div>

                {/* Members Count */}
                <div className="mb-4">
                  <p className="text-sm text-[#9BB6CC]">
                    {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
                  </p>
                </div>

                <Separator className="bg-white/5 mb-4" />

                {/* Members List */}
                <div className="space-y-1">
                  {/* ONLINE Section */}
                  {onlineMembers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-semibold text-[#9BB6CC66] uppercase tracking-wide px-2 mb-2">
                        ONLINE — {onlineMembers.length}
                      </h4>
                      <div className="space-y-0.5">
                        {onlineMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-[#0a0d12] text-white text-sm border border-white/5">
                                  {member.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#05080d]",
                                  member.status === "online"
                                    ? "bg-[#3ba55d]"
                                    : "bg-[#faa81a]"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-white truncate">
                                  {member.name}
                                </p>
                                {member.role && (
                                  <Badge className="bg-violet-500/20 text-violet-200 text-xs px-2 py-0 border border-violet-400/20">
                                    {member.role}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OFFLINE Section */}
                  {offlineMembers.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-semibold text-[#9BB6CC66] uppercase tracking-wide px-2 mb-2">
                        OFFLINE — {offlineMembers.length}
                      </h4>
                      <div className="space-y-0.5">
                        {offlineMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-[#0a0d12] text-white text-sm border border-white/5">
                                  {member.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-[#9BB6CC] truncate">
                                  {member.name}
                                </p>
                                {member.role && (
                                  <Badge className="bg-violet-500/20 text-violet-200 text-xs px-2 py-0 border border-violet-400/20">
                                    {member.role}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No results */}
                  {filteredMembers.length === 0 && (
                    <div className="px-2 py-8 text-center">
                      <p className="text-sm text-[#9BB6CC66]">No members found</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Avatar Viewer Popup */}
      <AvatarViewer
        isOpen={isAvatarViewerOpen}
        onClose={() => setIsAvatarViewerOpen(false)}
        {...(room.avatar ? { avatarUrl: room.avatar } : {})}
        fallbackText={room.type === "group" ? "👥" : room.name[0] || "👤"}
        userName={room.name}
      />
    </div>
  );
}
