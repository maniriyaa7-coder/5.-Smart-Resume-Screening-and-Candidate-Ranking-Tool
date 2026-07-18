'use client'

import { usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // For role-specific sub-routes, just render children (they have their own layouts)
  const isRoleSpecific =
    pathname.startsWith('/dashboard/recruiter') ||
    pathname.startsWith('/dashboard/candidate')

  if (isRoleSpecific) {
    return <>{children}</>
  }

  // For the root /dashboard redirect page, just wrap with ProtectedRoute
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
