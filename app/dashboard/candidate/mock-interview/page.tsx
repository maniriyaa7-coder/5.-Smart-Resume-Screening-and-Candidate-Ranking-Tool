'use client'

import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Video, Clock, Mic } from 'lucide-react'

export default function CandidateMockInterviewPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Mock Interview</h1>
        <p className="text-muted-foreground">Practice interviews to improve your performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass={true} className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <span className="p-3 bg-primary/20 rounded-xl">
              <Video className="w-6 h-6 text-primary" />
            </span>
            <div>
              <h3 className="font-bold text-xl">Technical Interview</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Practice coding and system design questions with AI feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~30 minutes • 15 questions</span>
          </div>
          <Button variant="primary" className="w-full">Start Practice Session</Button>
        </Card>

        <Card glass={true} className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <span className="p-3 bg-accent/20 rounded-xl">
              <Mic className="w-6 h-6 text-accent" />
            </span>
            <div>
              <h3 className="font-bold text-xl">Behavioral Interview</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Answer situational and behavioral questions with scoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~20 minutes • 10 questions</span>
          </div>
          <Button variant="outline" className="w-full">Start Practice Session</Button>
        </Card>
      </div>
    </div>
  )
}
