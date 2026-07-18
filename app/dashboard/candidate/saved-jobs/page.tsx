'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Star, Briefcase } from 'lucide-react'

export default function CandidateSavedJobsPage() {
  const savedJobs = [
    { title: 'Full Stack Developer', company: 'CloudScale Inc', location: 'Remote', match: '90%' },
    { title: 'Senior UI Engineer', company: 'Pixel Labs', location: 'New York, NY', match: '87%' },
  ]

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Saved Jobs</h1>
        <p className="text-muted-foreground">Jobs you bookmarked for later</p>
      </div>

      <div className="space-y-3">
        {savedJobs.map((job, i) => (
          <Card key={i} glass={true} hover={true} className="flex items-center justify-between p-4">
            <div className="flex gap-4 items-center">
              <span className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                <Star className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
              </div>
            </div>
            <Badge variant="success">{job.match} Match</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
