import { create } from 'zustand'

export type OnboardingStep = 'NICKNAME' | 'ROLE' | 'VERIFICATION' | 'PENDING'

interface OnboardingState {
  nickname: string
  isNicknameValid: boolean
  role: 'LAWYER' | 'STUDENT' | null
  idCardFile: File | null
  extraProofFile: File | null
  isSubmitting: boolean

  setNickname: (nickname: string) => void
  setIsNicknameValid: (isValid: boolean) => void
  setRole: (role: 'LAWYER' | 'STUDENT' | null) => void
  setIdCardFile: (file: File | null) => void
  setExtraProofFile: (file: File | null) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 'NICKNAME',
  nickname: '',
  isNicknameValid: false,
  role: null,
  idCardFile: null,
  extraProofFile: null,
  isSubmitting: false,

  setNickname: (nickname) => set({ nickname }),
  setIsNicknameValid: (isNicknameValid) => set({ isNicknameValid }),
  setRole: (role) => set({ role }),
  setIdCardFile: (idCardFile) => set({ idCardFile }),
  setExtraProofFile: (extraProofFile) => set({ extraProofFile }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () =>
    set({
      nickname: '',
      isNicknameValid: false,
      role: null,
      idCardFile: null,
      extraProofFile: null,
      isSubmitting: false,
    }),
}))
