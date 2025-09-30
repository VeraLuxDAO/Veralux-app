"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationLayout } from "@/components/navigation-layout";
import { WebBuilderPlaceholder } from "@/components/web-builder-placeholder";
import { CompactProfileHeader } from "@/components/compact-profile-header";
import { ProfileDashboard } from "@/components/profile-dashboard";
import { ProfileAboutCustomizer } from "@/components/profile-about-customizer";
import { DetailedAboutSection } from "@/components/detailed-about-section";
import { ProfileSkills } from "@/components/profile-skills";
import { ProfileAnalytics } from "@/components/profile-analytics";

export default function ProfilePage() {
  return (
    <NavigationLayout>
      {/* Web Builder Placeholder - Full Width Edge to Edge */}
      <WebBuilderPlaceholder />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Compact Profile Header - Positioned over web builder */}
        <div className="relative -mt-20 z-10">
          <CompactProfileHeader />
        </div>

        {/* Main Profile Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-center px-2">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground profile-tabs-list w-full max-w-md">
              <TabsTrigger
                value="dashboard"
                className="profile-tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                aria-label="View Dashboard - Reputation, Tokens, Badges, and NFTs"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">🏠</span>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="profile-tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                aria-label="View About Me - Personal information and achievements"
              >
                <span className="hidden sm:inline">About Me</span>
                <span className="sm:hidden">👤</span>
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="profile-tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                aria-label="View Skills - Technical expertise and certifications"
              >
                <span className="hidden sm:inline">Skills</span>
                <span className="sm:hidden">🎯</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="profile-tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                aria-label="View Analytics - Performance metrics and insights"
              >
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">📊</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab (Default) */}
          <TabsContent value="dashboard">
            <ProfileDashboard />
          </TabsContent>

          {/* About Me Tab */}
          <TabsContent value="about">
            <ProfileAboutCustomizer />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <ProfileSkills />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <ProfileAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </NavigationLayout>
  );
}
