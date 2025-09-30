"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit3, Camera, Palette, Type, Layout, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  reputationScore: number;
  memberSince: string;
  communities: number;
  avatar: string;
  verified: boolean;
  proMember: boolean;
}

interface CompactProfileHeaderProps {
  className?: string;
}

// Helper functions to convert between display format and HTML month input format
const convertToMonthFormat = (dateString: string): string => {
  if (!dateString) return "";

  // Handle formats like "Jan 2024", "Feb 2024", etc.
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parts = dateString.trim().split(" ");
  if (parts.length === 2 && parts[0] && parts[1]) {
    const monthName = parts[0];
    const year = parts[1];

    // Check both full and short month names
    let monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) {
      monthIndex = shortMonthNames.indexOf(monthName);
    }

    if (monthIndex !== -1 && !isNaN(parseInt(year))) {
      const monthNumber = (monthIndex + 1).toString().padStart(2, "0");
      return `${year}-${monthNumber}`;
    }
  }

  return "";
};

const convertFromMonthFormat = (monthInput: string): string => {
  if (!monthInput) return "";

  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month] = monthInput.split("-");
  if (year && month) {
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${shortMonthNames[monthIndex]} ${year}`;
    }
  }

  return monthInput;
};

export function CompactProfileHeader({ className }: CompactProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Alex Chen",
    title:
      "Full-stack developer passionate about DeFi and NFT innovation. Building the future of Web3.",
    bio: "Full-stack developer passionate about DeFi and NFT innovation. Building the future of Web3.",
    reputationScore: 8547,
    memberSince: "Jan 2024",
    communities: 12,
    avatar: "/user-profile-illustration.png",
    verified: true,
    proMember: true,
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [backgroundStyle, setBackgroundStyle] = useState("gradient");

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const backgroundStyles = {
    gradient:
      "bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-emerald-600/20 border border-white/10",
    solid:
      "bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50",
    pattern:
      'bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-blue-500/10 border border-white/10 relative overflow-hidden after:absolute after:inset-0 after:bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]',
  };

  return (
    <div className={cn("mb-6", className)}>
      <Card
        className={cn(
          "compact-profile-header border-0 overflow-hidden relative transition-all duration-300 shadow-2xl backdrop-blur-md rounded-2xl ring-1 ring-white/10",
          backgroundStyles[backgroundStyle as keyof typeof backgroundStyles]
        )}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-0"></div>

        {/* Customization Button */}
        <div className="absolute top-3 right-3 z-20">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 shadow-lg w-8 h-8 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-1.5"
              >
                <Edit3 className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline text-xs">Customize</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] w-full flex flex-col p-0"
            >
              <DialogHeader className="shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 border-b">
                <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                  Customize Profile Header
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Live Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold">
                      Live Preview
                    </Label>
                    <Card
                      className={cn(
                        "overflow-hidden transition-all duration-300 relative shadow-lg",
                        backgroundStyles[
                          backgroundStyle as keyof typeof backgroundStyles
                        ]
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-0"></div>
                      <CardContent className="p-4 relative z-10">
                        <div className="flex items-center space-x-4">
                          {/* Compact Avatar */}
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-16 h-16 border-2 border-white/30 shadow-md">
                              <AvatarImage src={editData.avatar} />
                              <AvatarFallback className="text-sm bg-gradient-to-br from-electric-blue to-purple-600 text-white">
                                {editData.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {editData.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-white text-xs font-bold">
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Compact Content */}
                          <div className="flex-1 min-w-0">
                            {/* Name and Badges */}
                            <div className="flex items-center space-x-2 mb-2">
                              <h1 className="text-xl font-bold text-white drop-shadow-lg truncate">
                                {editData.name}
                              </h1>
                              <div className="flex space-x-1">
                                {editData.verified && (
                                  <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    Verified
                                  </Badge>
                                )}
                                {editData.proMember && (
                                  <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    Pro
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Compact Stats */}
                            <div className="flex items-center space-x-6 text-white/90">
                              <div className="text-center">
                                <div className="text-xs text-white/70">
                                  Reputation
                                </div>
                                <div className="text-lg font-bold">
                                  {editData.reputationScore.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-white/70">
                                  Since
                                </div>
                                <div className="text-lg font-bold">
                                  {editData.memberSince}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-white/70">
                                  Communities
                                </div>
                                <div className="text-lg font-bold">
                                  {editData.communities}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customization Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Profile Information */}
                    <Card className="p-3 sm:p-4">
                      <Label className="text-xs sm:text-sm font-semibold mb-3 block">
                        <Type className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                        Profile Information
                      </Label>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-xs">
                            Display Name
                          </Label>
                          <Input
                            id="name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio" className="text-xs">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) =>
                              setEditData({ ...editData, bio: e.target.value })
                            }
                            className="mt-1 min-h-16"
                            placeholder="Tell others about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberSince" className="text-xs">
                            Member Since
                          </Label>
                          <Input
                            id="memberSince"
                            type="month"
                            value={
                              editData.memberSince
                                ? convertToMonthFormat(editData.memberSince)
                                : ""
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                memberSince: convertFromMonthFormat(
                                  e.target.value
                                ),
                              })
                            }
                            className="mt-1 text-sm"
                            placeholder="Select month and year"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Background Style */}
                    <Card className="p-3 sm:p-4">
                      <Label className="text-xs sm:text-sm font-semibold mb-3 block">
                        <Layout className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                        Background Style
                      </Label>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {Object.entries(backgroundStyles).map(
                          ([key, value]) => (
                            <button
                              key={key}
                              onClick={() => setBackgroundStyle(key)}
                              className={cn(
                                "h-8 sm:h-10 lg:h-12 rounded-md sm:rounded-lg border-2 transition-all duration-200",
                                value,
                                backgroundStyle === key
                                  ? "border-electric-blue ring-1 sm:ring-2 ring-electric-blue/20"
                                  : "border-border hover:border-electric-blue/50"
                              )}
                            />
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2 text-xs text-center text-muted-foreground">
                        <span>Gradient</span>
                        <span>Solid</span>
                        <span>Pattern</span>
                      </div>
                    </Card>

                    {/* Avatar & Status Card */}
                    <Card className="p-3 sm:p-4">
                      <Label className="text-xs sm:text-sm font-semibold mb-3 block">
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                        Avatar & Status
                      </Label>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                            <AvatarImage src={editData.avatar} />
                            <AvatarFallback className="text-xs sm:text-sm">
                              {editData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm"
                          >
                            <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Change Avatar
                          </Button>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.verified}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  verified: e.target.checked,
                                })
                              }
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs sm:text-sm">
                              Verified Badge
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.proMember}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  proMember: e.target.checked,
                                })
                              }
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs sm:text-sm">
                              Pro Member Badge
                            </span>
                          </label>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-6 pt-3 sm:pt-4 border-t bg-muted/30">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-electric-blue hover:bg-electric-blue/90 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Compact Profile Header Content */}
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center space-x-4">
            {/* Compact Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-16 h-16 border-2 border-white/30 shadow-md">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-electric-blue to-purple-600 text-white">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {profileData.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>

            {/* Compact Content */}
            <div className="flex-1 min-w-0">
              {/* Name and Badges */}
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-xl font-bold text-white drop-shadow-lg truncate">
                  {profileData.name}
                </h1>
                <div className="flex space-x-1">
                  {profileData.verified && (
                    <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Verified
                    </Badge>
                  )}
                  {profileData.proMember && (
                    <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Pro
                    </Badge>
                  )}
                </div>
              </div>

              {/* Compact Stats */}
              <div className="flex items-center space-x-6 text-white/90">
                <div className="text-center">
                  <div className="text-xs text-white/70">Reputation</div>
                  <div className="text-lg font-bold">
                    {profileData.reputationScore.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/70">Since</div>
                  <div className="text-lg font-bold">
                    {profileData.memberSince}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/70">Communities</div>
                  <div className="text-lg font-bold">
                    {profileData.communities}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
