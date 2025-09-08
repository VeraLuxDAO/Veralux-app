import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ProfileSkills() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Technical Skills */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Technical Skills</CardTitle>
            <Button size="sm" variant="outline" className="text-electric-blue border-electric-blue bg-transparent">
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Solidity</span>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Expert</Badge>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">React/Next.js</span>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Expert</Badge>
            </div>
            <Progress value={90} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Web3.js/Ethers.js</span>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Advanced</Badge>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">TypeScript</span>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Advanced</Badge>
            </div>
            <Progress value={88} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Python</span>
              <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">Intermediate</Badge>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Web3 Expertise */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Web3 Expertise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">DeFi Protocols</span>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Expert</Badge>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">NFT Development</span>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Advanced</Badge>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">DAO Governance</span>
              <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Advanced</Badge>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Cross-chain</span>
              <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">Intermediate</Badge>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Layer 2 Solutions</span>
              <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30">Intermediate</Badge>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Certifications & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
              <span className="text-electric-blue text-sm">🏆</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Ethereum Developer Certification</p>
              <p className="text-xs text-muted-foreground">ConsenSys Academy • 2023</p>
            </div>
            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Verified</Badge>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
              <span className="text-veralux-yellow text-sm">🥇</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">DeFi Hackathon Winner</p>
              <p className="text-xs text-muted-foreground">ETHGlobal • 2024</p>
            </div>
            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Verified</Badge>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 bg-veralux-green/20 rounded-full flex items-center justify-center">
              <span className="text-veralux-green text-sm">⚡</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Smart Contract Auditor</p>
              <p className="text-xs text-muted-foreground">OpenZeppelin • 2023</p>
            </div>
            <Badge className="bg-veralux-green/20 text-veralux-green border-veralux-green/30">Verified</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Skill Endorsements */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Community Endorsements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
              <span className="text-electric-blue text-xs font-bold">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">John Doe endorsed Solidity</p>
              <p className="text-xs text-muted-foreground">"Alex's smart contracts are bulletproof"</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-veralux-green/20 rounded-full flex items-center justify-center">
              <span className="text-veralux-green text-xs font-bold">SM</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Sarah Miller endorsed DeFi Protocols</p>
              <p className="text-xs text-muted-foreground">"Deep understanding of yield farming"</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-veralux-yellow/20 rounded-full flex items-center justify-center">
              <span className="text-veralux-yellow text-xs font-bold">MK</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Mike Kim endorsed React/Next.js</p>
              <p className="text-xs text-muted-foreground">"Best frontend dev I've worked with"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
