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
import { Separator } from "@/components/ui/separator";
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

interface ProfileHeaderCustomizerProps {
  className?: string;
}

export function ProfileHeaderCustomizer({
  className,
}: ProfileHeaderCustomizerProps) {
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
    <div className={cn("mb-6 sm:mb-8", className)}>
      <Card
        className={cn(
          "profile-header-card border-0 overflow-hidden relative transition-all duration-300 shadow-2xl",
          backgroundStyles[backgroundStyle as keyof typeof backgroundStyles]
        )}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-0"></div>
        {/* Customization Button */}
        <div className="absolute top-6 right-6 z-20">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 shadow-lg w-9 h-9 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-2"
              >
                <Edit3 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Customize</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[95vh] w-[98vw] sm:w-[95vw] lg:w-full flex flex-col p-0">
              <DialogHeader className="shrink-0 p-6 pb-4 border-b">
                <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Palette className="h-5 w-5" />
                  Customize Profile Header
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Live Preview - Full Width */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <span>Live Preview</span>
                    </Label>
                    <Card
                      className={cn(
                        "overflow-hidden transition-all duration-300 relative shadow-xl",
                        backgroundStyles[
                          backgroundStyle as keyof typeof backgroundStyles
                        ]
                      )}
                    >
                      {/* Dark overlay for text readability - preview */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-0"></div>
                      <CardContent className="p-6 sm:p-8 lg:p-10 pb-8 sm:pb-10 lg:pb-12 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                          {/* Avatar Section */}
                          <div className="relative flex-shrink-0 mx-auto lg:mx-0 group mb-2 lg:mb-0">
                            <div className="relative">
                              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-3 border-white/30 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                                <AvatarImage
                                  src={editData.avatar}
                                  className="transition-all duration-200"
                                />
                                <AvatarFallback className="text-sm sm:text-base lg:text-lg bg-gradient-to-br from-electric-blue to-purple-600 text-white">
                                  {editData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            {editData.verified && (
                              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-white text-xs sm:text-sm font-bold">
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 w-full text-center lg:text-left">
                            {/* Name and Badges */}
                            <div className="flex flex-col lg:flex-row lg:items-baseline space-y-2 lg:space-y-0 lg:space-x-4 mb-4">
                              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                                {editData.name}
                              </h1>
                              <div className="flex items-center justify-center lg:justify-start space-x-2 flex-wrap">
                                {editData.verified && (
                                  <Badge className="bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                                    Verified
                                  </Badge>
                                )}
                                {editData.proMember && (
                                  <Badge className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                                    Pro Member
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-white/95 mb-6 text-base lg:text-lg leading-relaxed max-w-3xl drop-shadow-sm font-light">
                              {editData.bio}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-10 text-center lg:text-left">
                              <div className="flex flex-col items-center lg:items-start">
                                <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                                  Reputation Score
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                                  {editData.reputationScore.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex flex-col items-center lg:items-start">
                                <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                                  Member Since
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                                  {editData.memberSince}
                                </div>
                              </div>
                              <div className="flex flex-col items-center lg:items-start">
                                <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                                  Communities
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                                  {editData.communities}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customization Options - Grid Layout */}
                  <div className="flex flex-col gap-6 modal-grid-responsive">
                    {/* Profile Information Card */}
                    <Card className="p-6">
                      <Label className="text-base font-semibold mb-4 block">
                        <Type className="h-4 w-4 inline mr-2" />
                        Profile Information
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-sm">
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
                          <Label htmlFor="bio" className="text-sm">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) =>
                              setEditData({ ...editData, bio: e.target.value })
                            }
                            className="mt-1 min-h-20"
                            placeholder="Tell others about yourself..."
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Background Style Card */}
                    <Card className="p-6">
                      <Label className="text-base font-semibold mb-4 block">
                        <Layout className="h-4 w-4 inline mr-2" />
                        Background Style
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(backgroundStyles).map(
                          ([key, value]) => (
                            <button
                              key={key}
                              onClick={() => setBackgroundStyle(key)}
                              className={cn(
                                "h-16 rounded-lg border-2 transition-all duration-200",
                                value,
                                backgroundStyle === key
                                  ? "border-electric-blue ring-2 ring-electric-blue/20"
                                  : "border-border hover:border-electric-blue/50"
                              )}
                            />
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-2 text-xs text-center text-muted-foreground">
                        <span>Gradient</span>
                        <span>Solid</span>
                        <span>Pattern</span>
                      </div>
                    </Card>

                    {/* Avatar & Status Card */}
                    <Card className="p-6">
                      <Label className="text-base font-semibold mb-4 block">
                        <Camera className="h-4 w-4 inline mr-2" />
                        Avatar & Status
                      </Label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={editData.avatar} />
                            <AvatarFallback className="text-sm">
                              {editData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Change Avatar
                          </Button>
                        </div>
                        <div className="space-y-3">
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
                            <span className="text-sm">Verified Badge</span>
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
                            <span className="text-sm">Pro Member Badge</span>
                          </label>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-6 pt-4 border-t bg-muted/30">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-electric-blue hover:bg-electric-blue/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Header Content */}
        <CardContent className="p-6 sm:p-8 lg:p-10 pb-8 sm:pb-10 lg:pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-6 lg:space-y-0 lg:space-x-8 gap-8">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0 mx-auto lg:mx-0 group mb-2 lg:mb-0">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-3 border-white/30 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                  <AvatarImage
                    src={profileData.avatar}
                    className="transition-all duration-200"
                  />
                  <AvatarFallback className="text-sm sm:text-base lg:text-lg bg-gradient-to-br from-electric-blue to-purple-600 text-white">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              {profileData.verified && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-xs sm:text-sm font-bold">
                    ✓
                  </span>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full text-center lg:text-left">
              {/* Name and Badges */}
              <div className="flex flex-col lg:flex-row lg:items-baseline space-y-2 lg:space-y-0 lg:space-x-4 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                  {profileData.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-2 flex-wrap">
                  {profileData.verified && (
                    <Badge className="bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                      Verified
                    </Badge>
                  )}
                  {profileData.proMember && (
                    <Badge className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                      Pro Member
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-white/95 mb-6 text-base lg:text-lg leading-relaxed max-w-3xl drop-shadow-sm font-light">
                {profileData.bio}
              </p>

              {/* Stats */}
              <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-10 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                    Reputation Score
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                    {profileData.reputationScore.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                    Member Since
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                    {profileData.memberSince}
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-sm lg:text-base text-white/70 mb-2 font-medium">
                    Communities
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                    {profileData.communities}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Removed for cleaner design like sample */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
