'use client'

import { useState } from 'react'
import { emailSchema } from '@law-fi/supabase/zod/auth'
import { checkEmailExists } from '@/lib/actions/auth.action'
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'
import { AuthMode } from './AuthContainer'

interface EmailCheckFormProps {
	onResolved: (email: string, nextMode: AuthMode) => void
}

export function EmailCheckForm({ onResolved }: EmailCheckFormProps) {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		const parsedEmail = emailSchema.safeParse(email)
		if (!parsedEmail.success) {
			setError(parsedEmail.error.errors[0].message)
			return
		}

		setIsLoading(true)
		try {
			const { exists } = await checkEmailExists(email)
			onResolved(email, exists ? 'LOGIN' : 'SIGNUP')
		} catch {
			setError('오류가 발생했습니다. 다시 시도해주세요.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="mb-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">
					Welcome to Law-fi
				</h1>
				<p className="text-lg text-[var(--text-secondary)]">이메일을 입력하여 시작하세요</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label
						className="text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase"
						htmlFor="email"
					>
						Email Address
					</label>
					<Input
						id="email"
						type="email"
						placeholder="user@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						required
						className="h-14 border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
					/>
				</div>

				{error && <p className="text-sm text-red-400">{error}</p>}

				<div className="pt-2">
					<Button
						type="submit"
						disabled={isLoading || email.length === 0}
						className="h-14 w-full text-base font-bold"
					>
						{isLoading ? '확인 중...' : 'Continue'}
					</Button>
				</div>
			</form>
		</div>
	)
}
