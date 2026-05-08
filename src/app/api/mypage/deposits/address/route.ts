import { NextResponse } from "next/server";

/** Mock deposit addresses by network (replaced by exchange API calls in production) */
const MOCK_ADDRESSES: Record<string, string> = {
  TRC20: "TN86ydENrMwgwKdZjGgJDFPnP3MNcDHCVP",
  ERC20: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  BEP20: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  BTC:   "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  ETH:   "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  ARB:   "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  OP:    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};

const MIN_DEPOSIT: Record<string, string> = {
  USDT: "1 USDT",
  USDC: "1 USDC",
  BTC:  "0.0001 BTC",
  ETH:  "0.001 ETH",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") ?? "USDT";
  const network = searchParams.get("network") ?? "TRC20";

  const address = MOCK_ADDRESSES[network] ?? null;
  if (!address) {
    return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
  }

  return NextResponse.json({
    address,
    asset,
    network,
    minDeposit: MIN_DEPOSIT[asset] ?? "—",
    confirmations: network === "BTC" ? 2 : 12,
  });
}
