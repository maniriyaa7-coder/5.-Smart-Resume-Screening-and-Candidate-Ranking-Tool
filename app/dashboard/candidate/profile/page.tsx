'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { useAuth } from '@/contexts/AuthContext'

export default function CandidateProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and edit your candidate profile information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card glass={true} className="p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Badge variant="default">Candidate</Badge>
        </Card>

        {/* Details */}
        <Card glass={true} className="p-6 md:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">Profile Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs mb-0.5">Full Name</span>
              <span className="font-semibold">{user?.fullName || user?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-0.5">Email</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-0.5">Phone</span>
              <span className="font-semibold">{user?.phoneNumber || 'Not set'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-0.5">College</span>
              <span className="font-semibold">{user?.college || 'Not set'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-0.5">Location</span>
              <span className="font-semibold">{user?.currentLocation || 'Not set'}</span>
            </div>
          </div>
          {user?.skills && user.skills.length > 0 && (
            <div className="pt-4 border-t border-border">
              <span className="text-muted-foreground text-xs mb-2 block">Skills</span>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill: string) => (
                  <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          <Button variant="primary" className="mt-2">Edit Profile</Button>
        </Card>
      </div>
    </div>
  )
}
