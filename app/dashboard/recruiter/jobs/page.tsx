'use client'

import { motion } from 'framer-motion'
import { Plus, Briefcase, MapPin, Users, Calendar, Trash2, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Input } from '@/components/input'
import { useState, useEffect } from 'react'
import { jobsAPI, Job } from '@/lib/api/jobs'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await jobsAPI.getJobs()
      if (res.success) {
        setJobs(res.data.jobs)
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return
    try {
      setDeletingJobId(id)
      const res = await jobsAPI.deleteJob(id)
      if (res.success) {
        alert(res.message || 'Job deleted successfully')
        fetchJobs()
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete job')
    } finally {
      setDeletingJobId(null)
    }
  }

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-white/5 rounded animate-pulse w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-44 bg-white/5 rounded animate-pulse"></div>
          <div className="h-44 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-8 text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Active Job Postings</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage your job openings and review candidates.</p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-1.5" /> Post New Job
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search your job listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <motion.div key={job._id} variants={itemVariants}>
            <Card glass={true} className="flex flex-col justify-between h-full border-white/5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{job.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-xs">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <Badge variant={job.status === 'Open' ? 'success' : 'outline'}>
                    {job.status}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{job.applicants ? job.applicants.length : 0} applicants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/jobs/${job._id}`}>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingJobId === job._id}
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground text-xs">
            No active job postings found. Click "Post New Job" above to get started.
          </div>
        )}
      </div>
    </motion.div>
  )
}
