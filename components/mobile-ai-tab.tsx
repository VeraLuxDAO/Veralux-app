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
  const [isAnimating, setIsAnimating] = useState(false);
  const [backdropProgress, setBackdropProgress] = useState(0);
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

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (!isOpen) {
      // Opening animation
      setIsOpen(true);
      // Progressive backdrop blur - faster
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 0.15;
        setBackdropProgress(progress);
        if (progress >= 1) {
          clearInterval(intervalId);
          setIsAnimating(false);
        }
      }, 20);
    } else {
      // Closing animation - faster
      let progress = 1;
      const intervalId = setInterval(() => {
        progress -= 0.15;
        setBackdropProgress(progress);
        if (progress <= 0) {
          clearInterval(intervalId);
          setIsOpen(false);
          setIsAnimating(false);
        }
      }, 15);
    }
  };

  const handleClose = () => {
    if (isAnimating) return;
    handleToggle();
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
          "ai-tab-container fixed right-0 top-1/2 transform -translate-y-1/2 z-50 md:hidden",
          "transition-all duration-300 ease-out",
          isOpen && "opacity-0 pointer-events-none",
          className
        )}
        data-open={isOpen}
        style={{
          transform: `translateY(-50%) ${
            isOpen ? "translateX(-75vw) scale(0.8)" : "translateX(0px) scale(1)"
          }`,
          opacity: isOpen ? 0 : 1,
        }}
      >
        <Button
          onClick={handleToggle}
          disabled={isAnimating}
          className={cn(
            "ai-tab-button group relative cursor-pointer transition-all duration-300 ease-out transform-gpu",
            "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600",
            "hover:from-blue-400 hover:via-purple-500 hover:to-indigo-500",
            "text-white shadow-lg border-2 border-white/20",
            "flex items-center justify-center backdrop-blur-sm",
            "hover:scale-110 active:scale-95 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-purple-500/30",
            "h-16 w-8 rounded-l-3xl rounded-r-none",
            "before:absolute before:inset-0 before:rounded-l-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          )}
        >
          <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
            <Bot className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 text-white drop-shadow-sm" />
            <span className="text-[9px] font-bold transition-all duration-200 leading-none text-white drop-shadow-sm">
              AI
            </span>
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-sm" />
          </div>
        </Button>
      </div>

      {/* AI Chat Modal - Centered on Mobile */}
      <div
        className={cn(
          "ai-chat-panel fixed z-[120] md:hidden flex flex-col",
          "bg-[#080E1199] backdrop-blur-md border border-white/10 rounded-2xl",
          "shadow-[0_0_40px_rgba(0,0,0,0.5)]",
          "transition-all duration-300 ease-out transform-gpu",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{
          top: "50%",
          left: "50%",
          width: "98vw",
          maxWidth: "700px",
          transform: isOpen 
            ? "translate(-50%, -50%)" 
            : "translate(-50%, -50%) scale(0.95)",
          maxHeight: "95vh",
          height: "auto",
          willChange: "transform, opacity",
        }}
      >
        {/* Header - With Close Button */}
        <div className="flex-shrink-0 p-4 border-b border-white/5 bg-[#080E1199] backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-1 ring-border/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 via-primary to-primary/90 text-primary-foreground">
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
                  <div className="h-1.5 w-1.5 bg-veralux-green rounded-full" />
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
                        "text-xs opacity-60 transition-opacity duration-200",
                        message.sender === "user"
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
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

      {/* Overlay - Behind Modal */}
      <div
        className={cn(
          "ai-overlay fixed inset-0 z-[115] md:hidden transition-all duration-300 ease-out",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          background: `rgba(0, 0, 0, ${0.6 * backdropProgress})`,
          backdropFilter: `blur(${8 * backdropProgress}px)`,
          opacity: backdropProgress,
        }}
        onClick={handleClose}
      />
    </>
  );
}
