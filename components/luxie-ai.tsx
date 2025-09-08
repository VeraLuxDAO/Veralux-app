"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Send, Sparkles, Zap, TrendingUp, Users } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface LuxieAIProps {
  isOpen: boolean
  onClose: () => void
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
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { icon: TrendingUp, label: "Analyze my reputation", color: "text-veralux-green" },
    { icon: Users, label: "Find connections", color: "text-electric-blue" },
    { icon: Zap, label: "Optimize my profile", color: "text-veralux-yellow" },
    { icon: Sparkles, label: "Trending topics", color: "text-purple-400" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Based on your activity, I'd recommend engaging more with the DeFi Builders community. Your reputation score could increase by 15% with consistent participation!",
      "I found 3 users with similar interests in Web3 development. Would you like me to suggest some connection opportunities?",
      "Your profile is looking great! Consider adding more skills to your NFT identity - it could boost your visibility in the Gaming Hub by 25%.",
      "Here are the trending topics in your communities: DeFi protocols, NFT gaming, and DAO governance. Perfect time to share your insights!",
      "I can help you optimize your staking strategy. Your current setup could earn 12% more rewards with some adjustments.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    handleSendMessage()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-card border-border flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">Luxie AI</CardTitle>
              <p className="text-sm text-muted-foreground">Your VeraLux Assistant</p>
            </div>
            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Online</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-electric-blue text-white" : "bg-muted text-card-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2 mb-4">
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
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm" className="bg-electric-blue hover:bg-electric-blue/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
