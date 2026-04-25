// ─── Types ────────────────────────────────────────────────────────────────────

export type OpenPosition = {
  symbol: string;
  side: "Long" | "Short";
  leverage: number;
  entryPrice: number;
  currentPnlPct: number;
};

export type ClosedTrade = {
  symbol: string;
  side: "Long" | "Short";
  pnlPct: number;
  closedAt: string;
};

export type UserProfile = {
  id: string;
  nickname: string;
  level: number;
  isReferral: boolean;
  joinDate: string;
  lastActive: string;
  volumeRange: string;
  xp: number;
  statsOptIn?: boolean;
  openPosition?: OpenPosition;
  winRate30d?: number;
  pnl30d?: number;
  recentTrades?: ClosedTrade[];
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  nickname: string;
  level: number;
  isReferral: boolean;
  xp: number;
  volumeRange: string;
  winRate: number;
  weeklyPnl: number;
  monthlyPnl: number;
  allTimePnl: number;
  trades: number;
  tier: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PROFILES: Record<string, UserProfile> = {
  u1: {
    id: "u1", nickname: "CryptoWhale88", level: 72, isReferral: false,
    joinDate: "2024-01-15", lastActive: "2026-04-21", volumeRange: "$1M–$5M", xp: 18400,
    statsOptIn: true,
    openPosition: { symbol: "BTCUSDT", side: "Long", leverage: 20, entryPrice: 92400, currentPnlPct: 7.82 },
    winRate30d: 61.2,
    pnl30d: 54.1,
    recentTrades: [
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  12.4, closedAt: "Apr 22" },
      { symbol: "ETHUSDT", side: "Short", pnlPct:  -3.1, closedAt: "Apr 20" },
      { symbol: "SOLUSDT", side: "Long",  pnlPct:  18.7, closedAt: "Apr 18" },
      { symbol: "BTCUSDT", side: "Long",  pnlPct:   6.3, closedAt: "Apr 15" },
      { symbol: "BNBUSDT", side: "Short", pnlPct:  -1.8, closedAt: "Apr 12" },
    ],
  },
  u2: {
    id: "u2", nickname: "SolanaKing", level: 45, isReferral: true,
    joinDate: "2024-06-03", lastActive: "2026-04-21", volumeRange: "$100K–$500K", xp: 7200,
    statsOptIn: false,
  },
  u3: {
    id: "u3", nickname: "BTCmaxi", level: 91, isReferral: false,
    joinDate: "2023-03-22", lastActive: "2026-04-21", volumeRange: "$5M+", xp: 42000,
    statsOptIn: true,
    openPosition: { symbol: "BTCUSDT", side: "Long", leverage: 50, entryPrice: 89200, currentPnlPct: 23.45 },
    winRate30d: 68.4,
    pnl30d: 87.3,
    recentTrades: [
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  31.2, closedAt: "Apr 23" },
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  15.8, closedAt: "Apr 21" },
      { symbol: "ETHUSDT", side: "Long",  pnlPct:   9.4, closedAt: "Apr 19" },
      { symbol: "BTCUSDT", side: "Short", pnlPct:  -4.2, closedAt: "Apr 16" },
      { symbol: "SOLUSDT", side: "Long",  pnlPct:  22.1, closedAt: "Apr 13" },
    ],
  },
  u4: {
    id: "u4", nickname: "TradeGuru_KR", level: 33, isReferral: true,
    joinDate: "2025-02-10", lastActive: "2026-04-20", volumeRange: "$50K–$100K", xp: 3800,
    statsOptIn: true,
    openPosition: undefined,
    winRate30d: 52.3,
    pnl30d: 22.8,
    recentTrades: [
      { symbol: "ETHUSDT", side: "Long",  pnlPct:   8.1, closedAt: "Apr 21" },
      { symbol: "SOLUSDT", side: "Short", pnlPct:  -5.7, closedAt: "Apr 19" },
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  11.3, closedAt: "Apr 17" },
      { symbol: "BNBUSDT", side: "Long",  pnlPct:   3.9, closedAt: "Apr 14" },
      { symbol: "ETHUSDT", side: "Short", pnlPct:  -2.4, closedAt: "Apr 11" },
    ],
  },
  u5: {
    id: "u5", nickname: "DiaHands", level: 8, isReferral: false,
    joinDate: "2026-03-01", lastActive: "2026-04-21", volumeRange: "$1K–$10K", xp: 420,
  },
  me: {
    id: "me", nickname: "You", level: 15, isReferral: false,
    joinDate: "2026-04-01", lastActive: "2026-04-24", volumeRange: "$10K–$50K", xp: 1240,
    statsOptIn: true,
    openPosition: { symbol: "BTCUSDT", side: "Long", leverage: 10, entryPrice: 91800, currentPnlPct: 0.85 },
    winRate30d: 41.2,
    pnl30d: 18.4,
    recentTrades: [
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  4.2, closedAt: "Apr 22" },
      { symbol: "ETHUSDT", side: "Long",  pnlPct:  2.1, closedAt: "Apr 19" },
      { symbol: "SOLUSDT", side: "Short", pnlPct: -1.3, closedAt: "Apr 17" },
      { symbol: "BTCUSDT", side: "Long",  pnlPct:  5.6, closedAt: "Apr 15" },
    ],
  },
  // Community-page profiles (keyed by nickname)
  MoonMission: {
    id: "MoonMission", nickname: "MoonMission", level: 21, isReferral: true,
    joinDate: "2023-12-01", lastActive: "2026-04-22", volumeRange: "$300K–$700K", xp: 2100,
  },
  ETHbull_kr: {
    id: "ETHbull_kr", nickname: "ETHbull_kr", level: 31, isReferral: false,
    joinDate: "2024-02-10", lastActive: "2026-04-20", volumeRange: "$500K–$1M", xp: 2100,
  },
  Moonrider: {
    id: "Moonrider", nickname: "Moonrider", level: 18, isReferral: false,
    joinDate: "2024-03-15", lastActive: "2026-04-19", volumeRange: "$200K–$500K", xp: 1750,
  },
};

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1,  userId: "u3",   nickname: "BTCmaxi",        tier: "Trader",   level: 91, isReferral: false, xp: 42000, volumeRange: "$5M+",        winRate: 68.4, weeklyPnl: 24.8, monthlyPnl: 87.3, allTimePnl: 412.7, trades: 1840 },
  { rank: 2,  userId: "u1",   nickname: "CryptoWhale88",  tier: "Elite",    level: 72, isReferral: false, xp: 18400, volumeRange: "$1M–$5M",     winRate: 61.2, weeklyPnl: 18.3, monthlyPnl: 54.1, allTimePnl: 231.4, trades: 976  },
  { rank: 3,  userId: "u2",   nickname: "SolanaKing",     tier: "Regular",  level: 45, isReferral: true,  xp: 7200,  volumeRange: "$100K–$500K", winRate: 55.8, weeklyPnl: 12.1, monthlyPnl: 31.7, allTimePnl: 148.9, trades: 542  },
  { rank: 4,  userId: "u4",   nickname: "TradeGuru_KR",   tier: "Expert",   level: 33, isReferral: true,  xp: 3800,  volumeRange: "$50K–$100K",  winRate: 52.3, weeklyPnl:  9.4, monthlyPnl: 22.8, allTimePnl:  88.2, trades: 318  },
  { rank: 5,  userId: "lb5",  nickname: "VolatilityKing", tier: "Pro",      level: 28, isReferral: false, xp: 2900,  volumeRange: "$50K–$100K",  winRate: 49.1, weeklyPnl:  7.2, monthlyPnl: 18.1, allTimePnl:  61.3, trades: 284  },
  { rank: 6,  userId: "lb6",  nickname: "MoonMission",    tier: "Veteran",  level: 21, isReferral: true,  xp: 2100,  volumeRange: "$10K–$50K",   winRate: 47.8, weeklyPnl:  5.8, monthlyPnl: 14.5, allTimePnl:  43.7, trades: 201  },
  { rank: 7,  userId: "lb7",  nickname: "EthMaximalist",  tier: "Master",   level: 19, isReferral: false, xp: 1750,  volumeRange: "$10K–$50K",   winRate: 46.3, weeklyPnl:  4.1, monthlyPnl: 11.2, allTimePnl:  31.9, trades: 167  },
  { rank: 8,  userId: "lb8",  nickname: "OGWhaleHunter",  tier: "Whale",    level: 25, isReferral: false, xp: 2450,  volumeRange: "$100K–$500K",  winRate: 44.7, weeklyPnl:  3.3, monthlyPnl:  8.6, allTimePnl:  22.1, trades: 124  },
  { rank: 9,  userId: "me",   nickname: "You",            tier: "Newcomer", level: 15, isReferral: false, xp: 1240,  volumeRange: "$10K–$50K",   winRate: 41.2, weeklyPnl:  2.8, monthlyPnl:  6.1, allTimePnl:  18.4, trades: 108  },
  { rank: 10, userId: "lb10", nickname: "NewbieTrader",   tier: "Rookie",   level:  3, isReferral: true,  xp: 180,   volumeRange: "$1K–$10K",    winRate: 38.9, weeklyPnl:  0.8, monthlyPnl:  1.7, allTimePnl:   3.2, trades:  22  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMockProfile(userId: string): UserProfile | null {
  if (MOCK_PROFILES[userId]) return MOCK_PROFILES[userId];
  const byName = Object.values(MOCK_PROFILES).find((p) => p.nickname === userId);
  if (byName) return byName;

  // Fallback: synthesize a minimal profile from LeaderboardEntry so ranking rows are always clickable
  const lb = LEADERBOARD_DATA.find((e) => e.userId === userId || e.nickname === userId);
  if (lb) {
    return {
      id: lb.userId,
      nickname: lb.nickname,
      level: lb.level,
      isReferral: lb.isReferral,
      joinDate: "2024-08-01",
      lastActive: "2026-04-24",
      volumeRange: lb.volumeRange,
      xp: lb.xp,
      statsOptIn: false,
    };
  }
  return null;
}

export function getLeaderboardEntry(userId: string): LeaderboardEntry | undefined {
  return (
    LEADERBOARD_DATA.find((e) => e.userId === userId) ??
    LEADERBOARD_DATA.find((e) => e.nickname === userId)
  );
}
