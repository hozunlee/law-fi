'use server'

import { prisma } from '@law-fi/db'

export async function checkEmailExists(email: string) {
	// 🌟 이제 Supabase Client가 아닌 Prisma로 직접 DB 조회!
	const profile = await prisma.profile.findUnique({
		where: { email },
		select: { id: true }
	})

	return { exists: !!profile }
}
