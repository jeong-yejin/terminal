import { UserProfilePage } from "@/components/user/UserProfilePage";

export function generateMetadata({ params }: { params: { userId: string } }) {
  return { title: `Trader Profile | ReboundX Terminal` };
}

export default function Page({ params }: { params: { userId: string } }) {
  return <UserProfilePage userId={params.userId} />;
}
