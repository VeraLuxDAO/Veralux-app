import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-card-foreground text-sm sm:text-base">
          Trusted Sellers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {trustedSellers.map((seller, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                <AvatarFallback>{seller.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <p className="text-xs sm:text-sm font-medium text-card-foreground truncate">
                    {seller.name}
                  </p>
                  {seller.verified && (
                    <div className="w-3 h-3 bg-veralux-green rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  {seller.specialty}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-veralux-yellow text-xs">⭐</span>
                    <span className="text-xs font-medium text-card-foreground">
                      {seller.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    •
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {seller.sales} sales
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent text-xs px-2 py-1 h-6 sm:h-7 flex-shrink-0 ml-2"
            >
              View Store
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
