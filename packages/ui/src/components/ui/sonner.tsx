"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--bg-surface)] group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-[var(--border-subtle)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[var(--text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--accent-primary)] group-[.toast]:text-[var(--bg-surface)]",
          cancelButton:
            "group-[.toast]:bg-[var(--bg-base)] group-[.toast]:text-[var(--text-secondary)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
