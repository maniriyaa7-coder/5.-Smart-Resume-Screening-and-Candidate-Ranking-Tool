'use client'

import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { useAuth } from '@/contexts/AuthContext'

export default function CandidateSettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card glass={true} className="max-w-xl space-y-4 p-6">
        <h3 className="text-lg font-bold">Account Information</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-semibold text-foreground">Name:</span> {user?.name}</p>
          <p><span className="font-semibold text-foreground">Email:</span> {user?.email}</p>
          <p><span className="font-semibold text-foreground">Role:</span> {user?.role}</p>
        </div>
        <Button variant="primary">Update Account</Button>
      </Card>
    </div>
  )
}
