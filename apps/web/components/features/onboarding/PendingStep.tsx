'use client'

import { motion } from 'framer-motion'
import { Button } from '@law-fi/ui/button'
import { CheckCircle2, Home } from 'lucide-react'
import Link from 'next/link'

export function PendingStep() {
	return (
		<div className="w-full max-w-md mx-auto text-center">
			<div className="flex justify-center mb-8">
				<div className="p-4 bg-green-500/20 text-green-400 rounded-full">
					<CheckCircle2 className="w-16 h-16" />
				</div>
			</div>

			<h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
			<p className="text-white/60 mb-8 leading-relaxed">
				성공적으로 인증 신청이 완료되었습니다.<br />
				관리자 승인 후 모든 기능을 이용하실 수 있습니다.<br />
				(영업일 기준 1~3일 소요)
			</p>

			<Link href="/lounge">
				<Button className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold rounded-xl">
					<Home className="w-4 h-4 mr-2" /> Go to Lounge
				</Button>
			</Link>
		</div>
	)
}
