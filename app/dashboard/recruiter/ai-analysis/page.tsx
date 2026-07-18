'use client'

import { Card } from '@/components/card'
import { Sparkles, Brain, Code } from 'lucide-react'

export default function RecruiterAiAnalysisPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">AI Candidate Assessment</h1>
        <p className="text-muted-foreground">Monitor AI generated recommendations and skill gaps evaluations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <Brain className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-sm text-muted-foreground">AI Evaluations Run</h3>
              <p className="text-2xl font-bold">120</p>
            </div>
          </div>
        </Card>
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <Sparkles className="w-10 h-10 text-accent" />
            <div>
              <h3 className="text-sm text-muted-foreground">Top Fit Candidates</h3>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </Card>
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <Code className="w-10 h-10 text-yellow-500" />
            <div>
              <h3 className="text-sm text-muted-foreground">Main Identified Skill Gap</h3>
              <p className="text-2xl font-bold">TypeScript</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
