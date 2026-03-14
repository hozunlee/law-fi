import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@law-fi/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // 1) First, update session via @supabase/ssr helpers to refresh cookies if needed.
  const { supabase, supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Allow next.js internal assets and specific paths
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next()
  }

  // Define public routes
  const isAuthRoute = pathname.startsWith("/login")

  if (!user && !isAuthRoute) {
    // If not authenticated and not on the login page -> redirect to login
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  if (user) {
    // If authenticated, we check their profile status
    // Note: in a real app, this should securely hit the Prisma backend / API 
    // to check the precise verification status without trusting the client fully.
    // However, in Middleware standard pattern, we do a direct Supabase query since RL is enabled,
    // or we fetch from a shared Profile table.

    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()
    
    // Condition A: Provide defaults in case profile doesn't exist yet
    const profileStatus = profile?.status || 'NOT_SUBMITTED'

    const isOnboardingRoute = pathname.startsWith("/onboarding")
    const isLoungeRoute = pathname.startsWith("/lounge")
    
    if (isAuthRoute) {
      if (profileStatus === 'NOT_SUBMITTED') {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
      if (profileStatus === 'PENDING') {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding/pending"
        return NextResponse.redirect(url)
      }
      if (profileStatus === 'APPROVED') {
        const url = request.nextUrl.clone()
        url.pathname = "/lounge"
        return NextResponse.redirect(url)
      }
    }

    if (profileStatus === 'NOT_SUBMITTED' && !isOnboardingRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }

    if (profileStatus === 'PENDING' && !pathname.startsWith('/onboarding/pending')) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding/pending"
      return NextResponse.redirect(url)
    }

    if (profileStatus === 'APPROVED' && (isOnboardingRoute || isAuthRoute)) {
      const url = request.nextUrl.clone()
      url.pathname = "/lounge"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
