'use server'

import { createClient } from '@law-fi/supabase/server'
import { prisma } from '@law-fi/db'

export async function checkEmailExists(email: string) {
	const profile = await prisma.profile.findUnique({
		where: { email },
		select: { id: true }
	})
	return { exists: !!profile }
}

export async function getPostLoginRedirectPath() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) return '/login'

	const profile = await prisma.profile.findUnique({
		where: { id: user.id }
	})

	if (!profile) return '/login'

	if (profile.verificationStatus === 'APPROVED') {
		return '/lounge'
	}

	return '/onboarding'
}
