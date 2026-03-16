'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from './useOnboardingStore'
import { NicknameStep } from '../../features/onboarding/NicknameStep'
import { RoleStep } from '../../features/onboarding/RoleStep'
import { VerificationStep } from '../../features/onboarding/VerificationStep'
import { PendingStep } from '../../features/onboarding/PendingStep'

export function OnboardingWizard() {
	const { step } = useOnboardingStore()

	return (
		<div className="relative w-full min-h-[500px] flex items-center justify-center py-12">
			<AnimatePresence mode="wait">
				<motion.div
					key={step}
					initial={{ opacity: 0, scale: 0.98, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 1.02, y: -10 }}
					transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
					className="w-full"
				>
					{step === 'NICKNAME' && <NicknameStep />}
					{step === 'ROLE' && <RoleStep />}
					{step === 'VERIFICATION' && <VerificationStep />}
					{step === 'PENDING' && <PendingStep />}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
