import { useState } from 'react'
import { useLogout, useGetIdentity, useTable } from '@refinedev/core'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@law-fi/ui/table'
import { Badge } from '@law-fi/ui/badge'
import { Button } from '@law-fi/ui/button'

type Profile = {
  id: string
  email: string
  role: 'LAWYER' | 'STUDENT' | 'GUEST' | 'ADMIN'
  verificationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED'
  verificationImagePath: string | null
  verificationSubmittedAt: string | null
}

export function DashboardPage() {
  const { mutate: logout } = useLogout()
  const { data: identity } = useGetIdentity<{ id: string; name: string }>()

  // Fetch pending verifications
  const { tableQuery } = useTable<Profile>({
    resource: 'profiles',
    filters: {
      initial: [
        {
          field: 'verificationStatus',
          operator: 'eq',
          value: 'PENDING',
        },
      ],
    },
    pagination: {
      mode: 'client',
    },
  })

  // We are storing the selected profile to review later (Module 2)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const pendingProfiles = tableQuery?.data?.data ?? []
  const isLoading = tableQuery?.isLoading
  const error = tableQuery?.error

  const handleReviewClick = (profile: Profile) => {
    setSelectedProfile(profile)
    setIsReviewModalOpen(true)
  }

  // Formatting date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary) flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-(--border-subtle) bg-(--bg-surface) backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-5xl">
          <div className="text-xl font-semibold tracking-tight text-(--text-primary)">Law-fi Admin</div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-(--text-secondary)">{identity?.name || 'Administrator'}</span>
            <Button variant="outline" size="sm" onClick={() => logout()} className="rounded-full shadow-sm text-black">
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-(--text-primary) tracking-tight">대기자 승인 관리</h1>
          <p className="text-(--text-secondary) mt-2">전문직 가입 대기자의 자격 증명을 검토하고 승인합니다.</p>
        </div>

        <div className="rounded-2xl bg-(--bg-surface) shadow-sm border border-(--border-subtle) overflow-hidden">
          <Table>
            <TableHeader className="bg-(--bg-base)">
              <TableRow>
                <TableHead>가입 역할</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>제출일시</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-red-500 font-semibold">
                    데이터를 불러오는 중 오류가 발생했습니다: {error.message}
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-(--text-secondary)">
                    목록을 불러오는 중입니다...
                  </TableCell>
                </TableRow>
              ) : pendingProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-(--text-secondary)">
                    현재 심사 대기 중인 사용자가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                pendingProfiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Badge variant={p.role === 'LAWYER' ? 'default' : 'secondary'}>
                        {p.role === 'LAWYER' ? '변호사' : p.role === 'STUDENT' ? '로스쿨생' : p.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{p.email}</TableCell>
                    <TableCell className="text-(--text-secondary)">
                      {formatDate(p.verificationSubmittedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleReviewClick(p)}>
                        심사하기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* 모달 렌더링 시작부 (추후 확장을 위한 더미 레이저) */}
      {isReviewModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl w-96 text-center">
            <h3 className="text-lg font-bold mb-4 text-black">심사 모달 (준비중)</h3>
            <p className="text-gray-600 mb-6">{selectedProfile.email} 심사</p>
            <Button onClick={() => setIsReviewModalOpen(false)}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  )
}
