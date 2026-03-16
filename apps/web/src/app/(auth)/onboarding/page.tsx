import { OnboardingWizard } from '@/components/widgets/onboarding/OnboardingWizard'

export default function OnboardingPage() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0C0C0D] px-4">
			{/* Background Aerocano Glow */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--accent-primary)/5 blur-[120px]" />

			<div className="z-10 w-full max-w-lg">
				<OnboardingWizard />
			</div>

			<footer className="absolute bottom-8 text-sm font-medium tracking-widest text-white/20 uppercase">
				Law-fi Premium Lounge
			</footer>
		</main>
	)
}
