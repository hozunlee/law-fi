import { AuthForm } from "@/components/features/AuthForm"

export const metadata = {
  title: "LAW-FI | 로그인",
  description: "익명 기반 프리미엄 전문직 라운지",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] p-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] p-8 sm:p-10 rounded-[var(--radius-card)] shadow-sm border border-[var(--border-subtle)]">
        <AuthForm />
      </div>
    </div>
  )
}
