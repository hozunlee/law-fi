"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EmailCheckForm } from "./EmailCheckForm"
import { LoginForm } from "./LoginForm"
import { SignUpForm } from "./SignUpForm"

export type AuthMode = "CHECK_EMAIL" | "LOGIN" | "SIGNUP"

export function AuthContainer() {
  const [authMode, setAuthMode] = useState<AuthMode>("CHECK_EMAIL")
  const [email, setEmail] = useState<string>("")

  const handleEmailResolved = (resolvedEmail: string, mode: AuthMode) => {
    setEmail(resolvedEmail)
    setAuthMode(mode)
  }

  const handleResetMode = () => {
    setAuthMode("CHECK_EMAIL")
    setEmail("")
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {authMode === "CHECK_EMAIL" && (
          <motion.div
            key="check-email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EmailCheckForm onResolved={handleEmailResolved} />
          </motion.div>
        )}

        {authMode === "LOGIN" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm email={email} onReset={handleResetMode} />
          </motion.div>
        )}

        {authMode === "SIGNUP" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SignUpForm email={email} onReset={handleResetMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
