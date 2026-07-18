'use client'

import { Card } from '@/components/card'
import { FileText, TrendingUp, Check } from 'lucide-react'

export default function RecruiterResumeAnalysisPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Resume Analysis Dashboard</h1>
        <p className="text-muted-foreground">Monitor resume keyword matches and candidate profile parsing stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <FileText className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-sm text-muted-foreground">Total Resumes Scanned</h3>
              <p className="text-2xl font-bold">142</p>
            </div>
          </div>
        </Card>
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <TrendingUp className="w-10 h-10 text-accent" />
            <div>
              <h3 className="text-sm text-muted-foreground">Avg. Match Score</h3>
              <p className="text-2xl font-bold">81.5%</p>
            </div>
          </div>
        </Card>
        <Card glass={true}>
          <div className="flex gap-4 items-center">
            <Check className="w-10 h-10 text-green-500" />
            <div>
              <h3 className="text-sm text-muted-foreground">Parsing Success Rate</h3>
              <p className="text-2xl font-bold">99.1%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
