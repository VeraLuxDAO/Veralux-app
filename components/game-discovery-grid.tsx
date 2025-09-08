"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Game {
  id: string
  title: string
  description: string
  genre: string
  players: string
  rating: number
  earnings: string
  status: "Live" | "Beta" | "Coming Soon"
  image: string
  featured: boolean
}

const games: Game[] = [
  {
    id: "1",
    title: "CryptoQuest",
    description: "Epic fantasy RPG with NFT characters and blockchain-based item trading",
    genre: "RPG",
    players: "12.4K",
    rating: 4.8,
    earnings: "2.3 SUI avg",
    status: "Live",
    image: "/fantasy-rpg-game-with-dragons-and-medieval-charact.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "DeFi Warriors",
    description: "Strategic battle game where you fight with DeFi protocols as weapons",
    genre: "Strategy",
    players: "8.7K",
    rating: 4.6,
    earnings: "1.8 SUI avg",
    status: "Live",
    image: "/strategy-battle-game-with-futuristic-warriors.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "NFT Racing League",
    description: "High-speed racing with customizable NFT cars and track ownership",
    genre: "Racing",
    players: "6.2K",
    rating: 4.5,
    earnings: "1.2 SUI avg",
    status: "Live",
    image: "/high-speed-racing-cars-on-futuristic-track.jpg",
    featured: false,
  },
  {
    id: "4",
    title: "Metaverse Builder",
    description: "Create and monetize virtual worlds with integrated marketplace",
    genre: "Simulation",
    players: "4.8K",
    rating: 4.7,
    earnings: "3.1 SUI avg",
    status: "Beta",
    image: "/virtual-world-building-interface-with-3d-structure.jpg",
    featured: false,
  },
  {
    id: "5",
    title: "Blockchain Poker",
    description: "Provably fair poker with cryptocurrency stakes and NFT avatars",
    genre: "Card Game",
    players: "15.6K",
    rating: 4.4,
    earnings: "0.8 SUI avg",
    status: "Live",
    image: "/poker-table.png",
    featured: false,
  },
  {
    id: "6",
    title: "Space Miners",
    description: "Mine asteroids, trade resources, and build your space empire",
    genre: "Strategy",
    players: "3.9K",
    rating: 4.9,
    earnings: "Coming Soon",
    status: "Coming Soon",
    image: "/space-mining-operation-with-asteroids-and-spaceshi.jpg",
    featured: false,
  },
]

export function GameDiscoveryGrid() {
  return (
    <div className="space-y-6">
      {/* Featured Games */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Featured Games</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {games
            .filter((game) => game.featured)
            .map((game) => (
              <Card key={game.id} className="bg-card border-border hover:border-veralux-yellow/50 transition-colors">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-veralux-yellow/20 to-veralux-green/20 rounded-t-lg flex items-center justify-center">
                    <img
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-1">{game.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {game.genre}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              game.status === "Live"
                                ? "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
                                : game.status === "Beta"
                                  ? "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
                                  : "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
                            }`}
                          >
                            {game.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-veralux-yellow">⭐</span>
                          <span className="text-sm font-semibold text-card-foreground">{game.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{game.players} players</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Earnings</p>
                        <p className="text-sm font-semibold text-veralux-green">{game.earnings}</p>
                      </div>
                      <Button className="bg-veralux-yellow hover:bg-veralux-yellow/90 text-black">Play Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* All Games */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">All Games</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="bg-card border-border hover:border-electric-blue/50 transition-colors">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-electric-blue/20 to-veralux-green/20 rounded-t-lg flex items-center justify-center">
                  <img
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-card-foreground">{game.title}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-veralux-yellow text-sm">⭐</span>
                      <span className="text-xs font-semibold text-card-foreground">{game.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {game.genre}
                    </Badge>
                    <Badge
                      className={`text-xs ${
                        game.status === "Live"
                          ? "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
                          : game.status === "Beta"
                            ? "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
                            : "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
                      }`}
                    >
                      {game.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{game.players} players</p>
                      <p className="text-xs font-semibold text-veralux-green">{game.earnings}</p>
                    </div>
                    <Button
                      size="sm"
                      className={
                        game.status === "Coming Soon"
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-electric-blue hover:bg-electric-blue/90 text-white"
                      }
                      disabled={game.status === "Coming Soon"}
                    >
                      {game.status === "Coming Soon" ? "Soon" : "Play"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
