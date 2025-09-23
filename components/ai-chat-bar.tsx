"use client";

import * as React from "react";
import { Send, Bot, User, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientOnly } from "@/components/client-only";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatBarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function AIChatBarContent({ isOpen, onClose, className = "" }: AIChatBarProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm VeraLux AI Assistant. I can help you with Web3 questions, DeFi strategies, NFT guidance, blockchain development, and more. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      className={`ai-chat-bar fixed bottom-20 right-2 sm:bottom-32 sm:right-6 z-40 w-[calc(100vw-1rem)] sm:w-96 max-w-sm sm:max-w-none max-h-[70vh] sm:max-h-[700px] h-auto rounded-xl shadow-2xl border transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="ai-chat-header flex items-center justify-between p-3 sm:p-4 border-b rounded-t-xl">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              VeraLux AI
            </h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4 transition-transform duration-200" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea
        className="flex-1 p-2 sm:p-4 max-h-[400px] sm:max-h-[500px] overflow-y-scroll"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-foreground mr-auto"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.sender === "ai" && (
                    <Avatar className="h-7 w-7 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-7 w-7 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
                        <User className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-2xl p-4 max-w-[85%] mr-auto">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      <Bot className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-start mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What is DeFi?")}
                className="ai-quick-action text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md"
              >
                💰 DeFi Basics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How do NFTs work?")}
                className="ai-quick-action text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md"
              >
                🎨 NFT Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("Explain blockchain technology")}
                className="ai-quick-action text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md"
              >
                ⛓️ Blockchain
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("Web3 security tips")}
                className="ai-quick-action text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md"
              >
                🛡️ Security
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="ai-chat-input p-3 sm:p-4 border-t rounded-b-xl">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Web3..."
            className="flex-1 h-8 sm:h-10 rounded-full border-border bg-background text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <p className="text-xs text-muted-foreground">Powered by VeraLux AI</p>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Smart Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIChatBar(props: AIChatBarProps) {
  return (
    <ClientOnly fallback={null}>
      <AIChatBarContent {...props} />
    </ClientOnly>
  );
}
