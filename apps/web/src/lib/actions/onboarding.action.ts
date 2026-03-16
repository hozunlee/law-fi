'use server'

import { createClient } from '@law-fi/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 닉네임 중복 확인
 */
export async function checkNicknameDuplicate(nickname: string) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('profiles')
		.select('nickname')
		.eq('nickname', nickname)
		.maybeSingle()

	if (error) {
		console.error('Error checking nickname duplicate:', error)
		throw new Error('닉네임 확인 중 오류가 발생했습니다.')
	}

	return !!data
}

/**
 * 프로필 기본 설정 업데이트 (닉네임, 역할)
 */
export async function updateProfileBasic(data: { nickname: string; role: 'LAWYER' | 'STUDENT' }) {
	const supabase = await createClient()

	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser()

	if (userError || !user) {
		throw new Error('인증되지 않은 사용자입니다.')
	}

	const { error } = await supabase
		.from('profiles')
		.update({
			nickname: data.nickname,
			role: data.role,
			updatedAt: new Date().toISOString()
		})
		.eq('id', user.id)

	if (error) {
		console.error('Error updating profile basic:', error)
		throw new Error('프로필 업데이트 중 오류가 발생했습니다.')
	}

	revalidatePath('/onboarding')
	return { success: true }
}

/**
 * 신분증 파일 업로드 및 검증 상태 업데이트
 */
export async function submitVerification(filePath: string) {
	const supabase = await createClient()

	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser()

	if (userError || !user) {
		throw new Error('인증되지 않은 사용자입니다.')
	}

	const { error } = await supabase
		.from('profiles')
		.update({
			verificationStatus: 'PENDING',
			updatedAt: new Date().toISOString()
		})
		.eq('id', user.id)

	if (error) {
		console.error('Error submitting verification:', error)
		throw new Error('인증 제출 중 오류가 발생했습니다.')
	}

	revalidatePath('/onboarding')
	return { success: true }
}
