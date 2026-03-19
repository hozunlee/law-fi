# Law-fi Git Commit Convention

이 프로젝트는 다음과 같은 커밋 컨벤션을 따릅니다.

## 커밋 메시지 구조
```
<type>(<scope>): <subject>

<body> (선택 사항)
```

## 타입 (Type)
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정 (README, docs 등)
- **style**: 코드 포맷팅, 세미콜론 누락 등 (코드 로직 변경 없음)
- **refactor**: 코드 리팩토링 (기능 변경 없이 코드 구조 개선)
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 업무 수정, 패키지 매니저 설정 등 (App 코드 변경 없음)
- **design**: UI/UX 디자인 수정 (Tailwind, CSS 등)

## 스코프 (Scope)
- **web**: 메인 웹 플랫폼 (`apps/web`)
- **admin**: 어드민 플랫폼 (`apps/admin`)
- **db**: 데이터베이스 및 Prisma (`packages/db`)
- **ui**: 공통 UI 컴포넌트 (`packages/ui`)
- **supabase**: Supabase 관련 로직 (`packages/supabase`)
- **config**: 설정 파일 (`package.json`, `tsconfig` 등)

## 규칙
1. **한글 사용**: 커밋 메시지는 한글로 작성합니다.
2. **현재 시제 사용**: '추가함', '수정함' 보다는 '추가', '수정'과 같이 간결하게 작성합니다.
3. **분리 커밋**: 하나의 커밋에는 하나의 작업 단위만 포함합니다.
