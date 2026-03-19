import type { AuthProvider } from '@refinedev/core'
import { supabase } from '../lib/supabaseClient'

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { success: false, error }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profileError) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: { name: 'Profile Error', message: `프로필 조회 실패: ${profileError.message}` },
      }
    }

    if (!profile) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: { name: 'Not Found', message: '프로필이 존재하지 않습니다. Supabase 대시보드에서 profiles 테이블을 확인하세요.' },
      }
    }

    if (profile.role !== 'ADMIN') {
      await supabase.auth.signOut()
      return {
        success: false,
        error: { name: 'Access Denied', message: `관리자 권한이 없습니다. (현재 role: ${profile.role})` },
      }
    }

    return { success: true, redirectTo: '/' }
  },

  logout: async () => {
    await supabase.auth.signOut()
    return { success: true, redirectTo: '/login' }
  },

  // getUser()로 서버에서 JWT 검증 (getSession()은 로컬 캐시 기반)
  check: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { authenticated: false, logout: true, redirectTo: '/login' }
    }

    return { authenticated: true }
  },

  onError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      await supabase.auth.signOut()
      return { logout: true, redirectTo: '/login' }
    }
    return {}
  },

  getIdentity: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) return { id: user.id, name: user.email }
    return null
  },
}
