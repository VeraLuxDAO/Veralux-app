"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, ArrowUp, X, Image, Video, Music } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "video" | "audio";
}

interface PostCreatorProps {
  onCreatePost: (content: string, files?: File[]) => void;
}

export function PostCreator({ onCreatePost }: PostCreatorProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if ((!content.trim() && uploadedFiles.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const files = uploadedFiles.map((uf) => uf.file);
      onCreatePost(content.trim(), files.length > 0 ? files : undefined);
      setContent("");
      setUploadedFiles([]);
      // Clean up preview URLs
      uploadedFiles.forEach((uf) => {
        if (uf.preview.startsWith("blob:")) {
          URL.revokeObjectURL(uf.preview);
        }
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const getFileType = (file: File): "image" | "video" | "audio" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "image"; // default
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles: UploadedFile[] = files.map((file) => {
      const type = getFileType(file);
      const preview = type === "image" || type === "video" 
        ? URL.createObjectURL(file)
        : ""; // Audio files don't need preview URL
      
      return {
        file,
        preview,
        type,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev[index];
      // Clean up preview URL
      if (fileToRemove?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  // Resize textarea on content change
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  // Get user display info
  const userName = user?.name || "User";
  const userAvatar = user?.picture || "/placeholder.svg";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-start p-3 gap-6 min-h-[72px] rounded-[32px] w-full relative",
        "border border-[rgba(255,255,255,0.08)]"
      )}
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
      }}
    >
      <div className="flex items-start w-full justify-center">
        {/* User Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* Post Input Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex-1 min-w-0 min-h-12 flex relative items-center">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Write something to share..."
              className={cn(
                "bg-transparent text-white border-0 outline-none resize-none",
                "placeholder:text-gray-500",
                "text-sm min-h-[24px] max-h-[1000px]",
                "focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0",
                "focus:ring-0 focus:border-0 focus:outline-none",
                "hover:border-0 active:border-0",
                "pr-24"
              )}
              rows={1}
              style={{ 
                height: "auto",
                border: "none",
                boxShadow: "none",
                outline: "none"
              }}
            />
          </div>

          {/* File Previews */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: "rgba(31, 43, 49, 0.56)",
                  }}
                >
                  {uploadedFile.type === "image" && (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-20 h-20 object-cover"
                    />
                  )}
                  {uploadedFile.type === "video" && (
                    <video
                      src={uploadedFile.preview}
                      className="w-20 h-20 object-cover"
                      muted
                    />
                  )}
                  {uploadedFile.type === "audio" && (
                    <div className="w-20 h-20 flex items-center justify-center">
                      <Music className="w-8 h-8 text-[#FADEFD]" />
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  
                  {/* File type indicator */}
                  <div className="absolute bottom-1 left-1">
                    {uploadedFile.type === "image" && (
                      <Image className="w-3 h-3 text-white" />
                    )}
                    {uploadedFile.type === "video" && (
                      <Video className="w-3 h-3 text-white" />
                    )}
                    {uploadedFile.type === "audio" && (
                      <Music className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - positioned at absolute bottom right of container */}
      <div className="absolute bottom-3 right-3 flex flex-row items-center gap-[10px] flex-shrink-0">
        {/* File Attach Button (Paper clip icon) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileAttach}
          className={cn(
            "flex flex-row items-center p-[10px] w-10 h-10 rounded-full",
            "text-gray-400 hover:text-[rgba(250,222,253,1)] hover:bg-[rgba(250,222,253,0.1)]"
          )}
          title="Attach file"
        >
          <Paperclip className="h-4 w-4 text-[#FADEFD]" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*"
          multiple
        />

        {/* Post Button (Arrow up icon) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleSubmit}
          disabled={(!content.trim() && uploadedFiles.length === 0) || isSubmitting}
          className={cn(
            "flex flex-row items-center p-[10px] w-10 h-10 rounded-full",
            "transition-colors",
            (content.trim() || uploadedFiles.length > 0)
              ? "bg-[#FADEFD] hover:bg-[#FADEFD]"
              : "bg-[#FADEFD1A] hover:bg-[#FADEFD1A]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Post"
        >
          <ArrowUp
            className={cn(
              "h-4 w-4",
              (content.trim() || uploadedFiles.length > 0) ? "text-[#001422]" : "text-[#FADEFD]"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
