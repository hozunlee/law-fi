'use client'

import { useState } from 'react'
import { emailSchema } from '@law-fi/supabase/zod/auth'
import { checkEmailExists } from '@/lib/actions/auth.action'
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

			if (exists) {
				onResolved(email, 'LOGIN')
			} else {
				onResolved(email, 'SIGNUP')
			}
		} catch {
			setError('오류가 발생했습니다. 다시 시도해주세요.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="mb-3 text-4xl font-black tracking-tight text-white">Welcome to Law-fi</h1>
				<p className="text-lg text-white/60">이메일을 입력하여 시작하세요</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label
						className="text-sm font-semibold tracking-wider text-white/50 uppercase"
						htmlFor="email"
					>
						Email Address
					</label>
					<div className="relative flex items-center">
						<input
							id="email"
							type="email"
							placeholder="user@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							required
							className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-4 text-white transition-all outline-none placeholder:text-white/30 focus:border-(--accent-primary) focus:ring-2 focus:ring-(--accent-primary)/20"
						/>
					</div>
				</div>

				{error && <p className="mt-1 text-sm text-red-400">{error}</p>}

				<div className="pt-2">
					<button
						type="submit"
						disabled={isLoading || email.length === 0}
						className="w-full rounded-lg bg-white py-4 text-base font-bold text-[#0C0C0D] shadow-lg transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? '확인 중...' : 'Continue'}
					</button>
				</div>
			</form>
		</div>
	)
}
