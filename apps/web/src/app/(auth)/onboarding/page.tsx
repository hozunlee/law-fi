import { OnboardingWizard } from '@/components/widgets/onboarding/OnboardingWizard'
import { createClient } from '@law-fi/supabase/server'
import { prisma } from '@law-fi/db'
import { redirect } from 'next/navigation'
import type { OnboardingStep } from '@/store/useOnboardingStore'

export default async function OnboardingPage() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) {
		redirect('/login')
	}

	const profile = await prisma.profile.findUnique({
		where: { id: user.id }
	})

	if (!profile) {
		redirect('/login')
	}

	let initialStep: OnboardingStep = 'NICKNAME'
	
	if (profile.nickname && (profile.verificationStatus === 'NOT_SUBMITTED' || profile.verificationStatus === 'REJECTED')) {
		initialStep = 'VERIFICATION'
	} else if (profile.verificationStatus === 'PENDING') {
		initialStep = 'PENDING'
	}

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0C0C0D] px-4">
			{/* Background Aerocano Glow */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--accent-primary)/5 blur-[120px]" />

			<div className="z-10 w-full max-w-lg">
				<OnboardingWizard initialStep={initialStep} />
			</div>

			<footer className="absolute bottom-8 text-sm font-medium tracking-widest text-white/20 uppercase">
				Law-fi Premium Lounge
			</footer>
		</main>
	)
}
