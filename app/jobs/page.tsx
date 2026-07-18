'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, DollarSign, Briefcase, Heart, Share2, Search, CheckCircle2, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Input } from '@/components/input'
import { Navbar } from '@/components/navbar'
import { jobsAPI, Job } from '@/lib/api/jobs'
import { useAuth } from '@/contexts/AuthContext'

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

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savingJobId, setSavingJobId] = useState<string | null>(null)
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null)

  // Load jobs from MongoDB
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await jobsAPI.getJobs()
      if (res.success) {
        setJobs(res.data.jobs)
        if (res.data.jobs.length > 0) {
          setSelectedJob(res.data.jobs[0])
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = async (jobId: string) => {
    if (!user) {
      alert('Please log in as a candidate to save jobs')
      return
    }
    try {
      setSavingJobId(jobId)
      await jobsAPI.saveJob(jobId)
      // Toggle locally
      if (selectedJob && selectedJob._id === jobId) {
        // Toggled
      }
      alert('Job bookmark updated successfully!')
      fetchJobs()
    } catch (err: any) {
      alert(err.message || 'Failed to bookmark job')
    } finally {
      setSavingJobId(null)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert('Please log in as a candidate to apply')
      return
    }
    try {
      setApplyingJobId(jobId)
      const res = await jobsAPI.applyJob(jobId)
      if (res.success) {
        alert(res.message || 'Successfully applied!')
        fetchJobs()
        // Refresh selected job
        const updated = await jobsAPI.getJobDetails(jobId)
        if (updated.success) {
          setSelectedJob(updated.data.job)
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to apply')
    } finally {
      setApplyingJobId(null)
    }
  }

  const handleWithdraw = async (jobId: string) => {
    try {
      setApplyingJobId(jobId)
      const res = await jobsAPI.withdrawJob(jobId)
      if (res.success) {
        alert(res.message || 'Withdrawn successfully')
        fetchJobs()
        const updated = await jobsAPI.getJobDetails(jobId)
        if (updated.success) {
          setSelectedJob(updated.data.job)
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw application')
    } finally {
      setApplyingJobId(null)
    }
  }

  // Filter jobs locally based on search
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasApplied = (job: Job) => {
    if (!user) return false
    return job.applicants.some((app) => app.userId.toString() === user._id.toString())
  }

  const isSaved = (jobId: string) => {
    // If user model holds savedJobs list
    return user?.savedJobs?.includes(jobId) || false
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar transparent={false} />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 space-y-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight">Explore Live Openings</h1>
          <p className="text-muted-foreground text-sm">Discover positions integrated with MERN stack synchronization.</p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder="Search job titles, companies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="text-base"
          />
        </motion.div>

        {loading ? (
          <div className="h-64 bg-white/5 rounded animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Job Cards List */}
            <motion.div
              className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.map((job) => {
                const applied = hasApplied(job)
                return (
                  <motion.button
                    key={job._id}
                    variants={itemVariants}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedJob?._id === job._id
                        ? 'bg-primary/10 border-primary shadow'
                        : 'bg-card border-border hover:border-foreground/20'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-foreground leading-tight">{job.title}</h3>
                        {applied && <Badge variant="success" size="sm">Applied</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{job.company}</p>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground/80 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" /> {job.location}
                        </span>
                        <Badge variant="outline" size="sm">{job.type}</Badge>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No active openings found matching search filters.
                </div>
              )}
            </motion.div>

            {/* Right Column: Detailed Job View */}
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  key={selectedJob._id}
                >
                  <Card glass={true} className="space-y-6 border-white/5">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                        <div>
                          <h2 className="text-3xl font-extrabold tracking-tight">{selectedJob.title}</h2>
                          <p className="text-sm text-muted-foreground font-medium mt-1">{selectedJob.company}</p>
                        </div>
                        <Badge variant={selectedJob.status === 'Open' ? 'success' : 'outline'}>
                          {selectedJob.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-white/10 text-xs">
                        <div>
                          <span className="text-muted-foreground block font-medium">Location</span>
                          <span className="font-bold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedJob.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Salary Range</span>
                          <span className="font-bold flex items-center gap-1 mt-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-primary" /> {selectedJob.salary || 'Competitive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Contract Type</span>
                          <Badge variant="outline" size="sm" className="mt-0.5">{selectedJob.type}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h3 className="text-base font-bold text-foreground">Role Description</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-base font-bold text-foreground font-semibold">Key Requirements</h3>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-base font-bold text-foreground font-semibold">Perks & Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.benefits.map((benefit, i) => (
                            <Badge key={i} variant="outline" size="sm">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Actions */}
                    <div className="flex gap-3 pt-6 border-t border-white/10">
                      {hasApplied(selectedJob) ? (
                        <Button
                          variant="destructive"
                          size="lg"
                          className="flex-1"
                          disabled={applyingJobId === selectedJob._id}
                          onClick={() => handleWithdraw(selectedJob._id)}
                        >
                          Withdraw Application
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="lg"
                          className="flex-1"
                          disabled={applyingJobId === selectedJob._id || selectedJob.status !== 'Open'}
                          onClick={() => handleApply(selectedJob._id)}
                        >
                          {applyingJobId === selectedJob._id ? 'Submitting...' : 'Apply for this Role'}
                        </Button>
                      )}
                      <Button
                        variant={isSaved(selectedJob._id) ? 'primary' : 'outline'}
                        size="lg"
                        disabled={savingJobId === selectedJob._id}
                        onClick={() => handleSaveToggle(selectedJob._id)}
                      >
                        <Heart className="w-5 h-5" fill={isSaved(selectedJob._id) ? 'currentColor' : 'none'} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="lg:col-span-2 text-center py-20 text-muted-foreground/60 text-sm">
                  Select an opening to review details.
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
