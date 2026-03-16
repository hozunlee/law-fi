'use client'

import { motion } from 'framer-motion'
import { Button } from '@law-fi/ui/button'
import { useOnboardingStore } from '@/store/useOnboardingStore'

import { Gavel, GraduationCap, ChevronLeft } from 'lucide-react'

export function RoleStep() {
	const { role, setRole, setStep } = useOnboardingStore()

	const roles = [
		{
			id: 'LAWYER',
			title: 'Member of the Bar',
			description: '변호사 인증을 진행합니다.',
			icon: <Gavel className="h-8 w-8" />
		},
		{
			id: 'STUDENT',
			title: 'Law Student',
			description: '로스쿨 학생 인증을 진행합니다.',
			icon: <GraduationCap className="h-8 w-8" />
		}
	]

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-3xl font-bold text-white">Identify Yourself</h1>
					<p className="text-white/60">본인에게 해당하는 역할을 선택해주세요.</p>
				</div>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-4">
				{roles.map((r) => (
					<button
						key={r.id}
						onClick={() => setRole(r.id as any)}
						className={`group flex items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all ${
							role === r.id
								? 'border-white bg-white/10'
								: 'border-white/10 bg-white/5 hover:border-white/30'
						}`}
					>
						<div
							className={`rounded-xl p-3 transition-colors ${
								role === r.id ? 'bg-white text-black' : 'bg-white/10 text-white/70'
							}`}
						>
							{r.icon}
						</div>
						<div>
							<h3 className="text-lg font-bold text-white">{r.title}</h3>
							<p className="text-sm text-white/50">{r.description}</p>
						</div>
					</button>
				))}
			</div>

			<div className="flex gap-4">
				<Button
					variant="ghost"
					onClick={() => setStep('NICKNAME')}
					className="h-12 text-white/50 hover:text-white"
				>
					<ChevronLeft className="mr-1 h-4 w-4" /> Back
				</Button>
				<Button
					onClick={() => setStep('VERIFICATION')}
					disabled={!role}
					className="h-12 flex-1 rounded-xl bg-white font-bold text-black hover:bg-white/90"
				>
					Continue
				</Button>
			</div>
		</div>
	)
}
