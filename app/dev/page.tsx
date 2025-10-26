"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NavigationLayout } from "@/components/navigation-layout";
import {
  Code2,
  Play,
  Save,
  Download,
  Upload,
  Rocket,
  BookOpen,
  Terminal,
  Layers,
  Zap,
  Globe,
  Settings,
  Search,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function DevHubPage() {
  const [activeProject, setActiveProject] = useState("nft-marketplace");
  const [code, setCode] = useState(`// VeraLux SDK Example - NFT Marketplace
import { VeraLux, NFTContract } from '@veralux/sdk'

const veralux = new VeraLux({
  network: 'mainnet',
  apiKey: process.env.VERALUX_API_KEY
})

async function createNFTListing() {
  const contract = new NFTContract(veralux)
  
  const listing = await contract.createListing({
    tokenId: '123',
    price: '1.5',
    currency: 'SUI',
    escrowEnabled: true
  })
  
  return listing
}`);

  const projects = [
    {
      id: "nft-marketplace",
      name: "NFT Marketplace",
      description: "Build a decentralized marketplace with escrow",
      category: "DeFi",
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
    },
    {
      id: "social-dapp",
      name: "Social dApp",
      description: "Create a Web3 social platform with reputation",
      category: "Social",
      difficulty: "Advanced",
      estimatedTime: "4-6 hours",
    },
    {
      id: "gaming-guild",
      name: "Gaming Guild",
      description: "Build a guild management system",
      category: "Gaming",
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
    },
  ];

  const sdkModules = [
    {
      name: "Authentication",
      description: "zkLogin and wallet integration",
      methods: ["login()", "logout()", "getUser()"],
      status: "stable",
    },
    {
      name: "NFT Management",
      description: "Create, mint, and manage NFTs",
      methods: ["mint()", "transfer()", "burn()"],
      status: "stable",
    },
    {
      name: "Reputation System",
      description: "Track and manage user reputation",
      methods: ["getReputation()", "updateRep()", "getLeaderboard()"],
      status: "beta",
    },
    {
      name: "Escrow Services",
      description: "Secure transaction handling",
      methods: ["createEscrow()", "releasePayment()", "dispute()"],
      status: "stable",
    },
  ];

  return (
    <NavigationLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-800 bg-[#131F40] rounded-lg mb-8">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Code2 className="h-6 w-6 text-[#4361EE]" />
                  <h1 className="text-2xl font-bold">Dev Hub</h1>
                </div>
                <Badge variant="secondary" className="bg-[#FFD166] text-black">
                  SDK v2.1.0
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 bg-transparent"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Docs
                </Button>
                <Button size="sm" className="bg-[#4361EE] hover:bg-[#3651DD]">
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList
            style={{
              background: "rgba(229, 247, 253, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-[#4361EE]"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-[#4361EE]"
            >
              <Layers className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="sdk"
              className="data-[state=active]:bg-[#4361EE]"
            >
              <Zap className="h-4 w-4 mr-2" />
              SDK Library
            </TabsTrigger>
            <TabsTrigger
              value="deploy"
              className="data-[state=active]:bg-[#4361EE]"
            >
              <Globe className="h-4 w-4 mr-2" />
              Launchpad
            </TabsTrigger>
          </TabsList>

          {/* Code Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Editor */}
              <div className="lg:col-span-3">
                <Card className="bg-[#131F40] border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">main.js</CardTitle>
                      <CardDescription>VeraLux SDK Integration</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 bg-transparent"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#06D6A0] hover:bg-[#05C195] text-black"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[#080E1199] rounded-lg p-4 font-mono text-sm">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="min-h-[400px] bg-transparent border-none resize-none text-gray-300 font-mono"
                        placeholder="Start coding with VeraLux SDK..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Console & Tools */}
              <div className="space-y-4">
                <Card className="bg-[#131F40] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-white">
                      Console
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[#080E1199] rounded p-3 font-mono text-xs text-green-400 min-h-[120px]">
                      <div>$ veralux init</div>
                      <div className="text-gray-400">✓ Project initialized</div>
                      <div className="text-gray-400">✓ SDK connected</div>
                      <div className="text-[#06D6A0]">Ready to build!</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#131F40] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-white">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-gray-600 bg-transparent"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Project
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-gray-600 bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-gray-600 bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Project Templates
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-10 bg-[#131F40] border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-[#131F40] border-gray-700 hover:border-[#4361EE] transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={
                          project.difficulty === "Beginner"
                            ? "bg-[#06D6A0] text-black"
                            : project.difficulty === "Intermediate"
                            ? "bg-[#FFD166] text-black"
                            : "bg-[#FF6B6B] text-white"
                        }
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{project.category}</span>
                      <span>{project.estimatedTime}</span>
                    </div>
                    <Button
                      className="w-full bg-[#4361EE] hover:bg-[#3651DD]"
                      onClick={() => setActiveProject(project.id)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SDK Library Tab */}
          <TabsContent value="sdk" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                SDK Documentation
              </h2>
              <Badge variant="secondary" className="bg-[#06D6A0] text-black">
                Latest: v2.1.0
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sdkModules.map((module, index) => (
                <Card key={index} className="bg-[#131F40] border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">
                        {module.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={
                          module.status === "stable"
                            ? "bg-[#06D6A0] text-black"
                            : module.status === "beta"
                            ? "bg-[#FFD166] text-black"
                            : "bg-gray-600 text-white"
                        }
                      >
                        {module.status}
                      </Badge>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">
                        Available Methods:
                      </h4>
                      <div className="space-y-2">
                        {module.methods.map((method, methodIndex) => (
                          <div
                            key={methodIndex}
                            className="flex items-center justify-between bg-[#080E1199] rounded p-2"
                          >
                            <code className="text-[#4361EE] text-sm">
                              {method}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Launchpad Tab */}
          <TabsContent value="deploy" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Project Launchpad
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Deploy your VeraLux dApp to the mainnet with one click. Our
                launchpad handles infrastructure, scaling, and monitoring so you
                can focus on building.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#131F40] border-gray-700">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#4361EE] rounded-full flex items-center justify-center mb-4">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Build</CardTitle>
                  <CardDescription>
                    Compile and optimize your code
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                  >
                    Start Build
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#131F40] border-gray-700">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#FFD166] rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-white">Test</CardTitle>
                  <CardDescription>
                    Run automated tests and security checks
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                  >
                    Run Tests
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#131F40] border-gray-700">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#06D6A0] rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-white">Deploy</CardTitle>
                  <CardDescription>
                    Launch to mainnet with monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-[#06D6A0] hover:bg-[#05C195] text-black">
                    Deploy Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#131F40] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Deployment Configuration
                </CardTitle>
                <CardDescription>
                  Configure your deployment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name
                    </label>
                    <Input
                      placeholder="my-veralux-dapp"
                      className="bg-[#080E1199] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Network
                    </label>
                    <select className="w-full p-2 bg-[#080E1199] border border-gray-600 rounded text-white">
                      <option>Sui Mainnet</option>
                      <option>Sui Testnet</option>
                      <option>Sui Devnet</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-400">
                    Estimated deployment time: 2-3 minutes
                  </div>
                  <Button className="bg-[#4361EE] hover:bg-[#3651DD]">
                    <Rocket className="h-4 w-4 mr-2" />
                    Launch Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NavigationLayout>
  );
}
