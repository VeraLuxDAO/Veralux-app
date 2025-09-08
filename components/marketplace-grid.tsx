"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: string
  category: string
  seller: {
    name: string
    avatar: string
    verified: boolean
    rating: number
  }
  image: string
  rarity: string
  escrowProtected: boolean
  featured: boolean
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "Legendary Dragon Sword",
    description: "Rare weapon from CryptoQuest with +500 attack power and fire enchantment",
    price: "3.2 SUI",
    category: "Gaming",
    seller: {
      name: "DragonMaster",
      avatar: "/diverse-user-avatars.png",
      verified: true,
      rating: 4.9,
    },
    image: "/legendary-dragon-sword-with-fire-effects.jpg",
    rarity: "Legendary",
    escrowProtected: true,
    featured: true,
  },
  {
    id: "2",
    title: "Digital Art Masterpiece #47",
    description: "Stunning digital artwork by renowned crypto artist with certificate of authenticity",
    price: "2.8 SUI",
    category: "Art",
    seller: {
      name: "ArtistPro",
      avatar: "/diverse-female-avatar.png",
      verified: true,
      rating: 4.8,
    },
    image: "/abstract-digital-art-masterpiece-with-vibrant-colo.jpg",
    rarity: "Unique",
    escrowProtected: true,
    featured: true,
  },
  {
    id: "3",
    title: "Premium Gaming Avatar",
    description: "Customizable avatar with rare traits and exclusive accessories",
    price: "1.5 SUI",
    category: "Gaming",
    seller: {
      name: "AvatarCreator",
      avatar: "/developer-avatar.png",
      verified: true,
      rating: 4.7,
    },
    image: "/premium-gaming-avatar-with-rare-accessories.jpg",
    rarity: "Epic",
    escrowProtected: true,
    featured: false,
  },
  {
    id: "4",
    title: "Virtual Real Estate Plot",
    description: "Prime location in MetaCity with development rights and resource access",
    price: "5.0 SUI",
    category: "Virtual Land",
    seller: {
      name: "LandDeveloper",
      avatar: "/user-profile-illustration.png",
      verified: true,
      rating: 4.6,
    },
    image: "/virtual-real-estate-plot-in-futuristic-city.jpg",
    rarity: "Rare",
    escrowProtected: true,
    featured: false,
  },
  {
    id: "5",
    title: "Collectible Trading Card",
    description: "Limited edition card from the popular DeFi Warriors series",
    price: "0.8 SUI",
    category: "Collectibles",
    seller: {
      name: "CardCollector",
      avatar: "/diverse-user-avatars.png",
      verified: false,
      rating: 4.3,
    },
    image: "/collectible-trading-card-with-holographic-effects.jpg",
    rarity: "Uncommon",
    escrowProtected: true,
    featured: false,
  },
  {
    id: "6",
    title: "Music NFT Collection",
    description: "Exclusive music tracks with royalty sharing and backstage access",
    price: "2.2 SUI",
    category: "Music",
    seller: {
      name: "MusicProducer",
      avatar: "/diverse-female-avatar.png",
      verified: true,
      rating: 4.9,
    },
    image: "/music-nft-collection-with-sound-waves-and-vinyl-re.jpg",
    rarity: "Limited",
    escrowProtected: true,
    featured: false,
  },
]

export function MarketplaceGrid() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-muted text-muted-foreground"
      case "Uncommon":
        return "bg-veralux-green/20 text-veralux-green border-veralux-green/30"
      case "Rare":
        return "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
      case "Epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Legendary":
        return "bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30"
      case "Unique":
        return "bg-gradient-to-r from-veralux-yellow to-veralux-green text-white"
      case "Limited":
        return "bg-electric-blue/20 text-electric-blue border-electric-blue/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Featured Items */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Featured Items</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {marketplaceItems
            .filter((item) => item.featured)
            .map((item) => (
              <Card key={item.id} className="bg-card border-border hover:border-veralux-green/50 transition-colors">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-veralux-green/20 to-electric-blue/20 rounded-t-lg flex items-center justify-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                          {item.escrowProtected && (
                            <div className="w-4 h-4 bg-veralux-green rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">🛡️</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-veralux-green">{item.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={item.seller.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{item.seller.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-card-foreground">{item.seller.name}</span>
                          {item.seller.verified && (
                            <div className="w-3 h-3 bg-veralux-green rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-veralux-yellow text-sm">⭐</span>
                          <span className="text-xs text-muted-foreground">{item.seller.rating}</span>
                        </div>
                      </div>
                      <Button className="bg-veralux-green hover:bg-veralux-green/90 text-white">Buy Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* All Items */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">All Items</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaceItems.map((item) => (
            <Card key={item.id} className="bg-card border-border hover:border-electric-blue/50 transition-colors">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-electric-blue/20 to-veralux-green/20 rounded-t-lg flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <h3 className="text-base font-semibold text-card-foreground truncate">{item.title}</h3>
                        {item.escrowProtected && (
                          <div className="w-3 h-3 bg-veralux-green rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🛡️</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-veralux-green">{item.price}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={item.seller.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{item.seller.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-medium text-card-foreground">{item.seller.name}</span>
                        {item.seller.verified && <div className="w-2 h-2 bg-veralux-green rounded-full"></div>}
                      </div>
                    </div>
                    <Button size="sm" className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                      Buy
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
