import { Metadata } from "next"
import { LoginWidget } from "@/components/widgets/auth/LoginWidget"

export const metadata: Metadata = {
  title: "LAW-FI | 로그인",
  description: "익명 기반 프리미엄 전문직 라운지",
}

export default function LoginPage() {
  return <LoginWidget />
}
