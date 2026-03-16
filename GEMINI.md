# 핵심

1. 반드시 한글로 답변
2. 기획을 하라고하면 기획만하고 코드는 작성하지 않는다. 컨펌 후 진행한다.
3. 경로는 @ 알리아스 절대경로를 이용한다.
4.

# Law-fi Project Specification (general.md)

## 1. Project Overview

- Project Name: Law-fi
- Target Audience: 하이엔드 법조인 (변호사) 및 로스쿨 학생
- Core Concept: 익명 기반의 프리미엄 전문직 라운지
- Design Theme: Aerocano (에스프레소의 묵직함과 크레마의 부드러움 대비)

## 2. Tech Stack

- Workspace: Turborepo (Monorepo), pnpm
- Frontend (User Web): Next.js 15 (App Router), React Compiler
- Admin (Backoffice): Refine
- Styling: Tailwind CSS, shadcn/ui, Framer Motion
- State Management: TanStack Query v5 (Server), Zustand (Client)
- Backend & Database: Supabase (PostgreSQL, Auth, Storage)
- ORM: Prisma
- Validation: Zod

## 3. Data Schema & Roles

### User Roles

- ADMIN: 시스템 관리 및 사용자 인증 승인 권한
- LAWYER: 인증된 변호사
- STUDENT: 인증된 로스쿨생
- GUEST: 가입 후 인증 절차를 완료하지 않은 상태

### Verification Status

- NOT_SUBMITTED -> PENDING -> APPROVED or REJECTED

## 4. Core Workflows

### 4.1. Authentication & Onboarding

- Auth: 이메일 + 비밀번호로 로그인 ( 회원가입 시 OTP 인증)
- Step 1 (Profile):
  - 닉네임 설정 (단, 닉네임 변경은 7일에 1회로 제한).
  - 역할 선택 (LAWYER / STUDENT).
- Step 2 (Verification):
  - 역할에 따른 조건부 렌더링.
  - LAWYER: 변호사 신분증(필수) + 추가 증빙 서류(선택, 뱃지 부여용).
  - STUDENT: 학생증(필수).

### 4.2. Admin Verification

- KBA(Knowledge-Based Authentication) 및 수동 검토.
- 제출된 신분증과 변협/학교 정보를 대조 확인.
- 승인 액션:
  1. 유저 Status를 APPROVED로 변경.
  2. Role에 맞는 태그(예: 대형, 파트너) 수동 부여.
  3. 보안을 위해 Supabase Storage에 업로드된 증빙 이미지를 즉시 Hard Delete.

## 5. Security & Development Principles

- Single Source of Truth: Prisma 스키마를 모든 데이터 구조의 기준으로 삼음.
- RLS (Row Level Security): Supabase DB 접근 시 유저 Role 기반의 철저한 격리 (본인 및 ADMIN만 Verification 데이터 접근 가능).
- UI Component: 하드코딩된 색상값 대신 `design-system.md`에 정의된 CSS Variable(Semantic Tokens)만 사용.
- Animation: 화면 전환 및 모달 팝업 시 부드러운 Fade/Slide 적용(Framer Motion).

# Law-fi Architecture Specification (fsd-architecture.md)

## 1. System Overview

- Architecture: Turborepo Monorepo + Simplified Feature-Sliced Design (FSD)
- Framework: Next.js 15 (App Router)
- Core Principle: "UI Primitives in Packages, Business Logic in Apps, Entities in Prisma."

## 2. Directory Structure & Layer Rules

### 2.1. Shared Packages (The Foundation)

모든 앱(`web`, `admin`)은 아래의 공용 패키지에서 자원을 import 해야 합니다. 앱 내부에서 개별적인 원시 UI나 DB 설정을 생성하는 것을 엄격히 금지합니다.

- `packages/ui`: shadcn/ui 기반의 원시 컴포넌트 모음 (e.g., Button, Input).
- `packages/config-tailwind`: 공통 디자인 시스템 (Aerocano 테마 프리셋).
- `packages/db`: Prisma 스키마 및 DB 클라이언트. 모노레포 전체의 `entities` 계층을 대체하는 단일 진실 공급원(Single Source of Truth).

