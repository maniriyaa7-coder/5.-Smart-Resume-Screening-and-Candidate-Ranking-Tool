'use client'

import { motion } from 'framer-motion'
import { Calendar, User, Video, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

const interviews = [
  {
    id: 1,
    candidate: 'Sarah Johnson',
    position: 'Senior Frontend Engineer',
    date: 'Tomorrow at 2:00 PM',
    type: 'Video Interview',
    status: 'Scheduled',
    scoreGuide: 'Assess React and system design skills',
  },
  {
    id: 2,
    candidate: 'Michael Chen',
    position: 'Product Manager',
    date: 'Jan 25, 2024 at 3:30 PM',
    type: 'Phone Interview',
    status: 'Scheduled',
    scoreGuide: 'Evaluate product thinking and strategy',
  },
  {
    id: 3,
    candidate: 'Emma Davis',
    position: 'UX Designer',
    date: 'Jan 20, 2024 at 10:00 AM',
    type: 'In-Person',
    status: 'Completed',
    scoreGuide: 'Portfolio review and design thinking',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'default'
    case 'Completed':
      return 'success'
    case 'Cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return Clock
    case 'Completed':
      return CheckCircle
    case 'Cancelled':
      return AlertCircle
    default:
      return Clock
  }
}

export default function InterviewsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Interview Management</h1>
            <p className="text-muted-foreground mt-2">Schedule and track candidate interviews</p>
          </div>
          <Button variant="primary">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </motion.div>

      {/* Interviews List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {interviews.map((interview) => {
          const StatusIcon = getStatusIcon(interview.status)
          return (
            <motion.div key={interview.id} variants={itemVariants}>
              <Card className="hover:bg-primary/5 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{interview.candidate}</h3>
                          <p className="text-muted-foreground text-sm">{interview.position}</p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusColor(interview.status) as any}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {interview.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video className="w-4 h-4" />
                      <span className="text-sm">{interview.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {interview.scoreGuide}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {interview.status === 'Scheduled' && (
                      <>
                        <Button variant="primary" size="sm">
                          Join Interview
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </>
                    )}
                    {interview.status === 'Completed' && (
                      <Button variant="outline" size="sm">
                        View Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
