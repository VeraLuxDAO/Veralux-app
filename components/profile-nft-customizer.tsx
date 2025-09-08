import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export function ProfileNFTCustomizer() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">
            Profile NFT Customization
          </CardTitle>
          <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">
            Minted
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* NFT Preview */}
          <div className="space-y-4">
            <div className="aspect-square nft-preview-card rounded-lg p-6 flex items-center justify-center">
              <div className="text-center nft-preview-content">
                <div className="w-24 h-24 nft-avatar-preview rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-bold mb-2 nft-name">Alex Chen</h3>
                <p className="text-sm nft-title">Full-Stack Developer</p>
                <div className="flex justify-center space-x-2 mt-4">
                  <Badge className="nft-badge nft-badge-verified text-xs">
                    Verified
                  </Badge>
                  <Badge className="nft-badge nft-badge-pro text-xs">Pro</Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-electric-blue hover:bg-electric-blue/90 text-white">
                Update NFT
              </Button>
              <Button
                variant="outline"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
              >
                View on OpenSea
              </Button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="traits">Traits</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Background Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="aspect-square nft-bg-option nft-bg-option-primary rounded border-2 border-electric-blue"></button>
                    <button className="aspect-square nft-bg-option nft-bg-option-secondary rounded border border-border"></button>
                    <button className="aspect-square nft-bg-option nft-bg-option-tertiary rounded border border-border"></button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Border Style
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Border Width
                      </span>
                      <span className="text-sm font-medium text-card-foreground">
                        4px
                      </span>
                    </div>
                    <Slider
                      defaultValue={[4]}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="traits" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Developer
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Primary Skill
                      </p>
                    </div>
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        DeFi Expert
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Specialization
                      </p>
                    </div>
                    <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Community Leader
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Social Trait
                      </p>
                    </div>
                    <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">
                      Active
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">
                      Token ID
                    </label>
                    <p className="text-sm text-muted-foreground">#4,721</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">
                      Contract Address
                    </label>
                    <p className="text-sm text-muted-foreground font-mono">
                      0x1234...5678
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">
                      Minted Date
                    </label>
                    <p className="text-sm text-muted-foreground">
                      January 15, 2024
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">
                      Rarity Score
                    </label>
                    <p className="text-sm text-veralux-green font-semibold">
                      847 / 1000
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
