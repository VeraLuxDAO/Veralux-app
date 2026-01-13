"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageViewer } from "@/components/chat/image-viewer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaFile {
  type: "image" | "video" | "audio";
  url: string;
  mime?: string;
  playable?: boolean;
}

interface FlowPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badges: string[];
  };
  content: string;
  timestamp: string;
  glows: number;
  tips: number;
  replies: number;
  hasGlowed: boolean;
  hasTipped: boolean;
  tags: string[];
  media?: MediaFile[];
}

interface PostCardProps {
  post: FlowPost;
  onGlow: (postId: string) => void;
  onTip: (postId: string) => void;
}

export const PostCard = memo<PostCardProps>(({ post, onGlow, onTip }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible by default
  const [hasReplied, setHasReplied] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Filter images from media
  const images = post.media?.filter(m => m.type === "image") || [];
  const hasMultipleImages = images.length > 1;

  // Reset image index when post changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post.id]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer for scroll-based animation (only for posts below viewport)
  useEffect(() => {
    const currentRef = cardRef.current;
    if (!currentRef || hasAnimated.current) return;

    // Check after a short delay to ensure DOM is ready
    const checkAndAnimate = () => {
      const rect = currentRef.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // If post is already in or near viewport, keep it visible
      if (rect.top < viewportHeight + 400) {
        setIsVisible(true);
        hasAnimated.current = true;
        return;
      }

      // If post is far below viewport, hide it first then animate in on scroll
      setIsVisible(false);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              setIsVisible(true);
              hasAnimated.current = true;
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "400px",
        }
      );

      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    };

    // Use both setTimeout and requestAnimationFrame for reliability
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(checkAndAnimate);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "transition-all duration-500 rounded-xl py-[0px] shadow-lg w-full cursor-pointer hover:shadow-xl group relative overflow-hidden",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      )}
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
          border: "1px solid #FFFFFF14",
      }}
    >
      {/* Hover overlay - brighter gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(229, 247, 253, 0.12) 0%, rgba(229, 247, 253, 0.04) 100%)",
        }}
      />
      <CardContent className="p-3 sm:p-5 md:py-0.5 md:p-3">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-sm">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="font-semibold text-white"
                style={{ fontSize: "14px" }}
              >
                {post.author.name}
              </span>
              <span 
                className="text-gray-400"
                style={{ fontSize: "12px" }}
              >
                {post.author.username}
              </span>
              {post.author.verified && isMounted && (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "rgba(250, 222, 253, 1)" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span 
                className="text-gray-500"
                style={{ fontSize: "12px" }}
              >
                • {post.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-gray-100 whitespace-pre-line leading-relaxed text-base sm:text-[16px]">
            {post.content}
          </p>
        </div>

        {/* Post Media (Images, Videos, Audio) */}
        {post.media && post.media.length > 0 && (
          <div className="mb-3 mt-3 bg-black rounded-lg">
            {/* Images - Show one at a time with navigation if multiple */}
            {images.length > 0 && (
              <div className="relative mb-2 bg-blackimage.png">
                <div className="relative rounded-lg overflow-hidden w-1/2 mx-auto" style={{ aspectRatio: "1 / 1" }}>
                  {/* Current Image */}
                  <img
                    src={images[currentImageIndex]?.url}
                    alt={`Post image ${currentImageIndex + 1}`}
                    className="w-full h-full rounded-lg object-cover cursor-pointer transition-opacity hover:opacity-90"
                    onClick={() => {
                      setSelectedImageIndex(currentImageIndex);
                      setImageViewerOpen(true);
                    }}
                    style={{ display: "block" }}
                  />
                  
                  {/* Navigation Arrows - Only show if multiple images */}
                  {hasMultipleImages && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => 
                            prev > 0 ? prev - 1 : images.length - 1
                          );
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all z-10"
                        aria-label="Previous image"
                      >
                        <ArrowLeft className="w-4 h-4 text-white" />
                      </button>
                      
                      {/* Right Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => 
                            prev < images.length - 1 ? prev + 1 : 0
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all z-10"
                        aria-label="Next image"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Videos and Audio - Display separately */}
            <div className={cn(
              "flex gap-2",
              post.media.filter(m => m.type !== "image").length > 1 ? "flex-wrap" : "flex-col"
            )}>
            {post.media
              .filter(m => m.type !== "image")
              .map((mediaItem, index) => {
                const isVideoPlayable =
                  mediaItem.type !== "video" ||
                  mediaItem.playable !== false;

                return (
                  <div 
                    key={`${mediaItem.type}-${index}`} 
                    className={cn(
                      "relative rounded-lg overflow-hidden",
                      post.media && post.media.filter(m => m.type !== "image").length === 1 
                        ? "w-1/2 mx-auto" 
                        : "w-[calc(25%-4px)] sm:w-[calc(16.667%-5.33px)]"
                    )}
                    style={{
                      aspectRatio: "1 / 1",
                    }}
                  >
                    {mediaItem.type === "video" && isVideoPlayable && (
                      <video
                        src={mediaItem.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full rounded-lg object-cover bg-black"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {mediaItem.type === "video" && !isVideoPlayable && (
                      <div className="w-full h-full rounded-lg bg-black/60 text-white text-sm flex items-center justify-center text-center px-3">
                        <span>
                          Unsupported video format. Please upload MP4, WebM, OGG, or MOV.
                        </span>
                      </div>
                    )}
                    {mediaItem.type === "audio" && (
                      <div className="w-full h-full p-4 rounded-lg bg-[rgba(31,43,49,0.3)] flex items-center gap-3">
                        <svg
                          className="w-8 h-8 flex-shrink-0"
                          style={{ color: "rgba(250, 222, 253, 1)" }}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                        <audio src={mediaItem.url} controls className="flex-1 w-full">
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {post.media && post.media.some(m => m.type === "image") && (
          <ImageViewer
            isOpen={imageViewerOpen}
            onClose={() => setImageViewerOpen(false)}
            images={post.media.filter(m => m.type === "image").map(m => m.url)}
            currentIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
          />
        )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "rgba(31, 43, 49, 0.56)",
                    color: "#E9F0F5",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        <div 
          className={cn(
            "flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 py-3 sm:gap-4 rounded-lg",
            "bg-transparent"
          )}
        >

          {/* Engagement Metrics and Actions - right section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 justify-end flex-wrap sm:flex-nowrap">
              <button
                onClick={() => onGlow(post.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-2 rounded-[20px] cursor-pointer transition-colors flex-shrink-0",
                  post.hasGlowed 
                    ? "border" 
                    : ""
                )}
                style={
                  post.hasGlowed
                    ? {
                        backgroundColor: "#FADEFD33",
                        borderColor: "#FADEFD66",
                        borderWidth: "1px",
                      }
                    : {}
                }
              >
                {isMounted && (
                  <svg width="18" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ color: post.hasGlowed ? "#FADEFD" : "#9BB6CC" }}>
                  <path d="M16.8261 2.09319C16.4004 1.66736 15.8951 1.32956 15.3389 1.09909C14.7827 0.868623 14.1865 0.75 13.5844 0.75C12.9823 0.75 12.3862 0.868623 11.8299 1.09909C11.2737 1.32956 10.7684 1.66736 10.3427 2.09319L9.45941 2.97652L8.57608 2.09319C7.71633 1.23344 6.55027 0.750446 5.33441 0.750446C4.11855 0.750446 2.95249 1.23344 2.09274 2.09319C1.233 2.95293 0.75 4.11899 0.75 5.33485C0.75 6.55071 1.233 7.71678 2.09274 8.57652L9.45941 15.9432L16.8261 8.57652C17.2519 8.15089 17.5897 7.64553 17.8202 7.08932C18.0506 6.5331 18.1693 5.93693 18.1693 5.33485C18.1693 4.73278 18.0506 4.13661 17.8202 3.58039C17.5897 3.02418 17.2519 2.51882 16.8261 2.09319Z" />
                  </svg>
                  
                )}
                <span
                  className="text-[16px] font-light"
                  style={{ color: post.hasGlowed ? "#FADEFD" : "#9BB6CC" }}
                >
                  {post.glows}
                </span>
              </button>

              <button
                onClick={() => onTip(post.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-2 rounded-[20px] cursor-pointer transition-colors flex-shrink-0",
                  post.hasTipped 
                    ? "border" 
                    : ""
                )}
                style={
                  post.hasTipped
                    ? {
                        backgroundColor: "#FADEFD33",
                        borderColor: "#FADEFD66",
                        borderWidth: "1px",
                      }
                    : {}
                }
              >
                {isMounted && (
                  <svg
                    className="w-4 h-4"
                    style={{ color: post.hasTipped ? "#FADEFD" : "#9BB6CC" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <svg width="20" height="20" viewBox="0 0 10 12" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ color: post.hasTipped ? "#FADEFD" : "#9BB6CC" }}>
                      <path d="M9.08333 4.91667L4.91667 0.75L0.75 4.91667M9.08333 10.75L4.91667 6.58333L0.75 10.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                  </svg>
                )}
                <span
                  className="text-[16px] font-light"
                  style={{ color: post.hasTipped ? "#FADEFD" : "#9BB6CC" }}
                >
                  {post.tips}
                </span>
              </button>

              <button 
                onClick={() => setHasReplied(!hasReplied)}
                className={cn(
                  "flex items-center gap-1 px-2 py-2 rounded-[20px] cursor-pointer transition-colors flex-shrink-0",
                  hasReplied 
                    ? "border" 
                    : ""
                )}
                style={
                  hasReplied
                    ? {
                        backgroundColor: "#FADEFD33",
                        borderColor: "#FADEFD66",
                        borderWidth: "1px",
                      }
                    : {}
                }
              >
                {isMounted && (
                  <svg
                    className="w-4 h-4"
                    style={{ color: hasReplied ? "#FADEFD" : "#9BB6CC" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ color: hasReplied ? "#FADEFD" : "#9BB6CC" }}>
                    <path d="M15.75 8.25C15.75 12.3921 12.3921 15.75 8.25 15.75C7.25238 15.75 6.30025 15.5552 5.42958 15.2016C5.26294 15.1339 5.17962 15.1001 5.11227 15.085C5.04638 15.0702 4.99763 15.0648 4.93011 15.0648C4.86109 15.0648 4.78591 15.0773 4.63554 15.1024L1.67063 15.5966C1.36015 15.6483 1.20491 15.6742 1.09265 15.626C0.994402 15.5839 0.916108 15.5056 0.873967 15.4073C0.825819 15.2951 0.851692 15.1398 0.903439 14.8294L1.39759 11.8645C1.42265 11.7141 1.43518 11.6389 1.43517 11.5699C1.43516 11.5024 1.42976 11.4536 1.415 11.3877C1.3999 11.3204 1.36606 11.2371 1.29839 11.0704C0.94478 10.1997 0.75 9.24762 0.75 8.25C0.75 4.10786 4.10786 0.75 8.25 0.75C12.3921 0.75 15.75 4.10786 15.75 8.25Z"/>
                  </svg>


                  </svg>
                )}
                <span
                  className="text-[16px] font-light"
                  style={{ color: hasReplied ? "#FADEFD" : "#9BB6CC" }}
                >
                  {post.replies}
                </span>
              </button>

              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                style={{
                  backgroundColor: "#FADEFD",
                }}
              >
                {isMounted && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.37585 2.29167C8.42796 1.26068 9.86891 0.625 11.4583 0.625C14.68 0.625 17.2917 3.23667 17.2917 6.45833C17.2917 8.04778 16.656 9.48875 15.625 10.5409M12.2917 11.4583C12.2917 14.68 9.67999 17.2917 6.45833 17.2917C3.23667 17.2917 0.625 14.68 0.625 11.4583C0.625 8.23667 3.23667 5.625 6.45833 5.625C9.67999 5.625 12.2917 8.23667 12.2917 11.4583Z" stroke="#080E11" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                )}
              </button>
          </div>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
            style={{
              backgroundColor: "#FADEFD33",
            }}
          >
            {isMounted && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1778 6.17509L9.61819 0.599613C9.40834 0.389162 9.04882 0.537781 9.04882 0.83498L9.04883 3.05664C9.04883 3.22526 8.91214 3.36196 8.74352 3.36196C4.19075 3.36196 0.5 7.05271 0.5 11.6055L0.5 14.5106C0.5 14.8472 0.942214 14.9717 1.11776 14.6844L1.77857 13.6031C3.26196 11.1757 5.90167 9.69529 8.74639 9.69529C8.91343 9.69529 9.04884 9.8307 9.04884 9.99773V11.97C9.04884 12.267 9.40788 12.4157 9.61787 12.2057L15.1774 6.64616C15.3075 6.51611 15.3076 6.30532 15.1778 6.17509Z" stroke="#FADEFD" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";
