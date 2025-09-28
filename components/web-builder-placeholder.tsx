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
    <div className={cn("mb-6", className)}>
      <Card
        className="border-2 border-dashed border-yellow-400/60 bg-yellow-50/30 dark:bg-yellow-900/10 hover:border-yellow-500/80 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 transition-all duration-300 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-8 sm:p-12 lg:p-16">
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
        </CardContent>
      </Card>
    </div>
  );
}
