# Post-Login Routing Implementation Plan

## Goal Description
Implement conditional routing after login. Instead of always sending the user to `/lounge`, verify their onboarding progress using Prisma (Single Source of Truth) and route them to their pending step (`/onboarding` or `/lounge`).

## Proposed Architecture

### 1. Auth Action (`apps/web/src/lib/actions/auth.action.ts`)
- **[NEW] `getPostLoginRedirectPath()`**: 로그인 성공 후 `LoginForm.tsx`에서 호출하는 Server Action.
- Prisma로 현재 유저의 Profile 조회 후 아래 로직 적용:

```
APPROVED → /lounge
그 외 전부(NOT_SUBMITTED, PENDING, REJECTED) → /onboarding
```

> [!NOTE]
> 원래 플랜의 세분화된 조건(role별 분기)은 불필요. `/onboarding` 진입 후 step 결정은 onboarding page의 역할이다.
> `REJECTED` 케이스: 재제출을 위해 `/onboarding`(VERIFICATION step)으로 진입.

### 2. Onboarding Page (`apps/web/src/app/(auth)/onboarding/page.tsx`)
- Server Component. 렌더 전 Prisma로 Profile 조회.
- `initialStep` 계산 로직:

```
nickname 없음(GUEST) → 'NICKNAME'
nickname 있고 verificationStatus === NOT_SUBMITTED | REJECTED → 'VERIFICATION'
verificationStatus === PENDING → 'PENDING'
```

- `<OnboardingWizard initialStep={initialStep} />` 로 전달.

### 3. Onboarding Wizard (`apps/web/src/components/widgets/onboarding/OnboardingWizard.tsx`)
- `initialStep: OnboardingStep` prop 추가.
- **`step` 상태를 Zustand에서 제거하고 내부 `useState(initialStep)`으로 관리.**

> [!IMPORTANT]
> 기존 "Synchronize into Zustand on mount" 방식은 플리커를 유발한다.
> Zustand `step` 기본값('NICKNAME')으로 한 프레임 렌더 후 useEffect로 교정되면 AnimatePresence transition이 발생.
> `useState(initialStep)`은 prop 값으로 즉시 초기화되므로 플리커 없음.
> Zustand(`useOnboardingStore`)는 nickname/role/file 등 form 데이터 전용으로 유지.

### 4. Zustand Store (`apps/web/src/store/useOnboardingStore.ts`)
- `step`, `setStep` 제거.
- `OnboardingStep` 타입은 store에서 별도 export 유지 또는 별도 파일로 분리.

### 5. LoginForm (`apps/web/src/components/features/auth/LoginForm.tsx`)
- 48번 줄 주석 제거 (미들웨어는 현재 존재하지 않음).
- 하드코딩된 `router.push('/lounge')` 교체:

```ts
const redirectUrl = await getPostLoginRedirectPath()
router.push(redirectUrl)
```

---

## 이후 필요 작업 (현재 범위 외)

> [!WARNING]
> 현재 `apps/web/middleware.ts`가 존재하지 않아 `/lounge`를 직접 URL 입력으로 접근 가능.
> 이 플랜 완료 후 미들웨어를 추가하여 미인증 유저 및 미승인 유저의 직접 접근을 차단해야 한다.

---

## Verification Plan
1. `pnpm dev` 실행.
2. `GUEST / NOT_SUBMITTED` 계정 로그인 → NICKNAME step 렌더 확인.
3. `LAWYER / NOT_SUBMITTED` 계정 로그인 → VERIFICATION step 직접 렌더, 플리커 없음 확인.
4. `PENDING` 계정 로그인 → PENDING step 렌더 확인.
5. `REJECTED` 계정 로그인 → VERIFICATION step 렌더 확인.
6. `APPROVED` 계정 로그인 → `/lounge` 이동 확인.
