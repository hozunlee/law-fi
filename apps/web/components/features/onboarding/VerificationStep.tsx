'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@law-fi/ui/button'
import { useOnboardingStore } from '../../widgets/onboarding/useOnboardingStore'
import { updateProfileBasic, submitVerification } from '@/lib/actions/onboarding.action'
import { createClient } from '@law-fi/supabase/client'
import { Upload, FileCheck, Loader2, ChevronLeft } from 'lucide-react'
import { toast } from '@law-fi/ui/sonner'

export function VerificationStep() {
	const { nickname, role, setStep } = useOnboardingStore()
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			setFile(selectedFile)
			const url = URL.createObjectURL(selectedFile)
			setPreviewUrl(url)
		}
	}

	const handleSubmit = async () => {
		if (!file || !role) return

		setIsSubmitting(true)
		try {
			// 1. 프로필 기본 정보 저장
			await updateProfileBasic({ nickname, role })

			// 2. 파일 업로드 (Supabase Storage)
			const supabase = createClient()
			const {
				data: { user }
			} = await supabase.auth.getUser()
			if (!user) throw new Error('User not found')

			const fileExt = file.name.split('.').pop()
			const fileName = `${user.id}/${Date.now()}.${fileExt}`
			const filePath = `verifications/${fileName}`

			const { error: uploadError } = await supabase.storage
				.from('verifications')
				.upload(filePath, file)

			if (uploadError) throw uploadError

			// 3. 인증 제출 처리 (DB 상태 업데이트)
			await submitVerification(filePath)

			toast.success('인증 신청이 완료되었습니다.')
			setStep('PENDING')
		} catch (error) {
			console.error('Verification error:', error)
			toast.error('인증 처리 중 오류가 발생했습니다.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Verification</h1>
				<p className="text-white/60">
					{role === 'LAWYER' ? '변호사 신분증' : '학생증'}을 업로드해주세요.
				</p>
			</div>

			<div className="mb-8">
				<label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 rounded-2xl cursor-pointer overflow-hidden transition-all">
					{previewUrl ? (
						<img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
					) : (
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							<div className="p-4 bg-white/10 rounded-full mb-4 group-hover:bg-white group-hover:text-black transition-all">
								<Upload className="w-8 h-8" />
							</div>
							<p className="text-sm text-white/60">
								<span className="font-bold text-white">클릭하여 이미지 업로드</span>
							</p>
							<p className="text-xs text-white/30 mt-1">JPG, PNG up to 10MB</p>
						</div>
					)}
					<input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
				</label>
			</div>

			<div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8 flex items-start gap-3">
				<FileCheck className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
				<p className="text-xs text-white/40 leading-relaxed">
					제출하신 증빙 자료는 실명 및 자격 확인용으로만 사용되며, 확인 즉시 시스템에서 영구적으로
					삭제됩니다.
				</p>
			</div>

			<div className="flex gap-4">
				<Button
					variant="ghost"
					disabled={isSubmitting}
					onClick={() => setStep('ROLE')}
					className="h-12 text-white/50 hover:text-white"
				>
					<ChevronLeft className="w-4 h-4 mr-1" /> Back
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={!file || isSubmitting}
					className="flex-1 h-12 bg-white text-black hover:bg-white/90 font-bold rounded-xl"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
						</>
					) : (
						'Submit for Review'
					)}
				</Button>
			</div>
		</div>
	)
}
