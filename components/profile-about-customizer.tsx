"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Edit3,
  MapPin,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DetailedAboutSection } from "@/components/detailed-about-section";

interface AboutData {
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  linkedin: string;
  email: string;
  joinDate: string;
  occupation: string;
  education: string;
  interests: string[];
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
}

interface ProfileAboutCustomizerProps {
  className?: string;
}

// Helper functions to convert between display format and HTML month input format
const convertToMonthFormat = (dateString: string): string => {
  if (!dateString) return "";

  // Handle formats like "March 2024", "February 2024", etc.
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

  const parts = dateString.trim().split(" ");
  if (parts.length === 2 && parts[0] && parts[1]) {
    const monthName = parts[0];
    const year = parts[1];
    const monthIndex = monthNames.indexOf(monthName);

    if (monthIndex !== -1 && !isNaN(parseInt(year))) {
      const monthNumber = (monthIndex + 1).toString().padStart(2, "0");
      return `${year}-${monthNumber}`;
    }
  }

  return "";
};

const convertFromMonthFormat = (monthInput: string): string => {
  if (!monthInput) return "";

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

  const [year, month] = monthInput.split("-");
  if (year && month) {
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }
  }

  return monthInput;
};

export function ProfileAboutCustomizer({
  className,
}: ProfileAboutCustomizerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    bio: "Passionate full-stack developer with 5+ years of experience in blockchain technology. I specialize in smart contract development, DeFi protocols, and NFT marketplaces. Always excited to collaborate on innovative Web3 projects.",
    location: "San Francisco, CA",
    website: "alexchen.dev",
    twitter: "@alexchen_dev",
    github: "github.com/alexchen",
    linkedin: "linkedin.com/in/alexchen",
    email: "alex@alexchen.dev",
    joinDate: "January 15, 2024",
    occupation: "Senior Blockchain Developer",
    education: "Computer Science, Stanford University",
    interests: [
      "DeFi",
      "Smart Contracts",
      "NFTs",
      "Web3 Gaming",
      "DAO Governance",
    ],
    achievements: [
      {
        title: "DeFi Protocol Launch",
        description:
          "Successfully launched a yield farming protocol with $10M+ TVL",
        date: "March 2024",
        icon: "🚀",
      },
      {
        title: "ETHGlobal Hackathon Winner",
        description:
          "First place in the DeFi track for innovative lending solution",
        date: "February 2024",
        icon: "🏆",
      },
      {
        title: "Smart Contract Auditor Certification",
        description: "Completed OpenZeppelin's security auditor program",
        date: "January 2024",
        icon: "🔒",
      },
    ],
  });

  const [editData, setEditData] = useState<AboutData>(aboutData);
  const [newInterest, setNewInterest] = useState("");

  const handleSave = () => {
    setAboutData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(aboutData);
    setIsEditing(false);
  };

  const addInterest = () => {
    if (
      newInterest.trim() &&
      !editData.interests.includes(newInterest.trim())
    ) {
      setEditData({
        ...editData,
        interests: [...editData.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setEditData({
      ...editData,
      interests: editData.interests.filter((i) => i !== interest),
    });
  };

  const addAchievement = () => {
    setEditData({
      ...editData,
      achievements: [
        ...editData.achievements,
        {
          title: "",
          description: "",
          date: "",
          icon: "🎯",
        },
      ],
    });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    const newAchievements = [...editData.achievements];
    const currentAchievement = newAchievements[index];

    if (!currentAchievement) return;

    newAchievements[index] = {
      title: field === "title" ? value : currentAchievement.title,
      description:
        field === "description" ? value : currentAchievement.description,
      date: field === "date" ? value : currentAchievement.date,
      icon: field === "icon" ? value : currentAchievement.icon,
    };

    setEditData({ ...editData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    setEditData({
      ...editData,
      achievements: editData.achievements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Bio Section */}
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>About Me</CardTitle>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] w-full flex flex-col p-0"
              >
                <DialogHeader className="shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 border-b dialog-header-mobile">
                  <DialogTitle className="dialog-title-mobile text-lg sm:text-xl font-semibold">
                    Customize About Section
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        className="mt-2 min-h-32"
                        placeholder="Tell others about yourself..."
                      />
                    </div>

                    <Separator />

                    {/* Personal Info */}
                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                        Personal Information
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editData.location}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                location: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            value={editData.occupation}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                occupation: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            value={editData.education}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                education: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Social Links */}
                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                        Social Links
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={editData.website}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                website: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            value={editData.twitter}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                twitter: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={editData.github}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                github: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={editData.linkedin}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                linkedin: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Interests */}
                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                        Interests
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editData.interests.map((interest, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-electric-blue/10 text-electric-blue px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                            <button
                              onClick={() => removeInterest(interest)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add an interest..."
                          onKeyPress={(e) => e.key === "Enter" && addInterest()}
                          className="flex-1"
                        />
                        <Button
                          onClick={addInterest}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Add</span>
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Achievements */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                        <Label className="text-sm sm:text-base font-semibold">
                          Achievements
                        </Label>
                        <Button
                          onClick={addAchievement}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {editData.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className="p-3 sm:p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  value={achievement.icon}
                                  onChange={(e) =>
                                    updateAchievement(
                                      index,
                                      "icon",
                                      e.target.value
                                    )
                                  }
                                  className="w-12 sm:w-16 text-center text-sm"
                                  placeholder="🎯"
                                />
                                <Input
                                  value={achievement.title}
                                  onChange={(e) =>
                                    updateAchievement(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Achievement title..."
                                  className="flex-1 text-sm"
                                />
                              </div>
                              <Button
                                onClick={() => removeAchievement(index)}
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={achievement.description}
                              onChange={(e) =>
                                updateAchievement(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Achievement description..."
                              rows={2}
                            />
                            <Input
                              type="month"
                              value={
                                achievement.date
                                  ? convertToMonthFormat(achievement.date)
                                  : ""
                              }
                              onChange={(e) =>
                                updateAchievement(
                                  index,
                                  "date",
                                  convertFromMonthFormat(e.target.value)
                                )
                              }
                              placeholder="Select month and year"
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
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
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Bio</h4>
            <p className="text-muted-foreground leading-relaxed">
              {aboutData.bio}
            </p>
          </div>

          <Separator />

          {/* Personal Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{aboutData.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Occupation
                  </div>
                  <div className="font-medium">{aboutData.occupation}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Education</div>
                  <div className="font-medium">{aboutData.education}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Website</div>
                  <a
                    href={`https://${aboutData.website}`}
                    className="font-medium text-electric-blue hover:underline"
                  >
                    {aboutData.website}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Twitter className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Twitter</div>
                  <a
                    href={`https://twitter.com/${aboutData.twitter.replace(
                      "@",
                      ""
                    )}`}
                    className="font-medium text-electric-blue hover:underline"
                  >
                    {aboutData.twitter}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Github className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">GitHub</div>
                  <a
                    href={`https://${aboutData.github}`}
                    className="font-medium text-electric-blue hover:underline"
                  >
                    {aboutData.github}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Interests */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {aboutData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <Separator />

          {/* Detailed About Section - Web Builder */}
          <div>
            <DetailedAboutSection />
          </div>

          <Separator />

          {/* Achievements */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Recent Achievements
            </h4>
            <div className="space-y-4">
              {aboutData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="about-achievement flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-xl flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">
                      {achievement.title}
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
