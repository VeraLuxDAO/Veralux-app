"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Layout,
  Type,
  Image as ImageIcon,
  Video,
  Code,
  Palette,
  Settings,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WebBuilderPlaceholderProps {
  className?: string;
}

export function WebBuilderPlaceholder({
  className,
}: WebBuilderPlaceholderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <div className={cn("web-builder-fullbleed", className)}>
      <div
        className="w-full bg-gradient-to-b from-yellow-50/50 via-yellow-50/40 to-yellow-50/20 dark:from-yellow-900/20 dark:via-yellow-900/15 dark:to-yellow-900/5 hover:from-yellow-50/70 hover:via-yellow-50/60 hover:to-yellow-50/30 dark:hover:from-yellow-900/30 dark:hover:via-yellow-900/25 dark:hover:to-yellow-900/10 transition-all duration-500 cursor-pointer group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingBottom: "10rem" }} // Extended padding to prevent clipping
      >
        {/* Curved bottom edge using SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-12 sm:h-16 lg:h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              className="fill-yellow-50/30 dark:fill-yellow-900/10"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              className="fill-yellow-50/20 dark:fill-yellow-900/5"
            />
          </svg>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center space-y-6">
            {/* Icon and Title */}
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400/20 rounded-full flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300">
                <Layout
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-400 transition-transform duration-300",
                    isHovered && "scale-110"
                  )}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  Custom Web Builder Section
                </h3>
                <p className="text-yellow-700/80 dark:text-yellow-300/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                  Create stunning custom sections with our drag-and-drop web
                  builder. Add text, images, videos, and interactive elements to
                  showcase your unique story.
                </p>
              </div>
            </div>

            {/* Feature Icons */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 py-4">
              {[
                { icon: Type, label: "Text" },
                { icon: ImageIcon, label: "Images" },
                { icon: Video, label: "Videos" },
                { icon: Code, label: "Code" },
                { icon: Palette, label: "Styling" },
              ].map(({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  className="flex flex-col items-center space-y-2 group/item"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center group-hover/item:bg-yellow-400/20 transition-colors duration-200">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-xs text-yellow-700/70 dark:text-yellow-300/70 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                  >
                    <Plus className="w-5 h-5 mr-2 group-hover/btn:rotate-90 transition-transform duration-200" />
                    Start Building
                  </Button>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="max-w-[98vw] sm:max-w-[95vw] lg:max-w-7xl xl:max-w-[90vw] max-h-[95vh] w-full flex flex-col p-0"
                >
                  <DialogHeader className="shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                      <Layout className="h-4 w-4 sm:h-5 sm:w-5" />
                      Web Builder - Coming Soon
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="text-center space-y-6 py-12">
                      <div className="mx-auto w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <Settings className="w-10 h-10 text-yellow-600 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          Advanced Web Builder
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                          Our powerful drag-and-drop web builder is currently in
                          development. Soon you'll be able to create stunning
                          custom sections with advanced layouts, animations, and
                          interactive elements.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                        {[
                          {
                            icon: Type,
                            title: "Rich Text Editor",
                            desc: "Advanced typography controls",
                          },
                          {
                            icon: ImageIcon,
                            title: "Media Library",
                            desc: "Images, videos, and galleries",
                          },
                          {
                            icon: Code,
                            title: "Custom Code",
                            desc: "HTML, CSS, and JavaScript",
                          },
                          {
                            icon: Palette,
                            title: "Design System",
                            desc: "Colors, fonts, and spacing",
                          },
                        ].map(({ icon: Icon, title, desc }) => (
                          <Card key={title} className="p-4 text-center">
                            <Icon className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
                            <h4 className="font-semibold mb-2">{title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {desc}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-4 sm:p-6 pt-3 sm:pt-4 border-t bg-muted/30">
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsBuilderOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Close Preview
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-400/10"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Templates
              </Button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-2 text-sm text-yellow-600/80 dark:text-yellow-400/80">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Web Builder Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
