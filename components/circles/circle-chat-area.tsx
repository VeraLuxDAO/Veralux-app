import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Volume2, Lock, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageComponent, ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { Channel } from "@/lib/circles-mock-data";

interface CircleChatAreaProps {
  channel: Channel;
  messages: ChatMessage[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSendMessage: (content: string, images?: File[]) => void;
  isMembersVisible: boolean;
  onToggleMembers: () => void;
  mobileView?: string;
}

export function CircleChatArea({
  channel,
  messages,
  searchQuery,
  onSearchChange,
  onSendMessage,
  isMembersVisible,
  onToggleMembers,
  mobileView,
}: CircleChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-w-0 relative ml-8 mr-8" style={{ marginRight: isMembersVisible ? "32px" : "0px" }}>
      {/* Chat Header */}
      <div className="flex-shrink-0 px-4 py-5 rounded-[24px] border border-[#FFFFFF14]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {channel.type === "text" ? (
              <Hash className="h-5 w-5 text-[#9BB6CC]" />
            ) : (
              <Volume2 className="h-5 w-5 text-[#9BB6CC]" />
            )}
            <h3 className="font-semibold text-white text-base">
              {channel.name}
            </h3>
            {channel.isPrivate && (
              <Lock className="h-4 w-4 text-[#9BB6CC]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search in channel"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 bg-[#E5F7FD0A] rounded-full text-[#9BB6CC99] text-sm placeholder:text-[#9BB6CC99] focus:ring-0 border-0 h-9 font-['Geist']"
              />
            </div>
            <Button
              variant="ghost"
              onClick={onToggleMembers}
              className="p-0 rounded-full text-white hover:bg-white/10 transition-all flex-shrink-0 h-9 w-9"
              title={isMembersVisible ? "Hide members" : "Show members"}
            >
              <Users className={cn(
                "h-5 w-5 md:h-4 md:w-4 transition-colors",
                (isMembersVisible || mobileView === "members") ? "text-white" : "text-[#9BB6CC]"
              )} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-3">
        <div className="space-y-1">
          {messages.map((message, index) => {
            const showAvatar =
              index === 0 ||
              messages[index - 1]?.authorId !== message.authorId;
            const isGrouped =
              !showAvatar &&
              message.type !== "system" &&
              messages[index - 1]?.type !== "system";

            return (
              <ChatMessageComponent
                key={message.id}
                message={message}
                showAvatar={showAvatar}
                isGrouped={isGrouped}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[#FFFFFF14] rounded-[24px]">
        <ChatInput
          onSendMessage={onSendMessage}
          placeholder={`Message #${channel.name || "channel"}`}
        />
      </div>
    </div>
  );
}
