'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type OnboardingStep } from '@/store/useOnboardingStore'
import { NicknameStep } from '../../features/onboarding/NicknameStep'
import { RoleStep } from '../../features/onboarding/RoleStep'
import { VerificationStep } from '../../features/onboarding/VerificationStep'
import { PendingStep } from '../../features/onboarding/PendingStep'

export function OnboardingWizard({ initialStep }: { initialStep: OnboardingStep }) {
	const [step, setStep] = useState<OnboardingStep>(initialStep)

	return (
		<div className="relative flex min-h-[500px] w-full items-center justify-center py-12">
			<AnimatePresence mode="wait">
				<motion.div
					key={step}
					initial={{ opacity: 0, scale: 0.98, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 1.02, y: -10 }}
					transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
					className="w-full"
				>
					{step === 'NICKNAME' && <NicknameStep onNext={() => setStep('ROLE')} />}
					{step === 'ROLE' && <RoleStep onNext={() => setStep('VERIFICATION')} onPrev={() => setStep('NICKNAME')} />}
					{step === 'VERIFICATION' && <VerificationStep onNext={() => setStep('PENDING')} onPrev={() => setStep('ROLE')} />}
					{step === 'PENDING' && <PendingStep />}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
