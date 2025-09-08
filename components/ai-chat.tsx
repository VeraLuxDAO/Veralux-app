"use client";

import * as React from "react";
import { AIChatIcon } from "@/components/ai-chat-icon";
import { AIChatBar } from "@/components/ai-chat-bar";

interface AIChatProps {
  className?: string;
}

export function AIChat({ className = "" }: AIChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AIChatIcon
        onClick={handleToggle}
        isOpen={isOpen}
        className={className}
      />
      <AIChatBar isOpen={isOpen} onClose={handleClose} className={className} />
    </>
  );
}
