# ⚖️ Law-fi (로파이)

> **"Clarity & Stealth"**
> 법조인 및 로스쿨 학생을 위한 익명 기반 전문직 라운지.

Law-fi는 복잡한 인증 절차를 우아하게 풀어내고, 철저한 보안(RLS)과 익명성을 보장하는 프라이빗 커뮤니티 플랫폼입니다.
에스프레소의 묵직함과 쨍한 구리빛(Vibrant Copper)의 세련됨을 담은 UI/UX를 제공합니다.

---

## 🚀 Tech Stack

- **Workspace:** pnpm, Turborepo (Monorepo)
- **Frontend (Web):** Next.js 15 (App Router), React Compiler
- **Backend / Auth:** Supabase (PostgreSQL, Email/OTP Auth, Storage)
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion
- **State Management:** Zustand (Client UI State)
- **Validation:** Zod

---

## 🏗️ Workspace Structure

본 프로젝트는 **"공통 설정은 패키지에, 비즈니스 로직은 앱에"**라는 원칙을 따르는 모노레포 구조로 설계되었습니다.

```text
law-fi/
├── apps/
│   ├── web/                # 메인 유저 서비스 (Next.js)
│   └── admin/              # 백오피스 관리자 페이지 (Vite + Refine)
│
├── packages/
│   ├── config-tailwind/    # 전역 디자인 시스템 (에어로카노 & 골든 구리 테마)
│   ├── db/                 # Prisma 스키마 (단일 진실 공급원) 및 DB 클라이언트
│   ├── supabase/           # Supabase 클라이언트 (SSR 지원) 및 Zod 스키마
│   ├── ui/                 # shadcn/ui 기반 원시 컴포넌트 모음
│   ├── eslint-config/      # 공통 Lint 설정
│   └── typescript-config/  # 공통 TS 설정
```

## 📐 Architecture Rules (Simplified FSD)

apps/web 내부의 프론트엔드 코드는 간소화된 FSD(Feature-Sliced Design) 아키텍처를 엄격하게 준수합니다.

app/ (Routing Layer): URL 라우팅 및 서버 사이드 데이터 페칭(Server Components)만 담당합니다. UI를 직접 그리지 않습니다.

components/widgets/ (Assembler): 여러 개의 Feature를 조합하여 도메인 단위의 레이아웃과 상태 흐름을 관리합니다.

components/features/ (The Doer): 사용자와 직접 상호작용하는 단일 기능 단위(Client Components)입니다. 다른 Feature를 직접 import 하지 않습니다.

lib/actions/ (Server Actions): DB Mutation 등 데이터를 변경하는 서버 로직은 무조건 이곳에 격리합니다. DB 접근은 오직 Prisma로만 수행합니다.
