'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Briefcase, Calendar } from 'lucide-react'

export default function CandidateAppliedJobsPage() {
  const appliedList = [
    { title: 'Frontend Developer', company: 'InnovateTech', date: '2 days ago', status: 'Applied' },
    { title: 'React Engineer', company: 'DevStudio', date: '1 week ago', status: 'Screening' }
  ]

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Applied Jobs</h1>
        <p className="text-muted-foreground">Keep track of your active job applications</p>
      </div>

      <div className="space-y-3">
        {appliedList.map((app, i) => (
          <Card key={i} glass={true} className="flex justify-between items-center p-4">
            <div className="flex gap-4 items-center">
              <span className="p-2 bg-primary/20 text-primary rounded-lg">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-lg">{app.title}</h3>
                <p className="text-sm text-muted-foreground">{app.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {app.date}
              </span>
              <Badge variant="outline">{app.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
