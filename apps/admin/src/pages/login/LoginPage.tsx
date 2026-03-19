import { useState } from 'react'
import { useLogin } from '@refinedev/core'
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'

export function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    login(
      { email, password },
      {
        onError: (err) => {
          setError(err.message ?? '로그인에 실패했습니다.')
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-(--bg-base) px-4">
      <div className="w-full max-w-sm rounded-2xl bg-(--bg-surface) p-8 shadow-xl border border-(--border-subtle)">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-primary)">Law-fi Admin</h1>
          <p className="text-sm text-(--text-secondary)">관리자 계정으로 로그인하세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-(--text-secondary) ml-1">이메일</label>
              <Input
                type="email"
                placeholder="admin@law-fi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full bg-(--bg-base) border-(--border-subtle) px-4 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-(--text-secondary) ml-1">비밀번호</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-full bg-(--bg-base) border-(--border-subtle) px-4 h-11"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 py-2.5 px-3">
              <p className="text-sm font-medium text-red-500/90 text-center">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full rounded-full h-11 text-sm font-medium transition-colors"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  )
}
