// Shared circles data - single source of truth for all circle information
// Used by: circles-modal, circles-sliding-panel, desktop-left-sidebar, desktop-top-bar

export interface Circle {
  id: string;
  name: string;
  description?: string;
  icon: string;
  memberCount: number;
  onlineMembers: number; // Also used as onlineCount in some components
  isPrivate?: boolean;
  isJoined?: boolean;
  unreadCount?: number;
  lastActivity?: string;
  owner?: string;
  tags?: string[];
}

// All circles that the user has joined
export const joinedCircles: Circle[] = [
  {
    id: "defi-builders",
    name: "Defi Builders",
    description: "Developers & Product Creators",
    icon: "🏗️",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 0,
    lastActivity: "2m ago",
    owner: "Vitalik Buterin",
    tags: ["DeFi", "Development", "Smart Contracts"],
  },
  {
    id: "kings-alliance",
    name: "Kings Alliance",
    description: "Funding, Budgeting & Resource Allocation",
    icon: "👑",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 0,
    lastActivity: "5m ago",
    owner: "Sarah Miller",
    tags: ["Funding", "Budgeting", "Resources"],
  },
  {
    id: "ynx-dao",
    name: "YNX DAO",
    description: "DAO Governance & Community",
    icon: "🌐",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 3,
    lastActivity: "1h ago",
    owner: "Community",
    tags: ["DAO", "Governance"],
  },
  {
    id: "governance-circle",
    name: "Governance Circle",
    description: "Governance & Decision Making",
    icon: "🗳️",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 0,
    lastActivity: "1h ago",
    owner: "Mike Chen",
    tags: ["Governance", "Decision Making"],
  },
  {
    id: "defi-community",
    name: "Defi Community",
    description: "S.K.R.O.W.S",
    icon: "💎",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 3,
    lastActivity: "30m ago",
    owner: "Community",
    tags: ["DeFi", "Community"],
  },
  {
    id: "our-space",
    name: "Our Space",
    description: "Community Space",
    icon: "🏠",
    memberCount: 2004,
    onlineMembers: 200,
    isPrivate: false,
    isJoined: true,
    unreadCount: 0,
    lastActivity: "15m ago",
    owner: "Community",
    tags: ["Community"],
  },
];

// Circles available to discover (not joined yet)
export const discoverCircles: Circle[] = [
  {
    id: "layer2-scaling",
    name: "Layer 2 Scaling",
    description: "Discussing L2 solutions and scaling technologies",
    icon: "⚡",
    memberCount: 892,
    onlineMembers: 15,
    isPrivate: false,
    isJoined: false,
    owner: "Polygon Team",
    tags: ["Layer2", "Scaling", "Technology"],
  },
  {
    id: "dao-governance",
    name: "DAO Governance",
    description: "Decentralized governance and voting mechanisms",
    icon: "🗳️",
    memberCount: 1456,
    onlineMembers: 28,
    isPrivate: false,
    isJoined: false,
    owner: "Compound Labs",
    tags: ["DAO", "Governance", "Voting"],
  },
  {
    id: "web3-security",
    name: "Web3 Security",
    description: "Security best practices and audit discussions",
    icon: "🛡️",
    memberCount: 634,
    onlineMembers: 12,
    isPrivate: true,
    isJoined: false,
    owner: "OpenZeppelin",
    tags: ["Security", "Audits", "Best Practices"],
  },
  {
    id: "metaverse-builders",
    name: "Metaverse Builders",
    description: "Creating immersive virtual worlds and experiences",
    icon: "🌐",
    memberCount: 1123,
    onlineMembers: 34,
    isPrivate: false,
    isJoined: false,
    owner: "Decentraland",
    tags: ["Metaverse", "VR", "Gaming"],
  },
];

// Helper function to get a circle by ID
export function getCircleById(id: string): Circle | undefined {
  return joinedCircles.find((circle) => circle.id === id) || 
         discoverCircles.find((circle) => circle.id === id);
}

// Helper function to get all circles (joined + discover) as a record for quick lookup
export function getCirclesRecord(): Record<string, Circle> {
  const allCircles = [...joinedCircles, ...discoverCircles];
  return allCircles.reduce((acc, circle) => {
    acc[circle.id] = circle;
    return acc;
  }, {} as Record<string, Circle>);
}

