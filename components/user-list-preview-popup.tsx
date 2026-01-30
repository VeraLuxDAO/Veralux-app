"use client";

import { memo, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface UserListPreviewPopupProps {
  firstUserName: string;
  othersCount: number;
  isVisible: boolean;
  buttonRef?: React.RefObject<HTMLElement>;
  align?: "left" | "right" | "center";
  onOpenModal: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/** Small hover popup: "FirstName +n others". Click opens full modal. */
export const UserListPreviewPopup = memo<UserListPreviewPopupProps>(
  ({
    firstUserName,
    othersCount,
    isVisible,
    buttonRef,
    align = "left",
    onOpenModal,
    onMouseEnter,
    onMouseLeave,
  }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!isVisible || !buttonRef?.current || !mounted) {
        setPosition(null);
        return;
      }

      const calculatePosition = () => {
        if (!buttonRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const popupWidth = 200;
        const popupHeight = 44;
        const spaceBelow = (window.innerHeight || document.documentElement.clientHeight) - buttonRect.bottom;

        const top =
          spaceBelow >= popupHeight + 12
            ? buttonRect.bottom + 8
            : buttonRect.top - popupHeight - 8;

        let left: number;
        if (align === "right") {
          left = buttonRect.right - popupWidth;
        } else if (align === "center") {
          left = buttonRect.left + (buttonRect.width - popupWidth) / 2;
        } else {
          left = buttonRect.left;
        }

        const margin = 8;
        if (left < margin) left = margin;
        else if (left + popupWidth > viewportWidth - margin)
          left = viewportWidth - popupWidth - margin;

        setPosition({ top, left });
      };

      calculatePosition();
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
        window.removeEventListener("resize", calculatePosition);
      };
    }, [isVisible, buttonRef, align, mounted]);

    if (!isVisible || !mounted || !position) return null;

    const label =
      othersCount > 0 ? `${firstUserName} +${othersCount} others` : firstUserName;

    const popupContent = (
      <div
        role="button"
        tabIndex={0}
        className="fixed py-2 px-3 cursor-pointer transition-opacity hover:opacity-90"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          minWidth: "140px",
          maxWidth: "240px",
          borderRadius: "10px",
          border: "1px solid rgba(229, 247, 253, 0.4)",
          backgroundColor: "#080E11F5",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(229, 247, 253, 0.1)",
          color: "#E9F0F5",
          fontSize: "13px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenModal();
          }
        }}
      >
        <span className="truncate block">{label}</span>
      </div>
    );

    return createPortal(popupContent, document.body);
  }
);

UserListPreviewPopup.displayName = "UserListPreviewPopup";
