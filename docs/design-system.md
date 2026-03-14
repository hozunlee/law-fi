# Law-fi Design System (v1.0) Specification

## 1. Theme & Concept

- Name: The Aerocano (Day & Night)
- Mode: Dual Theme (Light / Dark)
- Keyword: 명료함(Clarity), 스텔스(Stealth), 미니멀리즘

## 2. Color System: Semantic Tokens

Tailwind CSS 변수로 적용될 절대적인 컬러 맵핑. 컴포넌트 스타일링 시 하드코딩된 Hex 값 사용 금지.

| CSS Variable     | Light Mode (Hex) | Dark Mode (Hex) | Usage (적용 대상)                                |
| ---------------- | ---------------- | --------------- | ------------------------------------------------ |
| --bg-base        | #F5F5F7          | #1A1A1C         | 최상위 레이아웃 배경 (body, scaffold)            |
| --bg-surface     | #FFFFFF          | #242426         | 컴포넌트 배경 (카드, 모달, 네비게이션)           |
| --text-primary   | #3B1C0B          | #EAE8E3         | 메인 텍스트, 제목, 강조                          |
| --text-secondary | #8E8E93          | #8A8A8E         | 부가 설명, 날짜, 비활성 텍스트                   |
| --accent-primary | #C27236          | #C27236         | 핵심 액션 버튼 (CTA), 메인 포인트 (양 모드 동일) |
| --accent-hover   | #A85D2A          | #E08A4D         | 버튼 Hover 상태                                  |
| --accent-foam    | #E5CDA2          | #3A2A1E         | 뱃지(Badge), 태그 배경                           |
| --border-subtle  | #E5E5EA          | #3B1C0B         | 디바이더, 카드 경계선                            |

## 3. Typography

법률 도메인 특성상 가독성과 여백을 최우선으로 설계된 스케일.

- Font Family: Pretendard 또는 Apple SD Gothic Neo

| Level     | Size | Weight    | Tracking (자간) | Leading (행간) | Tailwind Class 조합                            |
| --------- | ---- | --------- | --------------- | -------------- | ---------------------------------------------- |
| Display   | 30px | Bold      | tight           | snug           | text-3xl font-bold tracking-tight leading-snug |
| Heading 1 | 20px | Semi-bold | normal          | relaxed        | text-xl font-semibold leading-relaxed          |
| Body Main | 16px | Medium    | normal          | loose (1.6)    | text-base font-medium leading-loose            |
| Caption   | 14px | Normal    | normal          | normal         | text-sm font-normal text-secondary             |

## 4. Spacing & Shape (Constraints)

레이아웃과 컴포넌트 형태에 대한 물리적 제약 조건.

- Spacing: 컴포넌트 간 간격은 최소 gap-4 이상 유지하여 여백 확보.
- Border Radius:
    - 버튼 (Button): rounded-full
    - 카드/모달 (Card/Modal): rounded-2xl (16px)
- Shadows:
    - Light Mode: shadow-sm (얕은 그림자)
    - Dark Mode: shadow-none (그림자 제거, --border-subtle로 경계 구분)

## 5. Implementation Code

위 시스템을 적용하기 위한 globals.css 및 tailwind.config.ts 기본 코드.

### globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-base: #F5F5F7;
    --bg-surface: #FFFFFF;
    --text-primary: #3B1C0B;
    --text-secondary: #8E8E93;
    --accent-primary: #C27236;
    --accent-hover: #A85D2A;
    --accent-foam: #E5CDA2;
    --border-
```
