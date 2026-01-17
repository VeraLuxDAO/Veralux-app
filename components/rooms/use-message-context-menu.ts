import { useCallback, useEffect, useState, type MouseEvent } from "react";

const MENU_WIDTH = 362;
const MENU_HEIGHT = 60 + 8 + 224;
const MENU_MARGIN = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function useMessageContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messageId, setMessageId] = useState<string | null>(null);

  const openMenu = useCallback((event: MouseEvent, nextMessageId?: string) => {
    event.preventDefault();
    const x = clamp(
      event.clientX,
      MENU_MARGIN,
      window.innerWidth - MENU_WIDTH - MENU_MARGIN
    );
    const y = clamp(
      event.clientY,
      MENU_MARGIN,
      window.innerHeight - MENU_HEIGHT - MENU_MARGIN
    );
    if (nextMessageId) {
      setMessageId(nextMessageId);
    }
    setPosition({ x, y });
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => {
      setIsOpen(false);
    };
    document.addEventListener("click", handleClose);
    document.addEventListener("contextmenu", handleClose);
    document.addEventListener("scroll", handleClose, true);
    return () => {
      document.removeEventListener("click", handleClose);
      document.removeEventListener("contextmenu", handleClose);
      document.removeEventListener("scroll", handleClose, true);
    };
  }, [isOpen]);

  return {
    isOpen,
    position,
    messageId,
    openMenu,
    closeMenu,
  };
}
