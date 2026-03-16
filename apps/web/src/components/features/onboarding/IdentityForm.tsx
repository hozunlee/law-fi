'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@law-fi/ui/button'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { checkNicknameDuplicate } from '@/lib/actions/onboarding.action'

const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,8}$/

export function IdentityForm() {
  const {
    nickname,
    setNickname,
    isNicknameValid,
    setIsNicknameValid,
    role,
    setRole,
    setStep,
  } = useOnboardingStore()

  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 닉네임 유효성 검사 및 중복 확인 (Debounce 500ms)
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!nickname) {
        setIsNicknameValid(false)
        setError(null)
        return
      }

      if (!NICKNAME_REGEX.test(nickname)) {
        setIsNicknameValid(false)
        setError('2~8자의 한글, 영문, 숫자만 사용 가능합니다.')
        return
      }

      setIsChecking(true)
      try {
        const isDuplicate = await checkNicknameDuplicate(nickname)
        if (isDuplicate) {
          setIsNicknameValid(false)
          setError('이미 사용 중인 닉네임입니다.')
        } else {
          setIsNicknameValid(true)
          setError(null)
        }
      } catch (err) {
        setError('중복 확인 중 오류가 발생했습니다.')
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [nickname, setIsNicknameValid])

  const canNext = isNicknameValid && role !== null && !isChecking

  return (
    <div className="space-y-10 w-full max-w-sm mx-auto">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          정체성 설정
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          라운지에서 사용할 닉네임과 역할을 선택해주세요.
        </p>
      </header>

      <div className="space-y-8">
        {/* 닉네임 입력 섹션 */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            닉네임 (2~8자)
          </label>
          <div className="relative">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full bg-[var(--bg-surface)] border-none rounded-xl px-4 py-4 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] transition-all outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isChecking ? (
                <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-primary)]" />
              ) : isNicknameValid ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : null}
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1 pl-1 flex items-center gap-1">
              {error}
            </p>
          )}
        </div>

        {/* 역할 선택 섹션 */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            역할 선택
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRole('LAWYER')}
              className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'LAWYER'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-foam)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
              }`}
            >
              <span className="text-lg font-bold">변호사</span>
              <span className="text-[10px] opacity-60">LAWYER</span>
            </button>
            <button
              onClick={() => setRole('STUDENT')}
              className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'STUDENT'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-foam)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
              }`}
            >
              <span className="text-lg font-bold">로스쿨생</span>
              <span className="text-[10px] opacity-60">STUDENT</span>
            </button>
          </div>
        </div>
      </div>

      <Button
        disabled={!canNext}
        onClick={() => setStep('VERIFICATION')}
        className="w-full py-7 rounded-full text-lg font-bold bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-xl shadow-[var(--accent-primary)]/20 disabled:opacity-30 disabled:shadow-none transition-all"
      >
        다음 단계로
      </Button>
    </div>
  )
}
