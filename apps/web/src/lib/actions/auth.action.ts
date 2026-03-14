'use server'

import { createClient } from '@law-fi/supabase/server'
import { CloudCog } from 'lucide-react'

/**
 * 이메일 존재 여부 확인 액션 (Email-First 분기용)
 */
export async function checkEmailExists(email: string) {
	const supabase = await createClient()

	console.log('email>>>>>>>>>>>>>>>>', email)

	// profiles 테이블에서 해당 이메일이 있는지 조회 (RLS 정책 허용 필요)
	const { data } = await supabase.from('profiles').select('id').eq('email', email).single()

	console.log('data>>>>>>>>>>>>>>>>', data)
	// 데이터가 있으면(true) -> 로그인 모드(LOGIN)로 전환
	// 데이터가 없으면(false) -> 회원가입 모드(SIGNUP)로 전환
	return { exists: !!data }
}
