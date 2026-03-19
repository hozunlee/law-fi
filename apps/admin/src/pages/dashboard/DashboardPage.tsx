import { useLogout, useGetIdentity } from '@refinedev/core'
import { Button } from '@law-fi/ui/button'

export function DashboardPage() {
  const { mutate: logout } = useLogout()
  const { data: identity } = useGetIdentity<{ id: string; name: string }>()

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-(--border-subtle) bg-(--bg-surface) backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-5xl">
          <div className="text-xl font-semibold tracking-tight text-(--text-primary)">Law-fi Admin</div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-(--text-secondary)">{identity?.name}</span>
            <Button variant="outline" size="sm" onClick={() => logout()} className="rounded-full shadow-sm text-black">
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        <div className="rounded-2xl bg-(--bg-surface) p-8 shadow-sm border border-(--border-subtle)">
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-4">대시보드</h2>
          <p className="text-(--text-secondary) leading-relaxed">
            환영합니다. 현재 관리자 시스템은 준비 중입니다.<br/>
            추후 가입 승인 및 회원 관리 등 세부 기능이 제공될 예정입니다.
          </p>
        </div>
      </main>
    </div>
  )
}
