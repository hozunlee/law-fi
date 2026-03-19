'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { checkNicknameDuplicate } from '@/lib/actions/onboarding.action'
import { toast } from 'sonner'

interface NicknameStepProps {
	onNext: () => void
}

export function NicknameStep({ onNext }: NicknameStepProps) {
	const { nickname, setNickname } = useOnboardingStore()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!nickname || nickname.length < 2) {
			setError('닉네임은 최소 2글자 이상이어야 합니다.')
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const isDuplicate = await checkNicknameDuplicate(nickname)
			if (isDuplicate) {
				setError('이미 사용 중인 닉네임입니다.')
			} else {
				onNext()
			}
		} catch (err) {
			toast.error('오류가 발생했습니다. 다시 시도해 주세요.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-white">Welcome!</h1>
				<p className="text-white/60">활동하실 닉네임을 설정해주세요.</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label className="text-sm font-medium text-white/50" htmlFor="nickname">
						Nickname
					</label>
					<Input
						id="nickname"
						placeholder="2~10자 이내로 입력"
						value={nickname}
						onChange={(e) => {
							setNickname(e.target.value)
							setError(null)
						}}
						disabled={isLoading}
						className="h-12 border-white/10 bg-white/5 text-white focus:border-(--accent-primary)"
					/>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<p className="mt-2 text-xs text-white/30 italic">
						* 닉네임 변경은 7일에 1회로 제한됩니다.
					</p>
				</div>

				<Button
					type="submit"
					disabled={isLoading || !nickname}
					className="h-12 w-full rounded-xl bg-white font-bold text-black hover:bg-white/90"
				>
					{isLoading ? '확인 중...' : 'Next Step'}
				</Button>
			</form>
		</div>
	)
}
