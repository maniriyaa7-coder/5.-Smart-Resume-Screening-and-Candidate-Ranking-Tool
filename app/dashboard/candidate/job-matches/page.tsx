'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { useState, useEffect } from 'react'
import { resumeAPI } from '@/lib/api/resume'
import { Briefcase, MapPin } from 'lucide-react'

export default function CandidateJobMatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resumeAPI.getJobMatches().then(res => {
      if (res.success) setMatches(res.data.jobMatches)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-48 bg-white/5 rounded animate-pulse"></div>
  }

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground">Find matching job listings using your active parsed resume details</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match: any, idx: number) => (
            <Card key={idx} glass={true} hover={true} className="flex justify-between items-center p-6">
              <div>
                <h3 className="font-bold text-lg">{match.jobTitle || 'Developer'}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Briefcase className="w-4 h-4" /> {match.company || 'Tech Corp'}
                </p>
              </div>
              <Badge variant="success" size="md">
                {match.matchPercentage}% Match
              </Badge>
            </Card>
          ))}
        </div>
      ) : (
        <Card glass={true} className="p-12 text-center text-muted-foreground">
          No job matches computed. Make sure you have uploaded an active resume.
        </Card>
      )}
    </div>
  )
}
