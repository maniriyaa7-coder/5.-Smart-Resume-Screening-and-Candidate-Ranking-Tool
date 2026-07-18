'use client'

import { Card } from '@/components/card'
import { useState, useEffect } from 'react'
import { resumeAPI } from '@/lib/api/resume'
import { Target, CheckCircle2 } from 'lucide-react'

export default function CandidateAtsScorePage() {
  const [atsData, setAtsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resumeAPI.getATSScore().then(res => {
      if (res.success) setAtsData(res.data.atsScore)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-48 bg-white/5 rounded animate-pulse"></div>
  }

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">ATS Score</h1>
        <p className="text-muted-foreground">Detailed applicant tracking system evaluation</p>
      </div>

      {atsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="gradient-bg from-primary/20 to-accent/20 p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-muted-foreground">ATS Score</p>
              <div className="text-6xl font-bold gradient-text">{atsData.overallScore}%</div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold">Matched Keywords: {atsData.matchedKeywords?.length || 0}</p>
            </div>
          </Card>

          <Card glass={true} className="p-6 space-y-4">
            <h3 className="font-bold text-lg">Matched Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {atsData.matchedKeywords?.map((word: string) => (
                <span key={word} className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {word}
                </span>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card glass={true} className="p-12 text-center text-muted-foreground">
          No ATS score details found. Please upload and analyze a resume first.
        </Card>
      )}
    </div>
  )
}
