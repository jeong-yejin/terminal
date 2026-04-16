import { NextResponse } from "next/server";
import type { UserProfile } from "@/types/mypage";

export async function GET() {
  // Production: read from session / Auth context (e.g. next-auth getServerSession)
  const user: UserProfile = {
    name: "User",
    email: "",
    avatarUrl: "",
  };
  return NextResponse.json(user);
}
