import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function TrustedSellers() {
  const trustedSellers = [
    {
      name: "DragonMaster",
      avatar: "/diverse-user-avatars.png",
      rating: 4.9,
      sales: "234",
      specialty: "Gaming Items",
      verified: true,
    },
    {
      name: "ArtistPro",
      avatar: "/diverse-female-avatar.png",
      rating: 4.8,
      sales: "156",
      specialty: "Digital Art",
      verified: true,
    },
    {
      name: "MusicProducer",
      avatar: "/developer-avatar.png",
      rating: 4.9,
      sales: "89",
      specialty: "Music NFTs",
      verified: true,
    },
    {
      name: "LandDeveloper",
      avatar: "/user-profile-illustration.png",
      rating: 4.7,
      sales: "67",
      specialty: "Virtual Land",
      verified: true,
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">Trusted Sellers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trustedSellers.map((seller, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                <AvatarFallback>{seller.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{seller.name}</p>
                  {seller.verified && (
                    <div className="w-3 h-3 bg-veralux-green rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{seller.specialty}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-veralux-yellow text-xs">⭐</span>
                    <span className="text-xs font-medium text-card-foreground">{seller.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{seller.sales} sales</span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent text-xs"
            >
              View Store
            </Button>
            {index < trustedSellers.length - 1 && <div className="border-b border-border"></div>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
