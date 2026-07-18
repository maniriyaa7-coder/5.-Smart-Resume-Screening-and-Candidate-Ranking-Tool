'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Briefcase, MapPin, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Input } from '@/components/input'

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    status: 'Open',
    applicants: 24,
    posted: '5 days ago',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Tech Company',
    location: 'Remote',
    status: 'Open',
    applicants: 18,
    posted: '2 weeks ago',
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'Tech Company',
    location: 'New York, NY',
    status: 'Closed',
    applicants: 42,
    posted: '1 month ago',
  },
  {
    id: 4,
    title: 'Backend Engineer',
    company: 'Tech Company',
    location: 'Remote',
    status: 'Open',
    applicants: 31,
    posted: '1 week ago',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Tech Company',
    location: 'Seattle, WA',
    status: 'Open',
    applicants: 15,
    posted: '3 days ago',
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'Tech Company',
    location: 'Remote',
    status: 'Open',
    applicants: 28,
    posted: '1 week ago',
  },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Closed'>('All')

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-2">Manage your job listings and applicants</p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Open', 'Closed'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredJobs.map((job) => (
          <motion.div key={job.id} variants={itemVariants}>
            <Link href={`/dashboard/jobs/${job.id}`}>
              <Card className="hover:bg-primary/5 transition-colors cursor-pointer h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={job.status === 'Open' ? 'default' : 'outline'}>
                      {job.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredJobs.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs found matching your criteria</p>
        </motion.div>
      )}
    </div>
  )
}
