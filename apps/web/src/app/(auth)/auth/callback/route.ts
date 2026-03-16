// apps/web/src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@law-fi/supabase/server'

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')

	const next = searchParams.get('next') ?? '/onboarding'

	if (code) {
		const supabase = await createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			return NextResponse.redirect(`${origin}${next}`)
		} else {
			// 🚨 [추가된 부분] 터미널에 진짜 에러 원인을 빨간 글씨로 출력!
			console.error('🔥 Auth Callback Error:', error.message)
		}
	}

	return NextResponse.redirect(`${origin}/login?error=InvalidAuthCode`)
}
