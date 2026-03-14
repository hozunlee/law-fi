import { AuthContainer } from '@/components/features/auth/AuthContainer'
import { Scale, Fingerprint } from 'lucide-react'

export function LoginWidget() {
	return (
		<div className="flex min-h-screen w-full flex-col bg-[#0C0C0D] text-white selection:bg-(--accent-primary) selection:text-white lg:flex-row">
			{/* Left Side: Login Form */}
			<div className="relative z-10 flex flex-1 flex-col justify-center border-r border-white/5 px-8 py-12 shadow-2xl sm:px-16 lg:px-24 xl:px-32">
				<div className="mb-10 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--accent-primary) text-white shadow-(--accent-primary)/20 shadow-lg">
						<Scale className="h-6 w-6 stroke-[1.5]" />
					</div>
					<h2 className="text-2xl font-bold tracking-tight text-white">Law-fi</h2>
				</div>

				<div className="mx-auto w-full max-w-md lg:mx-0">
					<AuthContainer />
				</div>

				<div className="mt-auto pt-10 text-xs text-white/40">
					© 2026 Law-fi International. All rights reserved. Secure terminal session active.
				</div>
			</div>

			{/* Right Side: Decorative Graphic */}
			<div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-[#060606] lg:flex">
				{/* Abstract Background Graphic */}
				<div className="absolute inset-0 bg-linear-to-br from-(--accent-primary)/20 via-[#0C0C0D] to-[#0C0C0D]"></div>

				<div className="relative z-10 w-full max-w-lg p-12 text-center">
					{/* Decorative abstract elements */}
					<div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-(--accent-primary)/10 blur-3xl"></div>
					<div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-(--accent-primary)/5 blur-3xl"></div>

					<div className="relative rounded-2xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-md">
						<div className="mb-8 flex justify-center">
							<div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-tr from-(--accent-primary) to-(--accent-primary)/40 shadow-[0_0_40px_rgba(194,114,54,0.3)]">
								<Fingerprint className="h-12 w-12 stroke-1 text-white" />
							</div>
						</div>
						<h3 className="mb-4 text-3xl font-bold tracking-tight text-white">
							Enterprise Grade Security
						</h3>
						<p className="text-lg leading-relaxed text-white/60">
							Your legal documents and correspondence are encrypted using industry-standard AES-256
							protocols. Experience the future of legal tech with peace of mind.
						</p>

						<div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
							<div className="text-center">
								<div className="text-2xl font-bold text-white">99.9%</div>
								<div className="mt-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
									Uptime
								</div>
							</div>
							<div className="border-x border-white/10 text-center">
								<div className="text-2xl font-bold text-white">256-bit</div>
								<div className="mt-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
									Encryption
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-white">2FA</div>
								<div className="mt-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
									Ready
								</div>
							</div>
						</div>
						<div className="mt-12 max-w-sm">
							<img
								alt="Minimalist legal sculpture in a dark modern office"
								className="rounded-xl opacity-40 mix-blend-luminosity shadow-2xl grayscale"
								data-alt="Abstract dark modern office architectural detail with shadows"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv1y98ruLx5i29u5PLwtqCOJnGHvproKdrROIjPg9_6XrQ8YVdvGu6BJmYcOO8tSMr4BkE-JQswnLTCspH1zy_L6R9uBFYpMXyNJWPmltjFh1YPQJ4itRN1p8xA6Z5AtuP7wv-8_VYqJC6bEqj6TlA2mEKiedfa269tM4ccurpjqp-2rCX8wNlE3-xv1gIebJEd5uEhWPDJZ-00ogKB204vR_QCv26j3-03hW0aCaB4UyW2HGd8UVuQPxj4CBH2WpoJ0P3TYzGL6g"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
