'use client'

import { Card } from '@/components/card'
import { Bell } from 'lucide-react'

export default function CandidateNotificationsPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay up-to-date with your application status</p>
      </div>

      <div className="space-y-3">
        {[
          { text: 'Your application to InnovateTech was reviewed and you moved to screening.', time: '1 hour ago' },
          { text: 'Your resume ATS score improved to 88% after re-analysis.', time: '3 hours ago' },
          { text: 'New job match: React Engineer at DevStudio matches 88% of your skills.', time: '1 day ago' },
        ].map((notif, i) => (
          <Card key={i} glass={true} className="flex gap-4 items-start p-4">
            <span className="p-2 bg-primary/20 text-primary rounded-lg flex-shrink-0">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">{notif.text}</p>
              <span className="text-xs text-muted-foreground">{notif.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
