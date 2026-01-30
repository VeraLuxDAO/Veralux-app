"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  Bot,
  Send,
  Loader2,
  Smile,
  Mic,
  Paperclip,
  X,
  Shield,
  Wallet,
  Blocks,
  LockKeyhole,
  Copy,
  Trash2,
  Check,
  Feather,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        "Hi, I'm VeraLux AI. I can answer questions about the VeraLux team and roadmap, Sui and other blockchains, tokenomics, and broader topics like economics, politics, culture, healthcare, education, and IT. I respond in Markdown.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const root = scrollAreaRef.current;
    const viewport =
      root?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]') ?? root;

    const runScroll = () => {
      if (bottomAnchorRef.current) {
        bottomAnchorRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
        return;
      }
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Try immediately, then after layout settles to catch new markdown height
    runScroll();
    const t1 = setTimeout(runScroll, 60);
    const t2 = setTimeout(runScroll, 180);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const markdownComponents = useMemo(
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const cancel = scrollToBottom();
      if (typeof cancel === "function") cancel();
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
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
          "Hi, I'm VeraLux AI. I can answer questions about the VeraLux team and roadmap, Sui and other blockchains, tokenomics, and broader topics like economics, politics, culture, healthcare, education, and IT. I respond in Markdown.",
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
      console.error("[MOBILE_AI_CHAT]", error);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === aiMessage.id
            ? {
                ...message,
                content:
                  "I hit a network issue. Please try again in a moment.",
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
    { label: "DAOs", icon: Shield, action: () => setInputValue("How do DAOs work?") },
  ];

  return (
    <>
      {/* Floating Button */}
      <div
        className={cn(
          "ai-tab-container fixed right-4 z-50 md:hidden",
          "transition-all duration-300 ease-out transform-gpu",
          isOpen && "opacity-0 pointer-events-none",
          className
        )}
        data-open={isOpen}
        style={{
          // Bottom bar is bottom-4 (16px) + h-[88px], so top of bar = 104px. Place button 16px above that.
          bottom: "120px",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
          willChange: "transform, opacity",
          opacity: isOpen ? 0 : 1,
        }}
      >
        <Button
          onClick={handleToggle}
          className={cn(
            "ai-tab-button flex h-12 w-12 items-center justify-center rounded-full",
            "transition-all duration-300 hover:opacity-90 active:scale-95"
          )}
          style={{ backgroundColor: "#E8D5E7" }}
          aria-label="Open AI chat"
        >
          <Feather className="h-6 w-6 text-black" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Mobile Chat */}
      {isMounted && isOpen && (
        <div
          className={cn(
            "fixed z-[120] md:hidden flex flex-col",
            "bg-[#0A1118]/50 backdrop-blur-xl border border-white/10 rounded-2xl",
            "shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
          )}
          style={{
            top: "50%",
            left: "50%",
            width: "94vw",
            maxWidth: "700px",
            height:"500px",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-3 border-b border-white/10 bg-[#080E11]/10 backdrop-blur-sm rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9 ring-1 ring-white/15">
                    <AvatarImage src="/Container.png" alt="YNX AI" />
                    <AvatarFallback className="bg-[#FADEFD] text-[#080E11]">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-[#0A1118]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-base text-white">YNX AI</h3>
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs text-[#9BB6CC99]">AI Assistant</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-white"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-white"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 min-h-0 p-5 overflow-y-auto"
          >
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
                          message.sender === "user"
                            ? "text-black/60"
                            : "text-[#9BB6CC]"
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
                            className="h-4 w-4 flex items-center justify-center rounded hover:bg-white/10 transition"
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

              {messages.length === 1 && (
                <div className="mt-3">
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
            <div ref={bottomAnchorRef} />
          </ScrollArea>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-[#080E11]/20 backdrop-blur-[18px]">
            <div className="flex items-center gap-3">
              <div className="flex w-full items-center rounded-full border border-white/10 px-3 py-2 gap-2">
                <div className="text-[#9BB6CC99] text-xs px-2 py-1 bg-white/5 rounded-full">AI</div>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  disabled={isLoading}
                  className="flex-1 h-10 border-0 bg-transparent text-sm text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:outline-none"
                  autoComplete="off"
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
      )}

      {/* Overlay */}
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
