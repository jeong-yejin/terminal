import { redirect } from "next/navigation";

/** /mypage 접근 시 Overview로 리다이렉트 */
export default function MyPageRootPage() {
  redirect("/mypage/overview");
}
