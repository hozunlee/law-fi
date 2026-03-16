import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LAW-FI | Premium Lounge",
  description: "익명 기반의 프리미엄 전문직 라운지",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans">
        {children}
      </body>
    </html>
  )
}
