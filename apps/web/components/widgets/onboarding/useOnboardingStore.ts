import { create } from 'zustand'

export type OnboardingStep = 'NICKNAME' | 'ROLE' | 'VERIFICATION' | 'PENDING'

interface OnboardingState {
	step: OnboardingStep
	nickname: string
	role: 'LAWYER' | 'STUDENT' | null
	verificationImageUrl: string | null

	setStep: (step: OnboardingStep) => void
	setNickname: (nickname: string) => void
	setRole: (role: 'LAWYER' | 'STUDENT') => void
	setVerificationImageUrl: (url: string) => void
	reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
	step: 'NICKNAME',
	nickname: '',
	role: null,
	verificationImageUrl: null,

	setStep: (step) => set({ step }),
	setNickname: (nickname) => set({ nickname }),
	setRole: (role) => set({ role }),
	setVerificationImageUrl: (url) => set({ verificationImageUrl: url }),
	reset: () => set({ step: 'NICKNAME', nickname: '', role: null, verificationImageUrl: null })
}))
