'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Users, Clock, Percent } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'

const chartData = [
  { month: 'Jan', interviews: 12, offers: 3, hires: 2 },
  { month: 'Feb', interviews: 19, offers: 5, hires: 4 },
  { month: 'Mar', interviews: 28, offers: 8, hires: 6 },
  { month: 'Apr', interfaces: 22, offers: 7, hires: 5 },
  { month: 'May', interviews: 35, offers: 12, hires: 9 },
  { month: 'Jun', interviews: 40, offers: 15, hires: 12 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AnalyticsPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Track your hiring metrics and performance</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { label: 'Total Interviews', value: '156', icon: Users, change: '+24%' },
          { label: 'Avg. Interview Time', value: '45 min', icon: Clock, change: '-5%' },
          { label: 'Offer Accept Rate', value: '78%', icon: Percent, change: '+12%' },
          { label: 'Time to Hire', value: '18 days', icon: TrendingUp, change: '-8%' },
        ].map((metric, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card glass={true}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <p className="text-xs text-emerald-500 mt-2">{metric.change} vs last month</p>
                </div>
                <metric.icon className="w-5 h-5 text-primary/40" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card glass={true}>
            <CardHeader>
              <CardTitle>Hiring Funnel</CardTitle>
              <CardDescription>Interviews to hires conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: 'rgba(20, 20, 40, 0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="interviews" fill="hsl(264, 100%, 50%)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="offers" fill="hsl(170, 100%, 45%)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="hires" fill="hsl(130, 80%, 50%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card glass={true}>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Hiring volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: 'rgba(20, 20, 40, 0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="interviews" stroke="hsl(264, 100%, 50%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hires" stroke="hsl(130, 80%, 50%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
