"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Shield,
  Wallet,
  Blocks,
  LockKeyhole,
  Copy,
  Trash2,
  Check,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

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
        "Hi, I'm VeraLux AI. Ask me about the VeraLux team, roadmap, Sui and other blockchains, tokenomics, as well as broader topics like economics, politics, culture, healthcare, education, and IT. I'll answer in Markdown.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when AI chat panel is open
  useBodyScrollLock(isOpen);

  const scrollToBottom = useCallback(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    );

    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const markdownComponents = React.useMemo(
    () => ({
      a: (props: any) => (
        <a
          {...props}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "underline decoration-[#8EE5FF] underline-offset-4 transition hover:text-white",
            props.className
          )}
        />
      ),
      code: ({ inline, className, children, ...props }: any) =>
        inline ? (
          <code
            className={cn(
              "rounded bg-white/10 px-1 py-0.5 text-[12px]",
              className
            )}
            {...props}
          >
            {children}
          </code>
        ) : (
          <pre
            className={cn(
              "rounded-xl bg-[#0D141D] p-3 text-sm text-[#D1E3FF] overflow-x-auto border border-white/5",
              className
            )}
            {...props}
          >
            <code>{children}</code>
          </pre>
        ),
      ul: ({ className, ...props }: any) => (
        <ul
          className={cn("list-disc pl-4 space-y-1", className)}
          {...props}
        />
      ),
      ol: ({ className, ...props }: any) => (
        <ol
          className={cn("list-decimal pl-4 space-y-1", className)}
          {...props}
        />
      ),
    }),
    []
  );

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (!isOpen) {
      // Opening animation - faster
      setIsOpen(true);
      // Progressive backdrop blur
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 0.2;
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
        progress -= 0.2;
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

  // Auto-scroll to bottom when new messages arrive
  React.useLayoutEffect(() => {
    const frame = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading, scrollToBottom]);

  React.useEffect(() => {
    return () => {
      abortController?.abort();
    };
  }, [abortController]);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hi, I'm VeraLux AI. Ask me about the VeraLux team, roadmap, Sui and other blockchains, tokenomics, as well as broader topics like economics, politics, culture, healthcare, education, and IT. I'll answer in Markdown.",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  const streamAIResponse = async (history: Message[]) => {
    const aiMessage: Message = {
      id: `${Date.now()}-ai`,
      content: "",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      const controller = new AbortController();
      setAbortController(controller);

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history.map(({ sender, content }) => ({
            sender,
            content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("AI response failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((message) =>
            message.id === aiMessage.id ? { ...message, content: result } : message
          )
        );
        scrollToBottom();
      }
    } catch (error) {
      console.error("[AI_CHAT]", error);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === aiMessage.id
            ? {
                ...message,
                content:
                  "I ran into a connection issue. Please try again in a moment.",
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
      setAbortController(null);
      scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInputValue("");
    setIsLoading(true);
    await streamAIResponse(nextHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "DeFi Basics", icon: Shield, action: () => setInputValue("What is DeFi?") },
    { label: "NFT Guide", icon: Blocks, action: () => setInputValue("How do NFTs work?") },
    { label: "Security", icon: LockKeyhole, action: () => setInputValue("Web3 security tips") },
    { label: "Blockchain", icon: Blocks, action: () => setInputValue("Explain blockchain technology") },
    { label: "Wallet", icon: Wallet, action: () => setInputValue("How do I set up a wallet?") },
    { label: "DAOs Explained", icon: Shield, action: () => setInputValue("How do DAOs work?") },
  ];

  return (
    <>
      {/* Desktop AI Tab Button */}
      <div
        className={cn(
          "desktop-ai-tab-container fixed bottom-6 right-6 z-50",
          "transition-all duration-300 ease-out transform-gpu",
          isOpen && "opacity-0 pointer-events-none",
          className
        )}
        data-open={isOpen}
        style={{
          transform: isOpen ? "translateX(-400px) scale(0.9)" : "translateX(0px) scale(1)",
          willChange: "transform, opacity",
          opacity: isOpen ? 0 : 1,
        }}
      >
        <Button
          onClick={handleToggle}
          disabled={isAnimating}
          className={cn(
            "desktop-ai-tab-button group relative cursor-pointer transform-gpu",
            "shadow-xl text-white/90",
            "flex items-center justify-center backdrop-blur-sm border border-white/10",
            "disabled:cursor-not-allowed",
            "h-14 w-14 rounded-full bg-gradient-to-br from-[#3B245A] via-[#5B2C74] to-[#161E2C]",
            "overflow-visible",
            !isAnimating && "transition-all duration-300 hover:scale-110 active:scale-95"
          )}
          style={{
            willChange: isAnimating ? "none" : "transform",
          }}
          aria-label="Open AI chat"
        >
          <div className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_65%)]" />
          <div className="relative z-10 flex items-center justify-center">
            <Image
              src="/Container.png"
              alt="YNX AI"
              width={24}
              height={24}
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 shadow-lg"
              style={{
                backgroundColor: "#22C55E",
                borderColor: "rgba(8, 14, 17, 0.8)",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6), 0 0 12px rgba(34, 197, 94, 0.4)",
                animation: "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.35)",
                  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            </div>
          </div>
        </Button>
      </div>

      {/* Desktop AI Chat Panel */}
      <div
        className={cn(
          "desktop-ai-chat-panel fixed bottom-6 right-6 z-40 flex flex-col",
          "w-96 h-[520px] rounded-2xl overflow-hidden",
          "bg-[#0A1118]/20 backdrop-blur-[14px] border border-white/10",
          "shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]",
          "transition-all duration-300 ease-out transform-gpu"
        )}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          opacity: isOpen ? 1 : 0,
          willChange: "transform, opacity",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10 bg-[#080E11]/10 backdrop-blur-[18px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9 ring-1 ring-white/15">
                  <AvatarImage src="/Container.png" alt="YNX AI" />
                  <AvatarFallback className="text-sm bg-[#FADEFD] text-[#080E11]">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A1118] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm text-white tracking-tight">YNX AI</h3>
                <p className="text-xs text-[#9BB6CC99]">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#9BB6CC99]">
              <button
                onClick={handleClearChat}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 className="h-3.5 w-3.5 text-white/70" />
              </button>
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition" title="Expand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                  <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <button
                onClick={handleClose}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
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
                    "group max-w-[82%] rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                    message.sender === "user"
                      ? "bg-[#FADEFD] text-black ml-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                      : "bg-[#9BB6CC0A] text-[#9BB6CC] mr-2 border border-white/10 shadow-[0_18px_40px_rgba(6,11,18,0.55)]"
                  )}
                >
                  <div
                    className={cn(
                      "prose prose-sm max-w-none break-words leading-relaxed prose-pre:my-3 prose-p:my-1 prose-li:my-0",
                      message.sender === "ai"
                        ? "prose-invert text-[#D1E3FF] prose-strong:text-white"
                        : "text-black prose-strong:text-black"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {message.content || (isLoading && message.sender === "ai" ? "..." : "")}
                    </ReactMarkdown>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p
                      className={cn(
                        "text-[11px] opacity-70 transition-opacity duration-200",
                        message.sender === "user" ? "text-black/60" : "text-[#9BB6CC]"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {message.sender === "ai" && (
                      <div className="flex items-center space-x-2 text-[#9BB6CC]">
                        <Image src="/Container.png" alt="YNX AI" width={14} height={14} className="opacity-80" />
                        <span className="text-[10px] uppercase tracking-wide">AI</span>
                        <button
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          className="h-4 w-4 flex items-center justify-center rounded hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                          title="Copy message"
                          aria-label="Copy message"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Action Buttons */}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="text-xs text-[#9BB6CC99] mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-[12px] border border-white/10 text-white/80 hover:bg-white/10 transition"
                    >
                      <action.icon className="h-3.5 w-3.5" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-[#080E11]/20 backdrop-blur-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex w-full items-center rounded-full  border border-white/10 px-3 py-2 gap-2">
              <div className="text-[#9BB6CC99] text-xs px-2 py-1 bg-white/5 rounded-full">AI</div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a message..."
                className="flex-1 h-10 border-0 bg-transparent text-sm text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:outline-none"
                disabled={isLoading}
              />
            <div className="flex items-center gap-2 text-[#9BB6CC99]">
                <span className="text-xs">BY</span>
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "h-6 w-6 rounded-full bg-white/5 border border-white/10",
                  "flex items-center justify-center transition hover:opacity-90 focus:outline-none",
                  (!inputValue.trim() || isLoading) && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/Container.png" alt="YNX AI" className="rounded-full" />
                  <AvatarFallback className="bg-white/10">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Blur Overlay - Desktop */}
      <div
        className={cn(
          "desktop-ai-overlay fixed inset-0 z-30 transition-all duration-300 ease-out",
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
