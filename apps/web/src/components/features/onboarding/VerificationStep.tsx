'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, Upload, Loader2, FileImage } from 'lucide-react'
import { Button } from '@law-fi/ui/button'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { createClient } from '@law-fi/supabase/client'
import { submitVerification } from '@/lib/actions/onboarding.action'

interface VerificationStepProps {
	onNext: () => void
	onPrev: () => void
}

export function VerificationStep({ onNext, onPrev }: VerificationStepProps) {
	const { role, idCardFile, setIdCardFile, isSubmitting, setIsSubmitting } = useOnboardingStore()
	const [error, setError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// 기본적인 파일 검증
		if (!file.type.startsWith('image/')) {
			setError('이미지 파일만 업로드 가능합니다.')
			return
		}
		if (file.size > 10 * 1024 * 1024) {
			setError('파일 크기는 10MB 이하로 제한됩니다.')
			return
		}

		setError(null)
		setIdCardFile(file)
	}

	const handleSubmit = async () => {
		if (!idCardFile) return

		try {
			setIsSubmitting(true)
			setError(null)
			const supabase = createClient()
			const { data: { user } } = await supabase.auth.getUser()

			if (!user) {
				throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.')
			}

			// 1. Storage에 파일 업로드 (upsert하여 orphan 방지)
			const filePath = `${user.id}/id_card.jpg`
			const { error: uploadError } = await supabase.storage
				.from('verifications')
				.upload(filePath, idCardFile, { upsert: true, contentType: idCardFile.type })

			if (uploadError) {
				throw new Error('파일 업로드에 실패했습니다. 관리자에게 문의하세요.')
			}

			// 2. DB 정보 업데이트
			await submitVerification(filePath)

			// 3. 완료 뷰(Pending)로 이동
			onNext()
		} catch (err: any) {
			console.error(err)
			setError(err.message || '인증 과정 중 오류가 발생했습니다.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
						{role === 'LAWYER' ? '신분증 및 자격증 업로드' : '학생증 업로드'}
					</h1>
					<p className="text-[var(--text-secondary)]">안전하고 프라이빗한 라운지를 위해<br/>본인 인증 서류를 등록해주세요.</p>
				</div>
			</div>

			<div className="mb-8 space-y-4">
				<div
					onClick={() => !isSubmitting && fileInputRef.current?.click()}
					className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
						idCardFile
							? 'border-[var(--accent-primary)] bg-[var(--accent-foam)]'
							: 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]'
					}`}
				>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
						disabled={isSubmitting}
					/>

					{idCardFile ? (
						<>
							<div className="rounded-full bg-[var(--accent-primary)] p-4 text-white">
								<Check className="h-8 w-8" />
							</div>
							<div>
								<p className="font-bold text-[var(--text-primary)]">{idCardFile.name}</p>
								<p className="text-sm text-[var(--text-secondary)]">
									{(idCardFile.size / 1024 / 1024).toFixed(2)} MB
								</p>
							</div>
							<p className="mt-2 text-xs font-semibold text-[var(--accent-primary)]">터치하여 파일 변경</p>
						</>
					) : (
						<>
							<div className="rounded-full bg-[var(--bg-base)] p-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
								<Upload className="h-8 w-8" />
							</div>
							<div>
								<p className="font-bold text-[var(--text-primary)]">여기를 눌러 파일을 업로드하세요</p>
								<p className="mt-1 text-sm text-[var(--text-secondary)]">
									카메라로 직접 촬영하거나 갤러리에서 선택할 수 있습니다.
								</p>
							</div>
						</>
					)}
				</div>

				{error && (
					<p className="text-center text-sm font-semibold text-red-500">{error}</p>
				)}

				<div className="rounded-xl bg-[var(--bg-surface)] p-4 text-sm text-[var(--text-secondary)]">
					<p className="mb-2 flex items-start gap-2">
						<FileImage className="h-4 w-4 shrink-0 mt-0.5" />
						<span>업로드하신 정보는 확인 목적으로만 사용되며, 인증 직후 강력하게 암호화되어 안전하게 보관됩니다.</span>
					</p>
				</div>
			</div>

			<div className="flex gap-4">
				<Button
					variant="ghost"
					onClick={onPrev}
					disabled={isSubmitting}
					className="h-12 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
				>
					<ChevronLeft className="mr-1 h-4 w-4" /> 이전으로
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={!idCardFile || isSubmitting}
					className="h-12 flex-1 rounded-xl bg-[var(--accent-primary)] font-bold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-all"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> 처리중...
						</>
					) : (
						'제출하기'
					)}
				</Button>
			</div>
		</div>
	)
}
