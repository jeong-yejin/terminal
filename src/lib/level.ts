export interface LevelInfo {
  title: string;
  color: string;       // hex – for inline styles, rings, etc.
  bgColor: string;     // rgba – badge background
  hasBorder: boolean;
  borderColor: string; // hex – only used when hasBorder is true
  badge: string;       // public path to SVG badge image
}

export function getLevelInfo(level: number): LevelInfo {
  if (level >= 90) return { title: "Whale",    color: "#eab308", bgColor: "rgba(234,179,8,0.1)",   hasBorder: true,  borderColor: "#fef08a", badge: "/terminal-badge/whale.svg"    };
  if (level >= 80) return { title: "Master",   color: "#fef08a", bgColor: "rgba(254,240,138,0.1)", hasBorder: false, borderColor: "",        badge: "/terminal-badge/master.svg"   };
  if (level >= 70) return { title: "Elite",    color: "#fbbf24", bgColor: "rgba(251,191,36,0.1)",  hasBorder: false, borderColor: "",        badge: "/terminal-badge/elite.svg"    };
  if (level >= 60) return { title: "Veteran",  color: "#5eead4", bgColor: "rgba(94,234,212,0.1)",  hasBorder: false, borderColor: "",        badge: "/terminal-badge/veteran.svg"  };
  if (level >= 50) return { title: "Pro",      color: "#f97316", bgColor: "rgba(249,115,22,0.1)",  hasBorder: false, borderColor: "",        badge: "/terminal-badge/pro.svg"      };
  if (level >= 40) return { title: "Expert",   color: "#ef4444", bgColor: "rgba(239,68,68,0.1)",   hasBorder: false, borderColor: "",        badge: "/terminal-badge/expert.svg"   };
  if (level >= 30) return { title: "Regular",  color: "#9333ea", bgColor: "rgba(147,51,234,0.1)",  hasBorder: false, borderColor: "",        badge: "/terminal-badge/regular.svg"  };
  if (level >= 20) return { title: "Trader",   color: "#0284c7", bgColor: "rgba(8,145,178,0.1)",   hasBorder: false, borderColor: "",        badge: "/terminal-badge/trader.svg"   };
  if (level >= 10) return { title: "Rookie",   color: "#10b981", bgColor: "rgba(16,185,129,0.1)",  hasBorder: false, borderColor: "",        badge: "/terminal-badge/rookie.svg"   };
  return                   { title: "Newcomer", color: "#6b7280", bgColor: "rgba(107,114,128,0.1)", hasBorder: false, borderColor: "",        badge: "/terminal-badge/newcomer.svg" };
}
