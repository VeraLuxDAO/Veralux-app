"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { Bot, Send, Loader2, Smile, Mic, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MobileAITabProps {
  className?: string;
}

export function MobileAITab({ className }: MobileAITabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm VeraLux AI Assistant. I can help you with Web3 questions, DeFi strategies, NFT guidance, blockchain development, and more. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Prevent animation on initial mount - delay to ensure no flash
  useEffect(() => {
    // Use a longer delay to ensure the component is fully rendered and styled before enabling transitions
    // Only set mounted after a delay to prevent any flash on page load
    // Increased delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand your question about Web3. Let me help you with that! This is a simulated AI response. In a real implementation, this would connect to your AI service.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
  };

  const quickActions = [
    { label: "💰 DeFi Basics", action: () => setInputValue("What is DeFi?") },
    { label: "🎨 NFT Guide", action: () => setInputValue("How do NFTs work?") },
    {
      label: "⛓️ Blockchain",
      action: () => setInputValue("Explain blockchain technology"),
    },
    { label: "🛡️ Security", action: () => setInputValue("Web3 security tips") },
  ];

  return (
    <>
      {/* AI Tab Button with Transform Animation */}
      <div
        className={cn(
          "ai-tab-container fixed right-4 z-50 md:hidden",
          "transition-all duration-300 ease-out transform-gpu",
          isOpen && "opacity-0 pointer-events-none",
          className
        )}
        data-open={isOpen}
        style={{
          top: "50%",
          transform: isOpen ? "translateY(-50%) scale(0.8)" : "translateY(-50%) scale(1)",
          willChange: "transform, opacity",
          opacity: isOpen ? 0 : 1,
        }}
      >
        <Button
          onClick={handleToggle}
          className={cn(
            "ai-tab-button group relative cursor-pointer transform-gpu",
            "text-[#080E11] shadow-xl",
            "flex items-center justify-center backdrop-blur-sm",
            "h-12 w-12 rounded-2xl bg-[#FADEFD]",
            "overflow-visible",
            "transition-all duration-300 hover:scale-110 active:scale-95"
          )}
        >
          {/* Glowing background effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle at center, rgba(229, 247, 253, 0.2) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          
          {/* Main content */}
          <div className="relative z-10 flex items-center justify-center">
            <Bot 
              className="h-3 w-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 text-[#080E11]" 
            />
            
            {/* Status indicator with pulsing animation */}
            <div 
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 shadow-lg"
              style={{
                backgroundColor: "#22C55E",
                borderColor: "rgba(8, 14, 17, 0.8)",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6), 0 0 12px rgba(34, 197, 94, 0.4)",
                animation: "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            >
              {/* Inner pulse ring */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.4)",
                  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            </div>
          </div>
        </Button>
      </div>

      {/* AI Chat Modal - Centered on Mobile - Only render when mounted AND user opens it */}
      {isMounted && isOpen && (
        <div
          className={cn(
            "ai-chat-panel fixed z-[120] md:hidden flex flex-col",
            "bg-[#080E1199] backdrop-blur-md border border-white/10 rounded-2xl",
            "shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          )}
          style={{
            top: "50%",
            left: "50%",
            width: "98vw",
            maxWidth: "700px",
            transform: "translate(-50%, -50%)",
            maxHeight: "95vh",
            height: "auto",
          }}
        >
        {/* Header - With Close Button */}
        <div className="flex-shrink-0 p-3 border-b border-white/5 bg-[#080E1199] backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-1 ring-border/30">
                  <AvatarFallback className="bg-[#FADEFD] text-[#080E11]">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-veralux-green rounded-full border-2 border-[#080E11]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-base text-white">
                  VeraLux AI
                </h3>
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs text-[#9BB6CC99]">Online</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 p-5 overflow-y-auto"
          style={{
            maxHeight: "calc(92vh - 250px)",
          }}
        >
          <div className="space-y-2.5">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className={cn(
                    "group max-w-[82%] rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                    message.sender === "user"
                      ? "bg-[#FADEFD] text-[#080E11] ml-2 shadow-sm"
                      : "bg-[#9BB6CC0A] text-[#9BB6CC] mr-2 border border-border/20"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p
                      className={cn(
                        "text-[12px] opacity-60 transition-opacity duration-200",
                        message.sender === "user"
                          ? "text-[#080E11]"
                          : "text-[#9BB6CC99]"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {message.sender === "ai" && (
                      <div className="flex items-center space-x-1 opacity-50">
                        <Bot className="h-2.5 w-2.5" />
                        <span className="text-[10px]">AI</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start w-full animate-fade-in-up">
                <div className="bg-muted/60 text-foreground max-w-[82%] rounded-xl px-3 py-2.5 mr-2 border border-border/20">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/80 flex items-center justify-center">
                      <Bot className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">AI is typing...</span>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce animation-delay-100" />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce animation-delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            {messages.length === 1 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="h-8 text-xs rounded-lg border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 text-muted-foreground hover:text-foreground"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input - Matching Sample Design */}
        <div 
          className="flex-shrink-0 px-6 pt-3 pb-6 border-t border-white/5 rounded-b-2xl"
          style={{
            background: "rgba(8, 14, 17, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center">
            <div className="flex w-full items-center rounded-full bg-[#E5F7FD0A] border border-white/10 px-3 gap-2">
              {/* Emoji Picker */}
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                trigger={
                  <div
                    className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 cursor-pointer"
                    title="Emoji"
                  >
                    <Smile className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
                  </div>
                }
              />

              {/* Input Field */}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Send Message"
                disabled={isLoading}
                className="flex-1 h-6 bg-[#E5F7FD0A] border-none text-[#9BB6CC99] text-[14px] placeholder:text-[#9BB6CC99] focus:ring-0 focus-visible:ring-0 px-2 py-0 shadow-none"
                autoComplete="off"
                style={{ fontFamily: "'Geist'", fontSize: "14px !important" }}
              />

              {/* Right icon group: Mic, Paperclip, Send */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Mic */}
                <div
                  className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 flex items-center justify-center cursor-pointer"
                  title="Voice message"
                  style={{ maxWidth: "16px !important", maxHeight: "16px !important" }}
                  onClick={() => {
                    // Handle microphone click
                  }}
                >
                  <Mic className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
                </div>

                {/* Paperclip */}
                <div
                  className="h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 text-[#9BB6CC99] flex-shrink-0 flex items-center justify-center cursor-pointer"
                  title="Attach file"
                  onClick={() => {
                    // Handle attachment click
                  }}
                >
                  <Paperclip className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3" />
                </div>

                {/* Send */}
                <div
                  onClick={handleSendMessage}
                  className={cn(
                    "h-4 w-4 max-[512px]:h-4 max-[512px]:w-4 p-0 rounded-full bg-transparent hover:bg-white/10 flex-shrink-0 flex items-center justify-center cursor-pointer",
                    (!inputValue.trim() || isLoading) && "opacity-60 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3 text-[#9BB6CC99] animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 max-[430px]:h-3.5 max-[430px]:w-3.5 max-[360px]:h-3 max-[360px]:w-3 text-[#9BB6CC99]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Overlay - Behind Modal - Only render when mounted AND modal is open */}
      {isMounted && isOpen && (
        <div
          className={cn(
            "ai-overlay fixed inset-0 z-[115] md:hidden",
            "bg-black/60 backdrop-blur-sm pointer-events-auto"
          )}
          onClick={handleClose}
        />
      )}
    </>
  );
}
