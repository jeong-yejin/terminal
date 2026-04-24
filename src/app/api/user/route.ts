import { NextResponse } from "next/server";
import type { UserProfile } from "@/types/mypage";

export async function GET() {
  const user: UserProfile = {
    name: "User",
    email: "",
    avatarUrl: "",
    level: 15,
    xp: 3200,
    xpForNext: 5000,
    rank: 142,
    followers: 38,
    following: 24,
    posts: 12,
    isReferral: false,
  };
  return NextResponse.json(user);
}
