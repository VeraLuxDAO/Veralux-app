"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Send, Sparkles, Zap, TrendingUp, Users } from "lucide-react";
import { AI_RESPONSES, QUICK_ACTIONS } from "@/lib/constants";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface LuxieAIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LuxieAI({ isOpen, onClose }: LuxieAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hey there! I'm Luxie, your VeraLux AI assistant. I can help you navigate the platform, analyze your reputation, suggest connections, or answer questions about Web3. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = useMemo(
    () =>
      QUICK_ACTIONS.map((action) => ({
        ...action,
        icon:
          action.icon === "TrendingUp"
            ? TrendingUp
            : action.icon === "Users"
            ? Users
            : action.icon === "Zap"
            ? Zap
            : Sparkles,
      })),
    []
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = useCallback((input: string): string => {
    const responses = AI_RESPONSES;
    return (
      responses[Math.floor(Math.random() * responses.length)] ||
      "I'm here to help! What would you like to know about VeraLux?"
    );
  }, []);

  const handleQuickAction = useCallback(
    (action: string) => {
      setInputValue(action);
      handleSendMessage();
    },
    [handleSendMessage]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-2 sm:p-4">
      <Card className="w-full max-w-2xl h-[80vh] sm:h-[600px] bg-card border-border flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-electric-blue to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-base sm:text-lg">🤖</span>
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg text-card-foreground">
                KYNO AI
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your VeraLux Assistant
              </p>
            </div>
            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30 text-xs">
              Online
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages */}
          <ScrollArea
            className="flex-1 p-3 sm:p-4 overflow-hidden"
            ref={scrollAreaRef}
          >
            <div className="space-y-3 sm:space-y-4 h-full ">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-electric-blue text-white"
                        : "bg-muted text-card-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-card-foreground rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-electric-blue rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-electric-blue rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-3 sm:p-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 sm:mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8 bg-transparent"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className={`h-3 w-3 mr-2 ${action.color}`} />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Luxie anything about VeraLux..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-electric-blue hover:bg-electric-blue/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
