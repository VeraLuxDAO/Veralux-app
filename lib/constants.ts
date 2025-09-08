// Common constants used across the application
export const SUPPORTED_WALLETS = [
  "Suiet",
  "Phantom",
  "Martian",
  "OKX",
  "Glass",
  "Slush",
] as const;

export const AI_RESPONSES = [
  "Based on your activity, I'd recommend engaging more with the DeFi Builders community. Your reputation score could increase by 15% with consistent participation!",
  "I found 3 users with similar interests in Web3 development. Would you like me to suggest some connection opportunities?",
  "Your profile is looking great! Consider adding more skills to your NFT identity - it could boost your visibility in the Gaming Hub by 25%.",
  "Here are the trending topics in your communities: DeFi protocols, NFT gaming, and DAO governance. Perfect time to share your insights!",
  "I can help you optimize your staking strategy. Your current setup could earn 12% more rewards with some adjustments.",
] as const;

export const QUICK_ACTIONS = [
  {
    icon: "TrendingUp",
    label: "Analyze my reputation",
    color: "text-veralux-green",
  },
  { icon: "Users", label: "Find connections", color: "text-electric-blue" },
  { icon: "Zap", label: "Optimize my profile", color: "text-veralux-yellow" },
  { icon: "Sparkles", label: "Trending topics", color: "text-purple-400" },
] as const;

export const EXPLORER_URLS = {
  SUI: "https://suiexplorer.com/address/",
} as const;

export const ANIMATION_DURATIONS = {
  FAST: "0.2s",
  NORMAL: "0.3s",
  SLOW: "0.5s",
} as const;
