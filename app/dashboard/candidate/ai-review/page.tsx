'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { useState, useEffect } from 'react'
import { resumeAPI } from '@/lib/api/resume'
import { Sparkles, HelpCircle } from 'lucide-react'

export default function CandidateAiReviewPage() {
  const [aiData, setAiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resumeAPI.getAIAnalysis().then(res => {
      if (res.success) setAiData(res.data.aiAnalysis)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-48 bg-white/5 rounded animate-pulse"></div>
  }

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">AI Resume Review</h1>
        <p className="text-muted-foreground">Detailed improvements and skill gap recommendations</p>
      </div>

      {aiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card glass={true} className="p-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-accent">
              <Sparkles className="w-5 h-5" /> AI Suggestions
            </h3>
            <ul className="space-y-2">
              {aiData.suggestions?.map((item: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card glass={true} className="p-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-red-400">
              <HelpCircle className="w-5 h-5" /> Missing Skills / Gaps
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiData.missingSkills?.map((skill: string) => (
                <Badge key={skill} variant="danger">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card glass={true} className="p-12 text-center text-muted-foreground">
          No AI resume review found. Please upload and analyze a resume first.
        </Card>
      )}
    </div>
  )
}
