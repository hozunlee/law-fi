"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

import { Button } from "@law-fi/ui/button"
import { Input } from "@law-fi/ui/input"

import { createClient } from "@law-fi/supabase/client"
import { emailSchema, otpSchema } from "@law-fi/supabase/zod/auth"

export function AuthForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<"EMAIL_INPUT" | "OTP_INPUT">("EMAIL_INPUT")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleRequestOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)

    const parsedEmail = emailSchema.safeParse(email)
    if (!parsedEmail.success) {
      setError(parsedEmail.error.errors[0].message)
      return
    }

    setIsLoading(true)
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
    })
    setIsLoading(false)

    if (signInError) {
      setError("인증 메일 발송에 실패했습니다. 다시 시도해주세요.")
      return
    }

    setStep("OTP_INPUT")
    setCooldown(60)
    toast.success("인증번호가 발송되었습니다.")
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const parsedOtp = otpSchema.safeParse(otp)
    if (!parsedOtp.success) {
      setError(parsedOtp.error.errors[0].message)
      return
    }

    setIsLoading(true)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })
    setIsLoading(false)

    if (verifyError) {
      setError("인증번호가 일치하지 않습니다.")
      return
    }

    // After success, reload/push will trigger middleware which checks profile status
    router.push("/lounge")
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "EMAIL_INPUT" && (
          <motion.form
            key="email-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleRequestOtp}
            className="flex flex-col gap-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold leading-relaxed text-[var(--text-primary)]">
                로그인
              </h1>
              <p className="text-sm font-normal text-[var(--text-secondary)] mt-2">
                LAW-FI에 오신 것을 환영합니다.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <Button type="submit" disabled={isLoading || email.length === 0} className="mt-2 text-base h-12">
              {isLoading ? "발송 중..." : "인증번호 받기"}
            </Button>
          </motion.form>
        )}

        {step === "OTP_INPUT" && (
          <motion.form
            key="otp-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold leading-relaxed text-[var(--text-primary)]">
                인증번호 입력
              </h1>
              <p className="text-sm font-normal text-[var(--text-secondary)] mt-2">
                {email}로 발송된 6자리 코드를 입력해주세요.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                type="text"
                placeholder="6자리 숫자"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={isLoading}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <Button type="submit" disabled={isLoading || otp.length !== 6} className="mt-2 text-base h-12">
              {isLoading ? "확인 중..." : "인증하기"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={isLoading || cooldown > 0}
              onClick={handleRequestOtp}
              className="mt-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {cooldown > 0 ? `인증번호 재발송 (00:${cooldown.toString().padStart(2, "0")})` : "인증번호 재발송"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