### 2.2. Apps Layer (Simplified FSD)

`apps/web` 및 `apps/admin` 내부의 폴더 구조 및 역할 제약 조건입니다.

```
apps/web/
├── next.config.ts
├── package.json
├── ... (기타 설정 파일들)
│
└── src/                   # 🌟 모든 소스코드의 성역
    ├── middleware.ts      # (src 최상단에 위치)
    │
    ├── app/               # 🌐 1. 라우팅 & 서버 페칭
    │   ├── (auth)/login/
    │   └── (main)/lounge/
    │
    ├── components/        # 🧩 2. UI & 비즈니스 로직
    │   ├── features/
    │   └── widgets/
    │
    └── lib/               # 🛠️ 3. 유틸리티 & 서버 액션
        ├── actions/
```

#### A. Routing Layer: `app/**/page.tsx`

- Role: 라우팅 진입점, SEO 메타데이터 정의, 서버 사이드 데이터 페칭(Data Fetching).
- Constraint 1: 무조건 Server Component로 작성 (`"use client"` 사용 엄격히 금지).
- Constraint 2: 직접적인 UI 마크업(HTML/Tailwind)을 렌더링하지 않음. 데이터를 페칭한 뒤 `widgets` 컴포넌트의 Props로 넘겨주는 역할만 수행.

#### B. Widget Layer: `components/widgets/`

- Role: 특정 도메인이나 페이지의 레이아웃을 구성하는 조립 덩어리.
- Constraint 1: 여러 개의 `features`를 조합하고, 도메인 단위의 전역 상태(Zustand) 흐름을 관리함.
- Constraint 2: 내부에서 비즈니스 로직을 직접 구현하기보다, `features`를 배치하는 오케스트레이터 역할 수행.

#### C. Feature Layer: `components/features/`

- Role: 사용자와 직접 상호작용하는 단일 기능 단위 (e.g., NicknameForm, IdUploadButton).
- Constraint 1: 주로 Client Component (`"use client"`)로 작성.
- Constraint 2: 독립성 유지. 하나의 `feature`는 다른 `feature`를 절대 import 할 수 없음.
- Constraint 3: 데이터 변경(Mutation)이 필요할 경우, 직접 DB에 접근하지 않고 `lib/actions`의 Server Action을 호출함.

#### D. Shared Utilities: `lib/`

- `lib/actions/`: DB 데이터를 변경하는 Server Actions 집합. 파일명은 무조건 `.action.ts` 접미사를 사용.
- `lib/zod/`: 폼 입력값 및 API 페이로드 검증용 스키마.
- `lib/supabase/`: 클라이언트 및 서버용 Supabase 인스턴스 초기화 유틸리티.

## 3. Data & Dependency Flow

- 방향성: `page.tsx` (데이터 Fetch) -> `widgets` (조합) -> `features` (상호작용) -> `lib/actions` (Mutation) -> `packages/db` (영속성 저장).
- 의존성 규칙 (단방향): 하위 레이어는 상위 레이어를 import 할 수 없음. (e.g., `features`에서 `widgets` import 불가).

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
import { Button } from '@law-fi/ui/button'
import { Input } from '@law-fi/ui/input'
import { toast } from '@law-fi/ui/sonner' // Toaster는 @law-fi/ui/sonner에서 제공
```

### B. Supabase 및 유효성 검증 (`@law-fi/supabase`)

환경(클라이언트/서버/미들웨어)에 맞는 클라이언트를 선택하여 import합니다.

```tsx
// 1. Client Component에서 사용 (Browser Client)
import { createClient } from '@law-fi/supabase/client'

// 2. Server Component/Action에서 사용 (Server Client)
import { createClient } from '@law-fi/supabase/server'

// 3. Middleware에서 사용
import { updateSession } from '@law-fi/supabase/middleware'

// 4. Zod 스키마
import { emailSchema, otpSchema } from '@law-fi/supabase/zod/auth'
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
