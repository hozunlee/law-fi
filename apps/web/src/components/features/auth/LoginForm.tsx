'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'
import { passwordSchema } from '@law-fi/supabase/zod/auth'
import { createClient } from '@law-fi/supabase/client'
import { getPostLoginRedirectPath } from '@/lib/actions/auth.action'

interface LoginFormProps {
	email: string
	onReset: () => void
}

export function LoginForm({ email, onReset }: LoginFormProps) {
	const router = useRouter()
	const supabase = createClient()

	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		const parsedPassword = passwordSchema.safeParse(password)
		if (!parsedPassword.success) {
			setError(parsedPassword.error.errors[0].message)
			return
		}

		setIsLoading(true)
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		})
		setIsLoading(false)

		if (signInError) {
			setError('이메일 또는 비밀번호가 일치하지 않습니다.')
			return
		}

		toast.success('로그인 성공')
		const redirectUrl = await getPostLoginRedirectPath()
		router.push(redirectUrl)
	}

	return (
		<form onSubmit={handleLogin} className="flex flex-col gap-6">
			<div className="mb-4 text-left">
				<h1 className="mb-2 text-3xl font-bold tracking-tight text-(--text-primary)">
					Welcome back
				</h1>
				<p className="text-lg text-(--text-secondary)">비밀번호를 입력하여 로그인하세요</p>
			</div>

			<div className="relative flex flex-col gap-2">
				<label className="text-sm font-semibold tracking-wider text-(--text-secondary) uppercase">
					Email Address
				</label>
				<Input
					type="email"
					value={email}
					disabled
					readOnly
					className="h-14 cursor-not-allowed border-(--border-subtle) bg-(--bg-base) text-(--text-secondary) opacity-70"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<label
						className="text-sm font-semibold tracking-wider text-(--text-secondary) uppercase"
						htmlFor="password"
					>
						Password
					</label>
					<button
						type="button"
						className="text-sm font-medium text-(--accent-primary) transition-opacity hover:opacity-80"
					>
						Forgot password?
					</button>
				</div>
				<Input
					id="password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isLoading}
					required
					className="h-14 border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) transition-all focus:border-(--accent-primary) focus:ring-1 focus:ring-(--accent-primary)"
				/>
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
			</div>

			<div className="pt-2">
				<Button
					type="submit"
					disabled={isLoading || password.length === 0}
					className="h-14 w-full bg-(--text-primary) text-base font-bold text-(--bg-surface) transition-opacity hover:opacity-90"
				>
					{isLoading ? '로그인 중...' : 'Sign In'}
				</Button>
			</div>

			<div className="mt-2 text-center">
				<button
					type="button"
					onClick={onReset}
					className="group mx-auto flex items-center justify-center gap-2 py-2 text-(--text-secondary) transition-colors hover:text-(--text-primary)"
				>
					<span className="text-sm transition-transform group-hover:-translate-x-1">←</span>
					<span className="text-sm font-medium">Use a different email</span>
				</button>
			</div>
		</form>
	)
}
