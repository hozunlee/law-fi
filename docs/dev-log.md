# Law-fi Development Log

이 문서는 Law-fi 프로젝트의 초기 환경 설정 및 공유 패키지(Monorepo) 활용 가이드를 정리합니다.

## 1. 프로젝트 구조 (Monorepo)

Turborepo를 사용하여 설정을 중앙 집중화하고 여러 앱에서 재사용합니다.

```text
/packages
  /config-tailwind  - Tailwind v4 전역 디자인 토큰 및 테마 변수
  /ui               - Shadcn UI 기반의 공통 원시 컴포넌트
  /supabase         - Supabase Client (Browser/Server/Middleware) 및 Zod 스키마
/apps
  /web              - 사용자 웹 서비스 (Next.js 15 App Router)
  /admin            - 관리자 서비스 (Refine)
```

## 2. 공유 패키지 활용 및 Import 가이드

하위 앱(`apps/web`, `apps/admin`)에서 공통 기능을 가져올 때는 다음과 같은 규약에 따라 `@law-fi/*` 스코프를 사용합니다.

### A. UI 컴포넌트 (`@law-fi/ui`)
원시 UI 컴포넌트는 개별 파일 경로로 import하여 트리쉐이킹을 최적화합니다.

```tsx
import { Button } from "@law-fi/ui/button"
import { Input } from "@law-fi/ui/input"
import { toast } from "@law-fi/ui/sonner" // Toaster는 @law-fi/ui/sonner에서 제공
```

### B. Supabase 및 유효성 검증 (`@law-fi/supabase`)
환경(클라이언트/서버/미들웨어)에 맞는 클라이언트를 선택하여 import합니다.

```tsx
// 1. Client Component에서 사용 (Browser Client)
import { createClient } from "@law-fi/supabase/client"

// 2. Server Component/Action에서 사용 (Server Client)
import { createClient } from "@law-fi/supabase/server"

// 3. Middleware에서 사용
import { updateSession } from "@law-fi/supabase/middleware"

// 4. Zod 스키마
import { emailSchema, otpSchema } from "@law-fi/supabase/zod/auth"
```

### C. 디자인 시스템 및 스타일 (`@law-fi/config-tailwind`)
디자인 시스템에서 정의된 CSS 변수(Semantic Tokens)는 Tailwind 클래스나 `var()` 함수로 사용합니다.

- **Tailwind 클래스**: `bg-[var(--bg-base)]`, `text-[var(--text-primary)]`
- **전역 CSS 적용**: `apps/web/src/app/globals.css`에서 `@import "@law-fi/config-tailwind/theme.css";`를 호출하여 적용되어 있습니다.

## 3. 개발 워크플로우

1. **새로운 UI 컴포넌트 추가**: `packages/ui` 내부에서 생성하고 `package.json`의 `exports`에 경로를 등록합니다.
2. **패키지 설치**: 루트 디렉토리 또는 각 앱 폴더에서 `pnpm install`을 실행합니다.
3. **환경 변수**:
   - `apps/web/.env.local`에 Supabase URL 및 Anon Key 설정이 필요합니다.
   - 빌드 및 실행을 위해 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 필수로 포함해야 합니다.

## 4. 디렉토리 규칙 (`Simplified FSD`)

`apps/web` 내부에서는 다음과 같은 구조를 유지합니다.

- `src/app/**`: 라우팅 및 서버 데이터 페칭 (`page.tsx`)
- `src/components/widgets/**`: 큰 단위의 조립 컴포넌트
- `src/components/features/**`: 독립적인 비즈니스 기능 단위 (Client Component 권장)
- `src/lib/actions/**`: 서버 액션 (`*.action.ts`)
