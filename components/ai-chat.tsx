"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatProps {
  className?: string;
}

export function AIChat({ className = "" }: AIChatProps) {
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
      // Progressive backdrop blur
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 0.1;
        setBackdropProgress(progress);
        if (progress >= 1) {
          clearInterval(intervalId);
          setIsAnimating(false);
        }
      }, 50);
    } else {
      // Closing animation
      let progress = 1;
      const intervalId = setInterval(() => {
        progress -= 0.1;
        setBackdropProgress(progress);
        if (progress <= 0) {
          clearInterval(intervalId);
          setIsOpen(false);
          setIsAnimating(false);
        }
      }, 30);
    }
  };

  const handleClose = () => {
    if (isAnimating) return;
    handleToggle();
  };

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
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
      {/* Desktop AI Tab Button with Transform Animation */}
      <div
        className={cn(
          "desktop-ai-tab-container fixed bottom-6 right-6 z-50",
          "transition-all duration-700 ease-out transform-gpu",
          className
        )}
        data-open={isOpen}
        style={{
          transform: isOpen ? "translateX(-400px)" : "translateX(0px)",
          willChange: "transform",
        }}
      >
        <Button
          onClick={handleToggle}
          disabled={isAnimating}
          className={cn(
            "desktop-ai-tab-button cursor-pointer transform-gpu",
            "bg-gradient-to-bl from-electric-blue via-primary to-electric-blue/80",
            "hover:from-electric-blue/90 hover:via-primary/90 hover:to-electric-blue/70",
            "text-primary-foreground shadow-lg border border-primary/20",
            "flex items-center justify-center backdrop-blur-sm",
            "disabled:cursor-not-allowed hover:shadow-xl",
            "h-16 w-16 rounded-full",
            // Conditional hover effects - disable during animation
            !isAnimating &&
              "transition-all duration-300 hover:scale-105 active:scale-95"
          )}
          style={{
            willChange: isAnimating ? "none" : "transform",
          }}
        >
          <div className="relative">
            <Bot className="h-6 w-6 transition-transform duration-200" />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-veralux-green rounded-full border-2 border-card" />
          </div>
        </Button>
      </div>

      {/* Desktop AI Chat Slide-out Panel - Direct Chat Interface */}
      <div
        className={cn(
          "desktop-ai-chat-panel fixed bottom-6 right-6 z-40 flex flex-col",
          "w-96 h-[600px] rounded-xl",
          "bg-card/98 backdrop-blur-md border border-border/30",
          "shadow-[0_0_40px_rgba(0,0,0,0.3)]",
          "transition-all duration-700 ease-out transform-gpu"
        )}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          opacity: isOpen ? 1 : 0,
          willChange: "transform, opacity",
        }}
      >
        {/* Header - Subtle Design */}
        <div className="flex-shrink-0 p-3 border-b border-border/20 bg-card/50 backdrop-blur-sm rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-1 ring-border/30">
                <AvatarFallback className="bg-gradient-to-br from-primary/80 via-primary to-primary/90 text-primary-foreground text-sm">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-veralux-green rounded-full border border-card" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm text-foreground">
                VeraLux AI
              </h3>
              <div className="flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 bg-veralux-green rounded-full" />
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 overflow-y-auto">
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
                      ? "bg-primary/95 text-primary-foreground ml-2 shadow-sm"
                      : "bg-muted/60 text-foreground mr-2 border border-border/20"
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
              <div className="flex justify-start w-full">
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

        {/* Input */}
        <div className="flex-shrink-0 p-3 border-t border-border/20 bg-card/50 backdrop-blur-sm rounded-b-xl">
          <div className="flex items-center space-x-2 p-2 bg-background/60 rounded-xl border border-border/20">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Web3..."
              className="flex-1 h-8 border-0 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:ring-0 focus:outline-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className={cn(
                "h-8 w-8 rounded-lg p-0 transition-all duration-200",
                !inputValue.trim() || isLoading
                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary cursor-pointer"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center mt-2 px-1">
            <p className="text-xs text-muted-foreground">
              Powered by VeraLux AI
            </p>
          </div>
        </div>
      </div>

      {/* Progressive Blur Overlay - Desktop */}
      <div
        className={cn(
          "desktop-ai-overlay fixed inset-0 z-30 transition-all duration-700 ease-out",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          background: `rgba(0, 0, 0, ${0.2 * backdropProgress})`,
          backdropFilter: `blur(${4 * backdropProgress}px)`,
          opacity: backdropProgress,
        }}
        onClick={handleClose}
      />
    </>
  );
}
