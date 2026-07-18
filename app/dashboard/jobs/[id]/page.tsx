'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, MapPin, DollarSign, Users, Calendar, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = {
    id: params.id,
    title: 'Senior Frontend Engineer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    salary: '$150,000 - $200,000',
    status: 'Open',
    applicants: 24,
    posted: '5 days ago',
    description: 'We are looking for an experienced Senior Frontend Engineer to join our growing team...',
    requirements: [
      '5+ years of frontend development experience',
      'Expertise in React and TypeScript',
      'Experience with Next.js',
      'Strong understanding of web performance',
      'Experience with CSS-in-JS solutions',
    ],
    benefits: [
      'Competitive salary and equity',
      'Comprehensive health benefits',
      'Remote work options',
      'Professional development budget',
      '4 weeks PTO',
    ],
  }

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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Job Header */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold">{job.title}</h1>
                <p className="text-muted-foreground mt-2">{job.company}</p>
              </div>
              <Badge variant={job.status === 'Open' ? 'default' : 'outline'}>
                {job.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
              <div>
                <p className="text-muted-foreground text-sm">Location</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{job.location}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Salary</p>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{job.salary}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Applicants</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{job.applicants}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Posted</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{job.posted}</span>
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full">
            <Users className="w-5 h-5 mr-2" />
            View Applicants
          </Button>
        </Card>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="space-y-4">
            <h2 className="text-2xl font-bold">About This Role</h2>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </Card>

          {/* Requirements */}
          <Card className="space-y-4">
            <h2 className="text-2xl font-bold">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-6 sticky top-24">
            <div>
              <h3 className="text-lg font-bold mb-3">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" className="w-full">
              View Applicants
            </Button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
