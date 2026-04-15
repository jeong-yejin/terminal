import { AssetDetailPage } from "@/components/mypage/assets/AssetDetailPage";

interface Props {
  params: Promise<{ exchangeId: string }>;
}

export default async function AssetDetailRoute({ params }: Props) {
  const { exchangeId } = await params;
  return <AssetDetailPage exchangeId={exchangeId} />;
}
