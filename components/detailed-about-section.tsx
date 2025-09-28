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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Edit3,
  Type,
  Image as ImageIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Save,
  X,
  Plus,
  Trash2,
  Move,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentBlock {
  id: string;
  type: "text" | "image" | "heading" | "divider";
  content: string;
  styles: {
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    color: string;
    backgroundColor: string;
    padding: number;
    margin: number;
    borderRadius: number;
  };
}

interface DetailedAboutData {
  title: string;
  subtitle: string;
  contentBlocks: ContentBlock[];
}

interface DetailedAboutSectionProps {
  className?: string;
}

export function DetailedAboutSection({ className }: DetailedAboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState<DetailedAboutData>({
    title: "My Story",
    subtitle: "A deeper look into who I am and what drives me",
    contentBlocks: [
      {
        id: "1",
        type: "heading",
        content: "Welcome to My Journey",
        styles: {
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "left",
          color: "#1f2937",
          backgroundColor: "transparent",
          padding: 0,
          margin: 16,
          borderRadius: 0,
        },
      },
      {
        id: "2",
        type: "text",
        content:
          "I'm a passionate developer who believes in the transformative power of technology. My journey began five years ago when I first discovered blockchain technology, and since then, I've been dedicated to building solutions that make a real difference in people's lives.\n\nWhat started as curiosity about decentralized systems has evolved into a deep expertise in smart contract development, DeFi protocols, and NFT marketplaces. I've had the privilege of working with amazing teams and contributing to projects that have collectively managed over $50 million in digital assets.",
        styles: {
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          color: "#4b5563",
          backgroundColor: "transparent",
          padding: 16,
          margin: 8,
          borderRadius: 8,
        },
      },
      {
        id: "3",
        type: "heading",
        content: "My Philosophy",
        styles: {
          fontSize: 20,
          fontWeight: "semibold",
          textAlign: "left",
          color: "#1f2937",
          backgroundColor: "transparent",
          padding: 0,
          margin: 16,
          borderRadius: 0,
        },
      },
      {
        id: "4",
        type: "text",
        content:
          "I believe that the best technology is invisible – it just works, seamlessly integrating into people's lives to make them better. Whether I'm architecting a new DeFi protocol or optimizing smart contract gas costs, I always keep the end user in mind.\n\nCollaboration is at the heart of everything I do. The blockchain space moves fast, and the only way to keep up is by learning from others and sharing knowledge freely. That's why I'm active in developer communities, contribute to open-source projects, and mentor newcomers to Web3.",
        styles: {
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          color: "#4b5563",
          backgroundColor: "#f9fafb",
          padding: 16,
          margin: 8,
          borderRadius: 8,
        },
      },
    ],
  });

  const [editData, setEditData] = useState<DetailedAboutData>(aboutData);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleSave = () => {
    setAboutData(editData);
    setIsEditing(false);
    setSelectedBlockId(null);
  };

  const handleCancel = () => {
    setEditData(aboutData);
    setIsEditing(false);
    setSelectedBlockId(null);
  };

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content:
        type === "heading"
          ? "New Heading"
          : type === "text"
          ? "New text content..."
          : type === "divider"
          ? ""
          : "Image URL",
      styles: {
        fontSize: type === "heading" ? 20 : 16,
        fontWeight: type === "heading" ? "bold" : "normal",
        textAlign: "left",
        color: "#1f2937",
        backgroundColor: "transparent",
        padding: type === "text" ? 16 : 0,
        margin: 8,
        borderRadius: 0,
      },
    };

    setEditData({
      ...editData,
      contentBlocks: [...editData.contentBlocks, newBlock],
    });
  };

  const updateContentBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEditData({
      ...editData,
      contentBlocks: editData.contentBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    });
  };

  const deleteContentBlock = (id: string) => {
    setEditData({
      ...editData,
      contentBlocks: editData.contentBlocks.filter((block) => block.id !== id),
    });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const renderContentBlock = (block: ContentBlock, isEditable = false) => {
    const blockStyles = {
      fontSize: `${Math.max(14, Math.min(block.styles.fontSize, 32))}px`, // Clamp font size for mobile
      fontWeight: block.styles.fontWeight,
      textAlign: block.styles.textAlign as any,
      color: block.styles.color,
      backgroundColor: block.styles.backgroundColor,
      padding: `${Math.max(8, block.styles.padding)}px`, // Minimum padding for mobile
      margin: `${block.styles.margin}px 0`,
      borderRadius: `${block.styles.borderRadius}px`,
      wordWrap: "break-word" as any,
      overflowWrap: "break-word" as any,
      hyphens: "auto" as any,
      maxWidth: "100%",
    };

    const isSelected = selectedBlockId === block.id;

    if (block.type === "divider") {
      return (
        <div
          key={block.id}
          className={cn(
            "border-t border-gray-200 my-4",
            isEditable &&
              "cursor-pointer hover:border-electric-blue transition-colors",
            isSelected && "border-electric-blue border-2"
          )}
          style={blockStyles}
          onClick={() => isEditable && setSelectedBlockId(block.id)}
        />
      );
    }

    if (block.type === "image") {
      return (
        <div
          key={block.id}
          className={cn(
            "relative w-full",
            isEditable &&
              "cursor-pointer hover:ring-2 hover:ring-electric-blue/50 transition-all",
            isSelected && "ring-2 ring-electric-blue"
          )}
          style={blockStyles}
          onClick={() => isEditable && setSelectedBlockId(block.id)}
        >
          <img
            src={block.content || "/placeholder-image.jpg"}
            alt="Content"
            className="w-full h-auto max-w-full rounded object-cover"
            style={{ maxHeight: "400px" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
        </div>
      );
    }

    const Component = block.type === "heading" ? "h3" : "p";

    return (
      <Component
        key={block.id}
        className={cn(
          "transition-all duration-200 w-full break-words",
          block.type === "heading" &&
            "text-lg sm:text-xl lg:text-2xl font-semibold leading-tight",
          block.type === "text" && "text-sm sm:text-base leading-relaxed",
          isEditable &&
            "cursor-pointer hover:ring-2 hover:ring-electric-blue/50",
          isSelected && "ring-2 ring-electric-blue"
        )}
        style={blockStyles}
        onClick={() => isEditable && setSelectedBlockId(block.id)}
        dangerouslySetInnerHTML={{
          __html: block.content.replace(/\n/g, "<br>"),
        }}
      />
    );
  };

  const selectedBlock = editData.contentBlocks.find(
    (block) => block.id === selectedBlockId
  );

  return (
    <div
      className={cn("detailed-about-section space-y-4 sm:space-y-6", className)}
    >
      <Card className="relative w-full max-w-full">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                {aboutData.title}
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 break-words">
                {aboutData.subtitle}
              </p>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 w-full sm:w-auto"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="max-w-[98vw] sm:max-w-[95vw] lg:max-w-7xl xl:max-w-[90vw] max-h-[95vh] w-full flex flex-col p-0"
              >
                <DialogHeader className="shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 border-b">
                  <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                    <Type className="h-4 w-4 sm:h-5 sm:w-5" />
                    Customize Detailed About Section
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                  {/* Left Panel - Content Editor */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 lg:border-r border-b lg:border-b-0">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Section Settings */}
                      <Card className="p-3 sm:p-4">
                        <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                          Section Settings
                        </Label>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="title" className="text-sm">
                              Section Title
                            </Label>
                            <Input
                              id="title"
                              value={editData.title}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  title: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle" className="text-sm">
                              Subtitle
                            </Label>
                            <Input
                              id="subtitle"
                              value={editData.subtitle}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  subtitle: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </Card>

                      {/* Content Blocks */}
                      <Card className="p-3 sm:p-4">
                        <div className="flex flex-col space-y-3 mb-4">
                          <Label className="text-sm sm:text-base font-semibold">
                            Content Blocks
                          </Label>
                          <div className="content-blocks-grid">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentBlock("heading")}
                              className="content-block-button text-xs sm:text-sm flex items-center justify-center p-2 sm:p-3 h-auto min-h-[2.5rem] sm:min-h-[3rem] transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <Type className="icon h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs font-medium">
                                  Heading
                                </span>
                              </div>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentBlock("text")}
                              className="content-block-button text-xs sm:text-sm flex items-center justify-center p-2 sm:p-3 h-auto min-h-[2.5rem] sm:min-h-[3rem] transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <AlignLeft className="icon h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs font-medium">
                                  Text
                                </span>
                              </div>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentBlock("image")}
                              className="content-block-button text-xs sm:text-sm flex items-center justify-center p-2 sm:p-3 h-auto min-h-[2.5rem] sm:min-h-[3rem] transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <ImageIcon className="icon h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs font-medium">
                                  Image
                                </span>
                              </div>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentBlock("divider")}
                              className="content-block-button text-xs sm:text-sm flex items-center justify-center p-2 sm:p-3 h-auto min-h-[2.5rem] sm:min-h-[3rem] transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <Separator className="icon h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs font-medium">
                                  Divider
                                </span>
                              </div>
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {editData.contentBlocks.map((block, index) => (
                            <div
                              key={block.id}
                              className={cn(
                                "p-3 border rounded-lg cursor-pointer transition-all",
                                selectedBlockId === block.id
                                  ? "border-electric-blue bg-electric-blue/5"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                              onClick={() => setSelectedBlockId(block.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Move className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium capitalize">
                                    {block.type}
                                  </span>
                                  <span className="text-xs text-gray-500 truncate max-w-32">
                                    {block.content.substring(0, 30)}...
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContentBlock(block.id);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Block Editor */}
                      {selectedBlock && (
                        <Card className="p-3 sm:p-4">
                          <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                            Edit{" "}
                            {selectedBlock.type.charAt(0).toUpperCase() +
                              selectedBlock.type.slice(1)}
                          </Label>
                          <div className="space-y-4">
                            {/* Content */}
                            {selectedBlock.type !== "divider" && (
                              <div>
                                <Label className="text-sm">Content</Label>
                                {selectedBlock.type === "text" ? (
                                  <Textarea
                                    value={selectedBlock.content}
                                    onChange={(e) =>
                                      updateContentBlock(selectedBlock.id, {
                                        content: e.target.value,
                                      })
                                    }
                                    className="mt-1 min-h-24"
                                    placeholder="Enter your content..."
                                  />
                                ) : (
                                  <Input
                                    value={selectedBlock.content}
                                    onChange={(e) =>
                                      updateContentBlock(selectedBlock.id, {
                                        content: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                    placeholder={
                                      selectedBlock.type === "image"
                                        ? "Image URL"
                                        : "Heading text"
                                    }
                                  />
                                )}
                              </div>
                            )}

                            {/* Styling Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Label className="text-sm">Font Size</Label>
                                <Slider
                                  value={[selectedBlock.styles.fontSize]}
                                  onValueChange={([value]) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        fontSize: value,
                                      },
                                    })
                                  }
                                  min={12}
                                  max={48}
                                  step={1}
                                  className="mt-2"
                                />
                                <span className="text-xs text-gray-500">
                                  {selectedBlock.styles.fontSize}px
                                </span>
                              </div>

                              <div>
                                <Label className="text-sm">Font Weight</Label>
                                <Select
                                  value={selectedBlock.styles.fontWeight}
                                  onValueChange={(value) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        fontWeight: value,
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">
                                      Normal
                                    </SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="semibold">
                                      Semibold
                                    </SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm">Text Align</Label>
                                <Select
                                  value={selectedBlock.styles.textAlign}
                                  onValueChange={(value) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        textAlign: value,
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">
                                      Center
                                    </SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm">Text Color</Label>
                                <Input
                                  type="color"
                                  value={selectedBlock.styles.color}
                                  onChange={(e) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        color: e.target.value,
                                      },
                                    })
                                  }
                                  className="mt-1 h-10"
                                />
                              </div>

                              <div>
                                <Label className="text-sm">
                                  Background Color
                                </Label>
                                <Input
                                  type="color"
                                  value={
                                    selectedBlock.styles.backgroundColor ===
                                    "transparent"
                                      ? "#ffffff"
                                      : selectedBlock.styles.backgroundColor
                                  }
                                  onChange={(e) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        backgroundColor: e.target.value,
                                      },
                                    })
                                  }
                                  className="mt-1 h-10"
                                />
                              </div>

                              <div>
                                <Label className="text-sm">Padding</Label>
                                <Slider
                                  value={[selectedBlock.styles.padding]}
                                  onValueChange={([value]) =>
                                    updateContentBlock(selectedBlock.id, {
                                      styles: {
                                        ...selectedBlock.styles,
                                        padding: value,
                                      },
                                    })
                                  }
                                  min={0}
                                  max={48}
                                  step={4}
                                  className="mt-2"
                                />
                                <span className="text-xs text-gray-500">
                                  {selectedBlock.styles.padding}px
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Live Preview */}
                  <div className="w-full lg:w-1/2 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gray-50/50 max-h-[40vh] lg:max-h-none">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Eye className="h-4 w-4" />
                        Live Preview
                      </div>
                      <Card className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold">
                              {editData.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {editData.subtitle}
                            </p>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            {editData.contentBlocks.map((block) =>
                              renderContentBlock(block, true)
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 p-3 sm:p-4 lg:p-6 pt-3 sm:pt-4 border-t bg-muted/30">
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
        <CardContent className="card-content p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4 w-full overflow-hidden">
            {aboutData.contentBlocks.map((block) => renderContentBlock(block))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
