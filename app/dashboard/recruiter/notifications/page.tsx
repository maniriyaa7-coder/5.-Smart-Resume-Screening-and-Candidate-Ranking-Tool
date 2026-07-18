'use client'

import { Card } from '@/components/card'
import { Bell, Info } from 'lucide-react'

export default function RecruiterNotificationsPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Keep track of candidate registrations and applications</p>
      </div>

      <div className="space-y-3">
        {[
          { text: 'A new candidate, John Candidate, has registered to the system.', time: '2 hours ago' },
          { text: 'Jane Miller has updated her resume details.', time: '5 hours ago' },
          { text: 'Alice Johnson completed her technical interview assessment.', time: '1 day ago' },
        ].map((notif, i) => (
          <Card key={i} glass={true} className="flex gap-4 items-start">
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
