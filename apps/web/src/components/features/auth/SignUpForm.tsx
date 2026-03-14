"use client"

import { useState } from "react"
import { toast } from "sonner"
import { passwordSchema, termsSchema } from "@law-fi/supabase/zod/auth"
import { createClient } from "@law-fi/supabase/client"
import { Lock, ArrowLeft } from "lucide-react"

interface SignUpFormProps {
  email: string;
  onReset: () => void;
}

export function SignUpForm({ email, onReset }: SignUpFormProps) {
  const supabase = createClient()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // OTP Verification States
  const [step, setStep] = useState<"SIGNUP" | "VERIFY_OTP">("SIGNUP")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    const parsedPassword = passwordSchema.safeParse(password)
    if (!parsedPassword.success) {
      setError(parsedPassword.error.errors[0].message)
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    const parsedTerms = termsSchema.safeParse(termsAccepted)
    if (!parsedTerms.success) {
      setError(parsedTerms.error.errors[0].message)
      return
    }

    setIsLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    setIsLoading(false)

    if (signUpError) {
      setError(signUpError.message || "회원가입 중 오류가 발생했습니다.")
      return
    }

    toast.success("인증 메일이 발송되었습니다. 이메일을 확인해주세요.")
    setStep("VERIFY_OTP")
  }



  if (step === "VERIFY_OTP") {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">
            Confirm your email
          </h1>
          <p className="text-white/60 text-lg">
            가입한 이메일 주소로 확인 메일을 보냈습니다.<br />
            메일함의 링크를 클릭하여 가입을 완료해주세요.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-(--accent-primary)/10 flex items-center justify-center text-(--accent-primary)">
              <Lock className="w-8 h-8" />
            </div>
            <p className="text-center text-white/80 font-medium">
              이메일 인증 전에는 서비스 이용이 제한됩니다.
            </p>
          </div>

          <div className="pt-2">
            <button 
              type="button" 
              onClick={() => setStep("SIGNUP")}
              className="w-full rounded-lg bg-white py-4 text-base font-bold text-[#0C0C0D] hover:bg-slate-200 transition-colors shadow-lg"
            >
              확인
            </button>
          </div>
          
          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={handleSignUp}
              disabled={isLoading}
              className="text-white/50 hover:text-white underline text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? "발송 중..." : "인증 메일 재발송"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white mb-3">
          Create an account
        </h1>
        <p className="text-white/60 text-lg">
          새 기밀 워크스페이스를 설정합니다
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Email Address
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              value={email}
              disabled
              readOnly
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-4 text-white/50 cursor-not-allowed focus:ring-0 focus:border-white/10 outline-none"
            />
            <div className="absolute right-4 text-white/20">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-white/50" htmlFor="signup-password">
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="signup-password"
              type="password"
              placeholder="8자 이상 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-4 text-white placeholder:text-white/30 focus:border-(--accent-primary) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-white/50" htmlFor="confirm-password">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              id="confirm-password"
              type="password"
              placeholder="비밀번호 재입력"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-4 text-white placeholder:text-white/30 focus:border-(--accent-primary) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-(--accent-primary) focus:ring-(--accent-primary) focus:ring-offset-0"
              required
            />
          </div>
          <div className="text-sm">
            <label htmlFor="terms" className="font-medium text-white/60">
              <a href="#" className="underline hover:text-white transition-colors">이용약관</a> 및 
              <a href="#" className="underline hover:text-white transition-colors"> 개인정보처리방침</a>에 동의합니다.
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading || password.length === 0 || confirmPassword.length === 0 || !termsAccepted} 
            className="w-full rounded-lg bg-white py-4 text-base font-bold text-[#0C0C0D] hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "생성 중..." : "Create Account"}
          </button>
        </div>

        <div className="text-center">
          <button 
            type="button" 
            onClick={onReset}
            className="group flex items-center justify-center gap-2 mx-auto text-white/50 hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium text-sm">Use a different email</span>
          </button>
        </div>
      </form>
    </div>
  )
}
