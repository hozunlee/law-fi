import { OnboardingWizard } from '@/components/widgets/onboarding/OnboardingWizard'

export default function OnboardingPage() {
	return (
		<main className="min-h-screen bg-[#0C0C0D] flex flex-col items-center justify-center px-4 relative overflow-hidden">
			{/* Background Aerocano Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-(--accent-primary)/5 rounded-full blur-[120px] pointer-events-none" />
			
			<div className="w-full max-w-lg z-10">
				<OnboardingWizard />
			</div>

			<footer className="absolute bottom-8 text-white/20 text-sm tracking-widest font-medium uppercase">
				Law-fi Premium Lounge
			</footer>
		</main>
	)
}
