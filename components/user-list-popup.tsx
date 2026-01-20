"use client";

import { memo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author } from "@/lib/posts-data";

interface UserListPopupProps {
  users: Author[];
  isVisible: boolean;
  buttonRef?: React.RefObject<HTMLElement>;
  align?: "left" | "right" | "center";
}

export const UserListPopup = memo<UserListPopupProps>(
  ({ users, isVisible, buttonRef, align = "left" }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Calculate position based on available space
    useEffect(() => {
      if (!isVisible || !buttonRef?.current || !mounted) {
        setPosition(null);
        return;
      }

      const calculatePosition = () => {
        if (!buttonRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const estimatedPopupHeight = 300; // max-h-[300px]
        const popupWidth = 280;

        // Determine vertical position
        let top: number;
        if (spaceBelow >= estimatedPopupHeight + 20) {
          // Show below
          top = buttonRect.bottom + 8;
        } else if (spaceAbove >= estimatedPopupHeight + 20) {
          // Show above
          top = buttonRect.top - estimatedPopupHeight - 8;
        } else {
          // Use the side with more space
          if (spaceBelow > spaceAbove) {
            top = buttonRect.bottom + 8;
          } else {
            top = buttonRect.top - estimatedPopupHeight - 8;
          }
        }

        // Determine horizontal position based on align prop
        let left: number;
        if (align === "right") {
          left = buttonRect.right - popupWidth;
        } else if (align === "center") {
          left = buttonRect.left + (buttonRect.width - popupWidth) / 2;
        } else {
          left = buttonRect.left;
        }

        // Ensure popup doesn't go off-screen
        const margin = 8;
        if (left < margin) {
          left = margin;
        } else if (left + popupWidth > viewportWidth - margin) {
          left = viewportWidth - popupWidth - margin;
        }

        setPosition({ top, left });
      };

      calculatePosition();

      // Recalculate on scroll and resize
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
        window.removeEventListener("resize", calculatePosition);
      };
    }, [isVisible, buttonRef, align, mounted]);

    if (!isVisible || users.length === 0 || !mounted || !position) return null;

    const popupContent = (
      <div
        ref={popupRef}
        className="fixed py-2 max-h-[300px] overflow-y-auto shadow-2xl"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: "280px",
          borderRadius: "12px",
          border: "1px solid rgba(229, 247, 253, 0.4)",
          backgroundColor: "#080E11F5",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(229, 247, 253, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2 border-b border-white/10">
          <span className="text-sm font-medium" style={{ color: "#9BB6CC" }}>
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        </div>
        <div className="py-1">
          {users.map((user, index) => (
            <div
              key={`${user.username}-${index}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-medium text-sm truncate"
                    style={{ color: "#E9F0F5" }}
                  >
                    {user.name}
                  </span>
                  {user.verified && (
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
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
                </div>
                <span
                  className="text-xs truncate block"
                  style={{ color: "#9BB6CC" }}
                >
                  {user.username}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return createPortal(popupContent, document.body);
  }
);

UserListPopup.displayName = "UserListPopup";
