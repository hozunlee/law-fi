[Task Spec: Admin Verification Flow]

## Context

- Framework: Vite + React SPA (Refine — authProvider + routerProvider + **dataProvider** 풀 활용)
- UI: shadcn/ui (`@law-fi/ui`) + Tailwind CSS (디자인 레퍼런스: shadcn dashboard example)
- Philosophy: "Zero Over-engineering."

---

## Step 0. 사전 준비

### 패키지

`@refinedev/supabase` 설치 완료 (v6.0.2). `@refinedev/core@^5.0.0` + `@supabase/supabase-js@^2` 호환 확인됨.

### shadcn 컴포넌트 추가 (`packages/ui`)

```bash
cd packages/ui
pnpm dlx shadcn@latest add table badge dialog card separator avatar
```

추가 후 `packages/ui/package.json` exports에 등록:
```json
"./table":     "./src/components/ui/table.tsx",
"./badge":     "./src/components/ui/badge.tsx",
"./dialog":    "./src/components/ui/dialog.tsx",
"./card":      "./src/components/ui/card.tsx",
"./separator": "./src/components/ui/separator.tsx",
"./avatar":    "./src/components/ui/avatar.tsx"
```

### App.tsx 구성

`@refinedev/supabase`의 `dataProvider`와 `liveProvider`를 `supabaseClient`에 연결.

```tsx
import { dataProvider, liveProvider } from '@refinedev/supabase'
import { supabase } from './lib/supabaseClient'

<Refine
  authProvider={authProvider}
  routerProvider={routerProvider}
  dataProvider={dataProvider(supabase)}
  liveProvider={liveProvider(supabase)}   // 실시간 업데이트 (선택)
>
```

`/verifications` 라우트 추가:
```tsx
<Route path="/verifications" element={
  <Authenticated key="verifications" fallback={<Navigate to="/login" replace />} loading={null}>
    <VerificationsPage />
  </Authenticated>
} />
```

---

## Module 1. 대기자 리스트 (`VerificationsPage`)

**파일**: `apps/admin/src/pages/verifications/VerificationsPage.tsx`

**Data Fetching**: Refine `useTable` 훅

```ts
const { tableQuery } = useTable({
  resource: 'profiles',
  filters: {
    permanent: [{ field: 'verificationStatus', operator: 'eq', value: 'PENDING' }],
  },
  sorters: {
    initial: [{ field: 'verificationSubmittedAt', order: 'asc' }],
  },
})
```

**UI**: shadcn `<Table>` 컴포넌트

| 컬럼 | 필드 |
|---|---|
| Email | `email` |
| Role | `role` — shadcn `<Badge>` (LAWYER/STUDENT 구분 색상) |
| 제출일 | `verificationSubmittedAt` |
| 액션 | `[심사하기]` 버튼 → 모달 오픈 |

---

## Module 2. 심사 모달 (`ReviewDialog`)

**파일**: `apps/admin/src/pages/verifications/ReviewDialog.tsx`

**UI**: shadcn `<Dialog>` 컴포넌트

**Signed URL 생성**: 모달 오픈(`open === true`) 시 `supabase` 직접 호출.

```ts
// Supabase Storage는 dataProvider 범위 밖 → SDK 직접 사용
const { data } = await supabase.storage
  .from('verifications')
  .createSignedUrl(profile.verificationImagePath, 3600)  // 1시간
```

> [!NOTE]
> Storage(Signed URL)는 dataProvider가 다루지 않으므로 SDK 직접 호출이 맞다.
> 필드명: `verificationImagePath` (스키마 기준).

**모달 내 UI 구성**:
- 신분증 이미지: Signed URL → `<img>` 태그
- KBA 진위확인 링크: `<a href="https://www.koreanbar.or.kr/pages/search/idcard.asp" target="_blank">` 버튼
- 승인 / 반려 버튼

---

## Module 3. 승인/반려 Mutation

**Refine `useUpdate` 훅 사용** — 성공 시 `profiles` 리소스 캐시 자동 무효화 → 리스트 자동 리프레시.

**Action A — 승인**:
```ts
const { mutate: approve } = useUpdate()

approve({
  resource: 'profiles',
  id: profile.id,
  values: { verificationStatus: 'APPROVED' },
})
```

> role은 온보딩 시 유저가 이미 선택했으므로 덮어쓰지 않음.

**Action B — 반려**:
```ts
reject({
  resource: 'profiles',
  id: profile.id,
  values: { verificationStatus: 'REJECTED' },
})
```

**완료 후 처리**: `useUpdate`의 `onSuccess`에서 모달 닫기. 리스트 리프레시는 Refine 캐시 무효화로 자동 처리.

```ts
const { mutate } = useUpdate({
  mutationOptions: {
    onSuccess: () => setOpen(false),
  },
})
```

---

## 파일 구조

```
apps/admin/src/
  lib/
    supabaseClient.ts
  providers/
    authProvider.ts
  pages/
    login/LoginPage.tsx
    dashboard/DashboardPage.tsx
    verifications/
      VerificationsPage.tsx   # useTable로 PENDING 리스트
      ReviewDialog.tsx        # Signed URL + useUpdate 승인/반려
  App.tsx                     # dataProvider + liveProvider 추가
```
