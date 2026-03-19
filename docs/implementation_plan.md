# Identity Verification Upload Implementation Plan

## Goal Description
Implement a secure and personalized identity verification photo upload system using Supabase Storage and Prisma. The system will allow users to upload their ID/documents during onboarding, which admins can later review.

## User Review Required
> [!IMPORTANT]
> The database schema changes require regenerating the Prisma client and pushing to the DB. Also, the Supabase Storage bucket (`verifications`) needs to be created manually or via migrations if not already present.

## Proposed Architecture

### 1. Supabase Storage & Folder Structure
- **Bucket**: `verifications` (Private bucket)
- **Folder Structure**: `[auth.uid()]/[filename]` (e.g., `123e4567.../id_card.jpg`)
- **Benefit**: Personalization and security. By partitioning uploads into user-specific folders matching their `auth.uid()`, we can easily enforce Row Level Security (RLS) policies.
- **RLS Policies**:
  - `INSERT`: `(storage.foldername(name))[1] = auth.uid()::text`
  - `SELECT`: `(storage.foldername(name))[1] = auth.uid()::text` OR user is an admin.
- **재업로드 처리**: 동일 경로(`verifications/${uid}/id_card.jpg`)로 덮어쓰기(upsert)하여 orphan 파일 방지.

### 1-A. Image Optimization (WebP 변환)
- Supabase Storage의 **Image Transformation** 기능을 활용합니다.
- 사용자가 원본 파일(JPEG, PNG 등)을 그대로 업로드하더라도 클라이언트나 Edge Function 수준의 별도 변환 추가 작업이 필요하지 않습니다.
- 어드민 등이 이미지를 조회할 때, `createSignedUrl(path, 3600, { transform: { width: 800 } })`와 같이 생성 옵션에 `transform`을 추가하기만 하면, Supabase 측에서 브라우저 지원 여부(Chrome 등)에 맞춰 런타임에 **자동으로 WebP 형식으로 최적화 및 변환**하여 응답합니다.

### 2. Database Schema (Prisma)
We will expand the existing `Profile` model in `packages/db/prisma/schema.prisma` to track the uploaded document.

```prisma
model Profile {
  // ... existing fields ...
  verificationImagePath   String?    // Storage path (URL 아님). Signed URL은 조회 시 서버에서 생성.
  verificationSubmittedAt DateTime?
}
```

> [!IMPORTANT]
> `verificationImageUrl`이 아닌 `verificationImagePath`로 필드명을 정의한다.
> Private bucket 파일은 공개 URL이 없으며 Signed URL은 만료 시간이 있어 DB에 저장하기 부적절하다.
> 어드민 조회 시 서버에서 `supabase.storage.from('verifications').createSignedUrl(path, 3600)`으로 Signed URL을 생성한다.

### 3. Frontend Implementation (`apps/web`)

#### [NEW] `apps/web/src/components/features/onboarding/VerificationStep.tsx`
- 파일 선택 및 업로드를 담당하는 컴포넌트.
- `@law-fi/supabase/client`를 사용해 `verifications/${userId}/id_card.jpg`로 직접 업로드 (upsert: true).
- 업로드 성공 후 반환된 storage path를 Server Action에 전달.

#### [MODIFY] `apps/web/src/lib/actions/onboarding.action.ts`
- **신규**: `submitVerification(imagePath: string)` Server Action 추가.
  - `verificationImagePath`, `verificationSubmittedAt`, `verificationStatus: PENDING` 동시 업데이트.
  - **Prisma**로 구현 (`@law-fi/db`).
- **기존 코드 수정**: `checkNicknameDuplicate`, `updateProfileBasic`도 Supabase SDK 대신 **Prisma**로 교체.
  - Auth 정보 취득(`supabase.auth.getUser()`)은 Supabase SDK 유지, DB CRUD만 Prisma로.

> [!IMPORTANT]
> 현재 `onboarding.action.ts`의 모든 DB 조작이 `supabase.from('profiles')`로 구현되어 있으나 이는 규칙 위반이다.
> 규칙: "DB Access: Use Prisma for all DB CRUD operations."
> `submitVerification` 신규 구현 시점에 기존 함수도 함께 Prisma로 마이그레이션한다.

#### [MODIFY] `apps/web/src/components/widgets/onboarding/OnboardingWizard.tsx`
- `VerificationStep`을 `IdentityForm` 이후 wizard flow에 통합.

## Verification Plan

### Automated Tests
- `pnpm check-types` 및 `pnpm lint` 실행.

### Manual Verification
1. `pnpm dev` 실행.
2. 온보딩 플로우 진입 → 닉네임 입력 → 역할 선택.
3. Verification Step에서 이미지 업로드.
4. Supabase Storage에서 `[your-user-id]/id_card.jpg` 파일 확인.
5. Prisma Studio에서 `Profile`의 `verificationStatus = PENDING`, `verificationImagePath` 값 확인 (URL이 아닌 경로여야 함).
