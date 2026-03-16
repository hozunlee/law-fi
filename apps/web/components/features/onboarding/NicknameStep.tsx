'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'
import { useOnboardingStore } from './useOnboardingStore'
import { checkNicknameDuplicate } from '@/lib/actions/onboarding.action'
import { toast } from '@law-fi/ui/sonner'

export function NicknameStep() {
	const { nickname, setNickname, setStep } = useOnboardingStore()
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
				setStep('ROLE')
			}
		} catch (err) {
			toast.error('오류가 발생했습니다. 다시 시도해 주세요.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
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
						className="bg-white/5 border-white/10 text-white h-12 focus:border-(--accent-primary)"
					/>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<p className="text-xs text-white/30 italic mt-2">
						* 닉네임 변경은 7일에 1회로 제한됩니다.
					</p>
				</div>

				<Button
					type="submit"
					disabled={isLoading || !nickname}
					className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold rounded-xl"
				>
					{isLoading ? '확인 중...' : 'Next Step'}
				</Button>
			</form>
		</div>
	)
}
