import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function GameFilters() {
  const genres = ["RPG", "Strategy", "Racing", "Card Game", "Simulation", "Action"]
  const statuses = ["Live", "Beta", "Coming Soon"]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground text-sm">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Genre Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">Genre</h4>
          <div className="space-y-2">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox id={genre} />
                <label htmlFor={genre} className="text-sm text-muted-foreground cursor-pointer">
                  {genre}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">Status</h4>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox id={status} />
                <label htmlFor={status} className="text-sm text-muted-foreground cursor-pointer">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">Min. Earnings</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="1eth" />
              <label htmlFor="1eth" className="text-sm text-muted-foreground cursor-pointer">
                1+ ETH
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="2eth" />
              <label htmlFor="2eth" className="text-sm text-muted-foreground cursor-pointer">
                2+ ETH
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="5eth" />
              <label htmlFor="5eth" className="text-sm text-muted-foreground cursor-pointer">
                5+ ETH
              </label>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-veralux-yellow text-veralux-yellow hover:bg-veralux-yellow hover:text-black bg-transparent"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
