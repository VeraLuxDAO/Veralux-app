"use client";

import { useState, useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarViewerProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  fallbackText?: string;
  userName?: string;
  photos?: string[]; // Array of photo URLs for navigation
  currentPhotoIndex?: number; // Current photo index if multiple photos
}

export function AvatarViewer({
  isOpen,
  onClose,
  avatarUrl,
  fallbackText = "👤",
  userName,
  photos = [],
  currentPhotoIndex = 0,
}: AvatarViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(currentPhotoIndex);
  const imageRef = useRef<HTMLDivElement>(null);

  // Use photos array if available, otherwise use single avatarUrl
  const allPhotos = photos.length > 0 ? photos : avatarUrl ? [avatarUrl] : [];
  const currentPhoto = allPhotos[currentIndex] || avatarUrl;
  const hasMultiplePhotos = allPhotos.length > 1;

  // Reset zoom and position when photo changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [currentIndex, isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiplePhotos) {
        handlePrevious();
      } else if (e.key === "ArrowRight" && hasMultiplePhotos) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasMultiplePhotos, currentIndex]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (zoom > 1 && touch) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (isDragging && zoom > 1 && touch) {
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(1, Math.min(3, zoom + delta));
      setZoom(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    if (currentPhoto) {
      const link = document.createElement("a");
      link.href = currentPhoto;
      link.download = `${userName || "avatar"}-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Custom darker overlay */}
        <DialogPrimitive.Overlay
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/95 duration-300 ease-out"
        />
        <DialogPrimitive.Content
          className="max-w-full w-full h-full max-h-full p-0 bg-black border-0 rounded-none fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={onClose}
        >
          <div className="relative w-full h-full flex flex-col group">
            {/* Header with Controls */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 via-black/70 to-transparent">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {userName || "Profile Photo"}
                </h3>
                {hasMultiplePhotos && (
                  <span className="text-xs text-white/70">
                    {currentIndex + 1} of {allPhotos.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="h-9 w-9 text-white hover:bg-white/20 rounded-full disabled:opacity-50"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="h-9 w-9 text-white hover:bg-white/20 rounded-full disabled:opacity-50"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                {zoom > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetZoom}
                    className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
                    title="Reset Zoom"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image Container */}
            <div
              className="flex-1 flex items-center justify-center overflow-hidden relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
            >
              {/* Navigation Arrows */}
              {hasMultiplePhotos && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    className={cn(
                      "absolute left-4 z-40 h-12 w-12 text-white bg-black/40 hover:bg-black/60 rounded-full transition-all",
                      "backdrop-blur-sm border border-white/10"
                    )}
                    title="Previous (←)"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className={cn(
                      "absolute right-4 z-40 h-12 w-12 text-white bg-black/40 hover:bg-black/60 rounded-full transition-all",
                      "backdrop-blur-sm border border-white/10"
                    )}
                    title="Next (→)"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image */}
              <div
                ref={imageRef}
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
              >
                {currentPhoto ? (
                  <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
                    <img
                      src={currentPhoto}
                      alt={userName || "Avatar"}
                      className="max-w-full max-h-full object-contain select-none"
                      draggable={false}
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 rounded-full bg-[#0a0d12] border-4 border-white/10 flex items-center justify-center text-6xl text-white/50">
                    {fallbackText}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Info Bar (optional) */}
            {userName && (
              <div className="absolute bottom-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <p className="text-sm text-white/90 font-medium">{userName}</p>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
