# Admin Verification Flow ToDo List
(`docs/admin/dashboard-logic.md` 기반 대시보드 및 심사 기능 구현 계획)

## 1. 사전 환경 및 의존성 세팅
- [ ] **Data Provider 연결**: `apps/admin/src/App.tsx`에 `@refinedev/supabase`의 `dataProvider`와 `liveProvider` 추가 연동
- [ ] **UI 컴포넌트 추가**: `packages/ui`에서 필요한 shadcn 컴포넌트(`table`, `badge`, `dialog`, `card`, `separator`, `avatar`) add 및 export 여부 확인
- [ ] **라우팅 점검**: `App.tsx` 내에 대시보드 컴포넌트(`DashboardPage` 또는 `VerificationsPage`)로 접근할 수 있는 `<Route>`가 Authenticated 상태로 올바르게 열려있는지 확인

## 2. Module 1: 대기자 리스트 구현 (`DashboardPage` / `VerificationsPage`)
- [ ] **데이터 페칭**: Refine의 `useTable` 훅을 사용해 `profiles` 테이블에서 `verificationStatus === 'PENDING'`인 유저 목록 조회 로직 작성
- [ ] **테이블 마크업**: shadcn `<Table>` 컴포넌트를 레이아웃에 배치
- [ ] **테이블 데이터 매핑**: 
  - `email`: 유저 이메일
  - `role`: LAWYER/STUDENT 구분용 shadcn `<Badge>` 렌더링
  - `verificationSubmittedAt`: 제출일/시간 포맷팅
- [ ] **리뷰 액션 버튼**: 각 행(Row) 우측에 `[심사하기]` 버튼 추가 및 선택한 유저 상태(state)를 저장하는 로직 연결

## 3. Module 2: 심사 모달 뷰어 (`ReviewDialog`)
- [ ] **모달 컴포넌트 뼈대 작성**: shadcn `<Dialog>`를 이용한 별도 모달 컴포넌트 구성 
- [ ] **Selected User 상태 바인딩**: 테이블에서 `[심사하기]` 클릭 시 넘어온 유저 정보(Profile 객체)를 모달에 렌더링
- [ ] **Signed URL 로직 작성**: 
  - 모달 렌더링 시점에 `supabase.storage.from('verifications').createSignedUrl(profile.verificationImagePath, 60)` 호출
  - 반환받은 60초 임시 URL을 `<img>` 태그에 바인딩
- [ ] **KBA 외부 검증 링크**: 대한변협 진위확인 페이지로 넘어가는 타겟 블랭크(`<a target="_blank">`) 버튼 구현

## 4. Module 3: 승인/반려 (Mutation) 연동
- [ ] **useUpdate 기반 액션**: `@refinedev/core`의 `useUpdate` 훅 구성 (`resource: 'profiles'`)
- [ ] **승인 (Approve) 버튼 로직**: 
  - `values: { verificationStatus: 'APPROVED', role: '유저의 지원 형태(LAWYER 또는 STUDENT)' }` 업데이트 연결
- [ ] **반려 (Reject) 버튼 로직**: 
  - `values: { verificationStatus: 'REJECTED' }` 업데이트 연결
- [ ] **캐시 갱신 및 UI 정리**: 업데이트 `onSuccess` 콜백에서 모달을 닫고(`setOpen(false)`), Refine이 자동으로 쿼리를 무효화하여 리스트가 갱신되는지 확인

## 5. 최종 검증 및 예외 처리
- [ ] **RLS(Row Level Security) 체크**: 어드민 역할(Role)이 `profiles` 테이블의 다른 유저 데이터를 읽고 업데이트할 수 있도록 DB RLS 정책 검증
- [ ] **로딩 상태 UI (Suspense/Spinners)**: Table 데이터가 불러와지는 동안, Signed URL 이미지가 패치되는 동안의 로딩 처리
- [ ] **Storage 접근 권한 테스트**: Private Bucket(`verifications`)에서 Signed URL 발급 시 발생할 수 있는 오류 예방 및 에러 시 토스트 알림 처리
