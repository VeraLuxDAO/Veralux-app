"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { Paperclip, Smile, Send } from "lucide-react";

interface RoomChatInputProps {
  onSendMessage: (message: string) => void;
}

export function RoomChatInput({ onSendMessage }: RoomChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiTriggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-[#2b3642] bg-[#080E1199]">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 hidden md:flex"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Button
          ref={emojiTriggerRef}
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="h-5 w-5" />
        </Button>

        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-[#1a2332] border-[#2b3642] text-white placeholder:text-gray-500 text-sm md:text-base"
        />

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="flex-shrink-0"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          triggerRef={emojiTriggerRef}
          align="right"
        />
      )}
    </div>
  );
}
