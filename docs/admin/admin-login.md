[Module: Admin Auth Flow]

## 전제 조건: 패키지 설치

admin 앱은 현재 빈 Vite+React 스캐폴드. 아래 패키지 설치 후 구현 시작.

```bash
cd apps/admin
pnpm add @refinedev/core @refinedev/react-router-v6 react-router-dom @law-fi/supabase
```

> [!NOTE]
> Admin SPA(Vite)는 브라우저에서 실행되므로 Prisma(Node.js 서버 전용) 사용 불가.
> `authProvider` 내 DB 조회는 예외적으로 Supabase SDK(`supabase.from("profiles")`)를 직접 사용한다.
> 단, Supabase RLS 정책이 적용된 상태여야 한다.

---

## Auth Flow

### 1. 계정 생성 (수동)
어드민 앱에는 회원가입 화면 없음.
Supabase 대시보드에서 이메일 발급 → `public.profiles`에서 해당 유저의 role을 `ADMIN`으로 수동 업데이트.

### 2. 로그인 (Gatekeeper)
어드민 웹(`/login`)에서 Email + Password 입력 → Supabase Auth로 세션 획득.

### 3. 권한 검증 (Bouncer)
세션 획득 직후 `profiles` 테이블을 조회해 `role === 'ADMIN'` 확인.
불일치 시 즉시 `signOut()` 처리 후 에러 반환.

---

## 구현: Refine authProvider

Refine은 인증을 `authProvider` 단일 객체로 관리. 상태 관리 라이브러리 없이 이 객체 하나로 앱 전체 라우팅 가드 동작.

파일 위치: `apps/admin/src/providers/authProvider.ts`

```typescript
import { AuthBindings } from "@refinedev/core"
import { createBrowserClient } from "@law-fi/supabase/client"

const supabase = createBrowserClient()

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { success: false, error }

    // role 검증 (DB 1회 조회)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (profile?.role !== "ADMIN") {
      await supabase.auth.signOut()
      return {
        success: false,
        error: { name: "Access Denied", message: "관리자 권한이 없습니다." },
      }
    }

    return { success: true, redirectTo: "/" }
  },

  logout: async () => {
    await supabase.auth.signOut()
    return { success: true, redirectTo: "/login" }
  },

  // getUser()는 서버에서 JWT를 검증함. getSession()은 로컬 캐시 기반으로 위조 가능성 있음.
  // 어드민 민감도 상 getUser()를 사용하되, 매 라우팅마다 네트워크 요청이 발생함을 감안.
  check: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { authenticated: false, logout: true, redirectTo: "/login" }
    }
    return { authenticated: true }
  },

  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      await supabase.auth.signOut()
      return { logout: true, redirectTo: "/login" }
    }
    return {}
  },

  getIdentity: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return { id: user.id, name: user.email }
    return null
  },
}
```

> [!NOTE]
> **`check()`의 트레이드오프**: 현재 구현은 세션(유저) 존재 여부만 검증하고 role을 재확인하지 않는다.
> DB에서 ADMIN → GUEST로 변경되어도 기존 세션이 살아있으면 계속 접근 가능.
> 소수 어드민 운영 특성상 이는 허용 가능한 수준으로 판단. 필요 시 `check()` 내에 role 재조회 추가 가능.
