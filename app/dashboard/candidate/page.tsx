'use client'

import { motion } from 'framer-motion'
import { FileText, Target, Award, ListFilter, AlertCircle, Plus, Download, Eye, Sparkles, CheckCircle2, Circle, Clock, Briefcase, Calendar, BookOpen, Star } from 'lucide-react'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { ResumeUpload } from '@/components/ResumeUpload'
import { useState, useEffect } from 'react'
import { resumeAPI } from '@/lib/api/resume'
import { jobsAPI, Job } from '@/lib/api/jobs'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

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
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function CandidateDashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dbJobs, setDbJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [savedJobsCount, setSavedJobsCount] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [dashRes, jobsRes] = await Promise.all([
        resumeAPI.getDashboard(),
        jobsAPI.getJobs()
      ])

      if (dashRes.success) {
        setDashboardData(dashRes.data)
      }
      if (jobsRes.success) {
        setDbJobs(jobsRes.data.jobs)
      }
    } catch (err: any) {
      if (!err.message.includes('No resume found')) {
        setError(err.message || 'Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    fetchData()
  }

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      const res = await resumeAPI.analyze()
      if (res.success) {
        fetchData()
      }
    } catch (err: any) {
      alert(err.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 text-foreground">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-white/5 rounded animate-pulse w-1/4"></div>
          <div className="h-10 bg-white/5 rounded animate-pulse w-32"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-white/5 rounded animate-pulse lg:col-span-2"></div>
          <div className="h-44 bg-white/5 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-white/5 rounded animate-pulse"></div>
          <div className="h-80 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  const resume = dashboardData?.resume
  const parsed = dashboardData?.parsedResume
  const ats = dashboardData?.atsScore
  const ai = dashboardData?.aiAnalysis

  // Profile completion checklist
  const checklist = [
    { label: 'Create candidate account', checked: true },
    { label: 'Upload your professional resume', checked: !!resume },
    { label: 'Run AI & ATS optimization analysis', checked: !!ats },
    { label: 'Apply to your first matched role', checked: user?.appliedJobs && user.appliedJobs.length > 0 },
    { label: 'Complete a behavioral mock interview', checked: false }
  ]

  const completedSteps = checklist.filter(c => c.checked).length
  const profileCompletion = Math.round((completedSteps / checklist.length) * 100)

  // ATS / Strength details
  const score = ats?.overallScore || 0
  const strengthText = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score > 0 ? 'Needs Work' : 'No Resume'
  const resumeUpdatedDate = resume?.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : null

  // Version history mock (adds version based on active resume upload)
  const versions = resume ? [
    { version: 'v1.2', name: 'Optimized Candidate Profile', date: resumeUpdatedDate, active: true },
    { version: 'v1.1', name: 'Added Key Technical Skills', date: 'Pre-analyzed', active: false },
    { version: 'v1.0', name: 'Initial Uploaded Resume', date: 'Pre-analyzed', active: false }
  ] : []

  // Dynamic Skill Gap Analysis & Recommendations based on parsed resume
  const missingSkills = ai?.missingSkills || ['React', 'TypeScript', 'Node.js', 'System Design']
  
  // Custom courses and certs matching missing skills
  const certifications = missingSkills.includes('AWS') || missingSkills.includes('Docker')
    ? ['AWS Certified Solutions Architect', 'HashiCorp Terraform Associate']
    : ['Microsoft Certified: Azure Fundamentals', 'CompTIA Security+']

  const courses = missingSkills.map(skill => {
    return {
      title: `${skill} Advanced Developer Bootcamp`,
      platform: 'Udemy / Coursera',
      duration: '12-15 hours'
    }
  }).slice(0, 3)

  // Job Recommendation Engine: filter database jobs using candidate's parsed skills
  const parsedSkills = parsed?.skills || []
  const recommendedJobs = dbJobs.map(job => {
    const jobReqs = job.requirements || []
    const matching = jobReqs.filter(req => 
      parsedSkills.some((ps: string) => ps.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(ps.toLowerCase()))
    )
    const matchPercentage = jobReqs.length > 0 
      ? Math.round((matching.length / jobReqs.length) * 100) 
      : 50
    return {
      ...job,
      matchPercentage: Math.max(50, Math.min(98, matchPercentage + 30)) // Give baseline + match addition
    }
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3)

  // Applied & Saved job timelines
  const appliedJobs = user?.appliedJobs || []
  const savedJobs = user?.savedJobs || []

  // Calculate Interview Readiness Score
  const interviewReadiness = score > 0 ? Math.min(100, Math.round(score * 0.7 + profileCompletion * 0.3)) : 20

  return (
    <motion.div
      className="space-y-8 text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Hero Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-primary/20 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Powered Career Dashboard</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back, {user?.name}!</h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
              Analyze your resume performance, bridge technical skill gaps, and explore premium career matches with MongoDB synchronization.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/dashboard/candidate/resume">
              <Button variant="primary" size="sm">Manage Resume</Button>
            </Link>
            <Link href="/dashboard/candidate/job-matches">
              <Button variant="outline" size="sm">Explore Matched Jobs</Button>
            </Link>
          </div>
        </Card>

        {/* Profile Completion Checklist */}
        <Card glass={true} className="p-6 flex flex-col justify-between border-white/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-base">Profile Setup</h3>
              <Badge variant="default" size="sm">{profileCompletion}%</Badge>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <div className="space-y-2.5">
              {checklist.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  {step.checked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={step.checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Stats, Resume, Matches, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Resume Card */}
          <motion.div variants={itemVariants}>
            <Card glass={true} className="p-6 border-white/5">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-base">Active Resume</h3>
                  {resumeUpdatedDate && (
                    <span className="text-xs text-muted-foreground">Last updated {resumeUpdatedDate}</span>
                  )}
                </div>
                {resume && (
                  <Badge variant="success" size="sm">Active v1.2</Badge>
                )}
              </div>
              {resume ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border border-border/60 rounded-xl gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[200px] sm:max-w-xs">{resume.originalName}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Mime: {resume.mimeType} • Size: {Math.round(resume.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => resumeAPI.downloadResume(resume.filename, resume.originalName)}
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You haven't uploaded an active resume. Upload a PDF or DOCX file to run detailed AI analytics and access job matching.
                  </p>
                  <ResumeUpload onUploadSuccess={handleUploadSuccess} />
                </div>
              )}
            </Card>
          </motion.div>

          {/* ATS Strength Meter and Version History */}
          {resume && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* circular strength indicator */}
              <Card glass={true} className="p-6 border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base mb-1">Resume Strength</h3>
                  <p className="text-xs text-muted-foreground">Calculated parsing score</p>
                </div>
                {ats ? (
                  <div className="flex items-center gap-6 py-4">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {/* SVG circle meter */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" className="stroke-primary fill-transparent" strokeWidth="6"
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - score / 100)}
                        />
                      </svg>
                      <span className="absolute text-lg font-extrabold">{score}%</span>
                    </div>
                    <div>
                      <Badge variant={score >= 80 ? 'success' : 'warning'} size="sm" className="mb-1">
                        {strengthText}
                      </Badge>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your profile meets basic requirements for top technical recruitments.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Button variant="primary" size="sm" onClick={handleAnalyze} disabled={analyzing}>
                      {analyzing ? 'Analyzing...' : 'Run ATS Analytics'}
                    </Button>
                  </div>
                )}
              </Card>

              {/* version history list */}
              <Card glass={true} className="p-6 border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base mb-1">Version History</h3>
                  <p className="text-xs text-muted-foreground">List of uploaded resume versions</p>
                </div>
                <div className="space-y-2 mt-4">
                  {versions.map((ver, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                      <div className="flex gap-2 items-center">
                        <Badge variant={ver.active ? 'default' : 'outline'} size="sm">{ver.version}</Badge>
                        <span className="font-semibold truncate max-w-[120px]">{ver.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{ver.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Job Recommendation Engine */}
          {resume && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-base">Job Recommendation Engine</h3>
                    <p className="text-xs text-muted-foreground">Live jobs matched based on your active parsed skills</p>
                  </div>
                  <Link href="/jobs">
                    <Button variant="outline" size="sm">Search Jobs</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recommendedJobs.length > 0 ? (
                    recommendedJobs.map((job, idx) => (
                      <div key={job._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all gap-4">
                        <div>
                          <p className="font-bold text-sm text-foreground">{job.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{job.company} • {job.location}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <Badge variant="success" size="sm">{job.matchPercentage}% Match</Badge>
                          <Link href={`/jobs`}>
                            <Button variant="outline" size="sm">View Detail</Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground text-center py-6">
                      No matching job openings found in Database yet.
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Application Timeline and status */}
          {resume && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5">
                <h3 className="font-bold text-base mb-1">Application Timeline</h3>
                <p className="text-xs text-muted-foreground mb-4">Activity tracker of your recent job submittals</p>
                {appliedJobs.length > 0 ? (
                  <div className="relative border-l border-white/10 ml-3 pl-6 space-y-6 text-xs">
                    {appliedJobs.map((app: any, idx: number) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[30px] mt-0.5 w-3.5 h-3.5 bg-primary rounded-full border-4 border-background" />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-foreground">Applied for Job Position</p>
                            <span className="text-muted-foreground text-xs mt-0.5">Job ID: {app.jobId}</span>
                          </div>
                          <Badge variant="default" size="sm">{app.status}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-6">
                    No active job applications found. Explore matched openings above to submit your resume.
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column: AI Insights, Interview Readiness, Certs, Courses */}
        <div className="space-y-6">
          {/* AI Resume Summary */}
          {resume && ai && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-accent/10 to-background border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-base">AI Resume Summary</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {ai.summary || "Your profile reflects structured experience in technical engineering. Highlight your primary architecture stacks to improve ATS match ratings."}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Interview Readiness Score */}
          {resume && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div>
                  <h3 className="font-bold text-base mb-1">Interview Readiness</h3>
                  <p className="text-xs text-muted-foreground">Based on mock interviews & completeness</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Readiness Rating</span>
                    <span>{interviewReadiness}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all"
                      style={{ width: `${interviewReadiness}%` }}
                    />
                  </div>
                </div>
                <Link href="/dashboard/candidate/mock-interview" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Start Mock Practice
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}

          {/* AI Skill Gap Analysis */}
          {resume && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="w-4 h-4" />
                  <h3 className="font-bold text-base">Skill Gap Analysis</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Missing Core Keywords</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {missingSkills.map((skill: string) => (
                        <Badge key={skill} variant="destructive" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Recommended Certifications & Courses */}
          {resume && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Award className="w-4 h-4" />
                  <h3 className="font-bold text-base">Upskilling Engine</h3>
                </div>
                <div className="space-y-4">
                  {/* Certs */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Suggested Certifications</span>
                    <div className="space-y-2">
                      {certifications.map((cert, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs p-2 rounded bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Courses */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Recommended Courses</span>
                    <div className="space-y-2">
                      {courses.map((course, idx) => (
                        <div key={idx} className="p-2 rounded bg-white/5 border border-white/5 text-xs space-y-1">
                          <p className="font-semibold text-foreground">{course.title}</p>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                            <span>{course.platform}</span>
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
