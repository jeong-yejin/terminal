import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ exchangeId: string }> }
) {
  const { exchangeId } = await params;
  if (!exchangeId) {
    return NextResponse.json({ error: "exchangeId is required" }, { status: 400 });
  }
  // Production: revoke API keys and remove from DB
  return new NextResponse(null, { status: 204 });
}
