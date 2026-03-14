# front-end login

# Frontend Auth & Routing Flow (auth-flow.md)

## 1. Overview

- Target Path: `apps/web/app/(auth)/login/page.tsx`
- Component: `components/features/AuthForm.tsx` (Client Component)
- Auth Method: Supabase Auth Email OTP (Passwordless)

## 2. Component State (Local State)

컴포넌트 내에서 관리해야 할 필수 상태 정의.

- `step`: 'EMAIL_INPUT' | 'OTP_INPUT' (현재 화면 단계)
- `email`: string (사용자 입력 이메일)
- `isLoading`: boolean (API 호출 중 버튼 비활성화 및 스피너 렌더링용)
- `cooldown`: number (초기값 0, OTP 재발송 방지용 60초 타이머)
- `error`: string | null (에러 메시지 표시용)

## 3. Workflow & Validation

### Step 1: Email Request (EMAIL_INPUT)

1. Input: 이메일 입력.
2. Validation (Zod): `z.string().email("유효한 이메일을 입력해주세요.")`
3. Action: `supabase.auth.signInWithOtp({ email })` 비동기 호출.
4. UI Update:
   - 호출 성공 시 `step`을 'OTP_INPUT'으로 변경.
   - `cooldown`을 60으로 설정하고 1초마다 감소시킴.
   - 하단 Toast 알림: "인증번호가 발송되었습니다."

### Step 2: OTP Verification (OTP_INPUT)

1. Input: 6자리 숫자 입력.
2. Validation (Zod): `z.string().length(6, "6자리 숫자를 입력해주세요.")`
3. Action: `supabase.auth.verifyOtp({ email, token: otp, type: 'email' })` 비동기 호출.
4. UI Update:
   - 에러 시 `error` 상태 업데이트.
   - 성공 시 Auth 세션이 브라우저에 저장됨. 라우팅 로직으로 이동.

## 4. Post-Login Routing (Middleware / Server Action)

세션 획득 직후, 유저의 DB 프로필 상태에 따른 강제 라우팅(리다이렉트) 규칙. 플리커링(Flickering) 방지를 위해 가급적 서버 단(`middleware.ts` 또는 서버 컴포넌트)에서 처리.

- Condition A: `profile.status === 'NOT_SUBMITTED'` (또는 프로필 없음)
  - Action: Redirect to `/onboarding` (닉네임 설정 및 신분증 업로드 화면)
- Condition B: `profile.status === 'PENDING'`
  - Action: Redirect to `/onboarding/pending` (관리자 심사 대기 화면)
- Condition C: `profile.status === 'APPROVED'`
  - Action: Redirect to `/lounge` (메인 커뮤니티 화면)

## 5. UI/UX Constraints

- Transitions: `step` 전환 시 Framer Motion을 사용하여 부드러운 Crossfade 또는 Slide 적용.
- Disabled States:
  - `isLoading === true`일 때 Submit 버튼 비활성화.
  - `cooldown > 0`일 때 '인증번호 재발송' 버튼 비활성화 및 남은 시간(예: "00:59") 렌더링.
- Styling: `design-system.md`의 Semantic Tokens 엄격 준수.

---

# Law-fi Email-First Auth Workflow Spec

## 1. Component Structure

- Wrapper: `components/features/auth/AuthContainer.tsx` (Manages active step state)
- Child 1: `EmailCheckForm.tsx` (Only captures email)
- Child 2: `LoginForm.tsx` (Password input for existing users)
- Child 3: `SignUpForm.tsx` (Password, Confirm, Terms for new users)

## 2. State Machine (in AuthContainer)

- `email`: string | null (Captured in Step 1, passed to Step 2)
- `authMode`: 'CHECK_EMAIL' | 'LOGIN' | 'SIGNUP' (Initial: 'CHECK_EMAIL')
- `isLoading`: boolean (For button states)

## 3. Workflow & Logic

### Step 1: CHECK_EMAIL

- Input: Email (Zod validation: `z.string().email()`)
- Action: Call Server Action `checkIfEmailExists(email)`.
- Transition:
  - If `true` -> Set `authMode` to 'LOGIN'.
  - If `false` -> Set `authMode` to 'SIGNUP'.

### Step 2-A: LOGIN (Existing User)

- Inputs: Password.
- UI: Show `email` as read-only.
- Action: `supabase.auth.signInWithPassword({ email, password })`.
- On Success: Redirect to `/lounge` (or `/onboarding` if profile setup is incomplete).

### Step 2-B: SIGNUP (New User)

- Inputs: Password, Confirm Password, Terms Checkbox.
- Validation (Zod): `password === confirmPassword`, `terms === true`.
- Action: `supabase.auth.signUp({ email, password })`.
- On Success: Redirect to `/onboarding` (Phase 2 onboarding starts here).

## 4. UI/UX Constraints

- Apply Framer Motion `AnimatePresence` for smooth crossfade between `authMode` transitions.
- Follow `design-system.md` for dark mode semantic tokens (Espresso background, white primary buttons).
- Layout: 50/50 split. Left side is the form, Right side is a placeholder div for future graphics.
- Provide `<- Use a different email` button in LOGIN and SIGNUP modes to reset `authMode` to 'CHECK_EMAIL'.
