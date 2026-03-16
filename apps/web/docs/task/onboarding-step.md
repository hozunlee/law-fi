회원가입 완료.

유저 상태를 체크한다. (prisma 사용)

1. role이 guest이고 verification state가 Not_submitted이면 닉네임 설정으로 이동
2. role이 guest이고 verification state가 Pending이면 인증 대기 페이지로 이동
3. role이 lawyer이거나 student이고 verification state가 Approved이면 라운지로 이동

데이터를 가지고있을 store를 기획한다.

// Onboarding State
interface OnboardingState {
step: 1 | 2;
nickname: string;
isNicknameValid: boolean; // 중복 검사 및 정규식 통과 여부
role: "LAWYER" | "STUDENT" | null;
idCardFile: File | null;
extraProofFile: File | null; // 변호사 전용 (선택)
isSubmitting: boolean;
}
📍 [Module 1] Step 1: 정체성 설정 (Identity Setup)
목표: nickname과 role을 확정하고 유효성을 검증한다.

UI 컴포넌트: features/onboarding/IdentityForm.tsx

Inputs:

Nickname Input: Zod 검증 (2~8자, 특수문자 금지)

Role Toggle: 2개의 대형 버튼 (LAWYER / STUDENT)

Actions (클라이언트 로직):

[Debounce 500ms] 닉네임 입력 시 서버 액션 checkNicknameUnique(nickname) 호출.

결과가 true면 isNicknameValid = true 세팅, 초록색 체크 마크 표시.

Transition (다음 단계 조건):

isNicknameValid === true AND role !== null 일 때만 [Next] 버튼 활성화.

클릭 시 step = 2로 상태 업데이트.
