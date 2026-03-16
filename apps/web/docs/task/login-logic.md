# Law-fi Login Flow Logic

이 문서는 `apps/web/src/app/(auth)/login/page.tsx` 진입점부터 시작되는 Law-fi의 로그인 및 회원가입 흐름을 정의합니다.

## 1. 진입점: `/login` 페이지
- 경로: `apps/web/src/app/(auth)/login/page.tsx`
- 역할: 단순히 서버 컴포넌트 메타데이터를 설정하고 클라이언트 컴포넌트인 `<LoginWidget />`을 렌더링합니다.

## 2. 위젯 스캐폴딩: `LoginWidget`
- 경로: `apps/web/components/widgets/auth/LoginWidget.tsx`
- 역할: 페이지의 좌우 레이아웃과 디자인 디테일(로고, 우측 장식 그래픽 등)을 담당합니다.
- 내부에 인증 핵심 로직 컴포넌트인 `<AuthContainer />`를 포함합니다.

## 3. 인증 흐름 컨테이너: `AuthContainer`
- 경로: `apps/web/components/features/auth/AuthContainer.tsx`
- 역할: 세 가지 인증 모드 상태(`AuthMode`)를 관리하고 화면을 컴포넌트 단위로 전환합니다.
  - 모드: `CHECK_EMAIL` -> `LOGIN` 또는 `SIGNUP`
- 시작 시 이메일 확인 모드인 `<EmailCheckForm />`을 보여줍니다.

## 4. 이메일 확인: `EmailCheckForm`
- 역할: 사용자로부터 이메일을 입력받아 기존 회원인지 여부를 검사합니다.
- 동작 로직:
  1. 클라이언트 폼 유효성 검사 (Zod Schema)
  2. 서버 액션 호출 (`checkEmailExists`)
     - 경로: `apps/web/lib/actions/auth.action.ts`
     - Prisma를 이용해 `profile` 테이블에서 해당 이메일이 존재하는지 직접 쿼리(`findUnique`)
  3. 결과에 따른 분기:
     - 회원이면 (exists: true) -> `LOGIN` 모드로 전환하여 `<LoginForm />` 렌더링
     - 비회원이면 (exists: false) -> `SIGNUP` 모드로 전환하여 `<SignUpForm />` 렌더링

## 5. 기존 회원 로그인: `LoginForm`
- 역할: 확인된 이메일에 대해 비밀번호를 입력받아 로그인을 수행합니다.
- 동작 로직:
  1. 클라이언트 단에서 비밀번호 유효성 검증
  2. Supabase Browser Client 호출: `supabase.auth.signInWithPassword({ email, password })`
  3. 로그인 성공 시 -> `router.push('/lounge')` 호출
     - (참고: 라우터 이동 후, Next.js 미들웨어나 내부 로직에 따라 회원의 프로필 인증 상태 처리 여부가 결정됨)

## 6. 신규 회원 가입: `SignUpForm`
- 역할: 새로운 이메일에 대한 계정 생성 및 이용약관 동의 완료 후 인증 메일을 발송합니다.
- 동작 로직:
  1. 비밀번호, 비밀번호 재입력 일치 검증 및 이용약관 체크박스 검증
  2. Supabase Browser Client 호출: `supabase.auth.signUp({ email, password, options: { emailRedirectTo: '.../auth/callback' } })`
  3. 회원가입 API 성공 시 -> 화면 상태를 `VERIFY_OTP` 로 변경하여 사용자에게 이메일 확인 안내(UI: "Confirm your email") 띄움

## 7. 이메일 인증 콜백: `/auth/callback`
- 경로: `apps/web/src/app/(auth)/auth/callback/route.ts`
- 역할: 사용자가 이메일에 포함된 링크를 클릭했을 때 인증 세션을 처리합니다.
- 동작 로직:
  1. URL의 searchParams에서 `code` 값을 추출
  2. Supabase Server Client 호출: `supabase.auth.exchangeCodeForSession(code)`
  3. 세션 획득 완료 후 기본적으로 `/onboarding` 라우트로 리다이렉션 (`next` 파라미터가 있으면 해당 경로로)
  4. (인증 실패 또는 코드 누락 시 `/login?error=InvalidAuthCode` 로 리다이렉트)
