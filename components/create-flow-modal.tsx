"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function CreateFlowModal() {
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const availableTags = ["DeFi", "NFTs", "Gaming", "Trading", "Development", "DAO", "Layer2", "CrossChain"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">Create Flow</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Create New Flow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-card-foreground">Alex Chen</p>
              <p className="text-sm text-muted-foreground">@alexchen</p>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder="What's happening in Web3? Share your thoughts, insights, or discoveries..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-input border-border text-foreground resize-none"
          />

          {/* Tags */}
          <div>
            <p className="text-sm font-medium text-card-foreground mb-2">Add Tags</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag)
                      ? "bg-electric-blue text-white"
                      : "hover:bg-electric-blue/20 hover:text-electric-blue"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{content.length}/500</span>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-electric-blue">
                📷 Add Media
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-electric-blue">
                📊 Add Poll
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-muted-foreground">
                Cancel
              </Button>
              <Button
                className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                disabled={content.trim().length === 0}
              >
                Post Flow
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
