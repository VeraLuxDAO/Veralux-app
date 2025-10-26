import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export function MarketplaceFilters() {
  const categories = [
    "Gaming",
    "Art",
    "Music",
    "Virtual Land",
    "Collectibles",
    "Utility",
  ];
  const rarities = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Unique",
  ];

  return (
    <Card
      className="border-none"
      style={{
        background:
          "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">
            Category
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <label
                  htmlFor={category}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">
            Price Range (ETH)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">0 ETH</span>
              <span className="text-xs text-muted-foreground">10+ ETH</span>
            </div>
            <Slider
              defaultValue={[0, 10]}
              max={10}
              step={0.1}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-card-foreground">
                0.0 ETH
              </span>
              <span className="text-xs font-medium text-card-foreground">
                10.0 ETH
              </span>
            </div>
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">
            Rarity
          </h4>
          <div className="space-y-2">
            {rarities.map((rarity) => (
              <div key={rarity} className="flex items-center space-x-2">
                <Checkbox id={rarity} />
                <label
                  htmlFor={rarity}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {rarity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Verification */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">
            Seller
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <label
                htmlFor="verified"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Verified Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="escrow" />
              <label
                htmlFor="escrow"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Escrow Protected
              </label>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-veralux-green text-veralux-green hover:bg-veralux-green hover:text-white bg-transparent"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
