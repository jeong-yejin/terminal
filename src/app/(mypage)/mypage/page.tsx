import { redirect } from "next/navigation";

/** Redirect to Overview when /mypage is accessed */
export default function MyPageRootPage() {
  redirect("/mypage/overview");
}
