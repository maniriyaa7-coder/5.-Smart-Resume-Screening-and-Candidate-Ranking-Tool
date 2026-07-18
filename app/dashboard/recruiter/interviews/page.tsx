'use client'

import { Card } from '@/components/card'
import { Video, Calendar, Clock } from 'lucide-react'

export default function RecruiterInterviewsPage() {
  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Interviews</h1>
        <p className="text-muted-foreground">Manage candidate interviews and meetings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass={true}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-primary/20 text-primary rounded-lg">
                <Video className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Confirmed</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Alice Johnson - Technical Assessment</h3>
              <p className="text-sm text-muted-foreground">Senior Frontend Engineer Role</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tomorrow</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 10:00 AM - 11:00 AM</span>
            </div>
          </div>
        </Card>

        <Card glass={true}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-primary/20 text-primary rounded-lg">
                <Video className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Confirmed</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Bob Smith - Product Round</h3>
              <p className="text-sm text-muted-foreground">Product Manager Role</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> July 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 2:00 PM - 3:00 PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
