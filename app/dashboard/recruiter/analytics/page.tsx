'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { useState, useEffect } from 'react'
import { recruiterAPI } from '@/lib/api/recruiter'

export default function RecruiterAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recruiterAPI.getAnalytics().then(res => {
      if (res.success) setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="h-64 bg-white/5 rounded animate-pulse"></div>
  }

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into recruitment metrics and performance</p>
      </div>

      <Card glass={true}>
        <CardHeader>
          <CardTitle>Candidates Acquired</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ background: 'rgba(20, 20, 40, 0.8)', border: 'none' }} />
              <Bar dataKey="candidates" name="New Candidates" fill="hsl(264, 100%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
