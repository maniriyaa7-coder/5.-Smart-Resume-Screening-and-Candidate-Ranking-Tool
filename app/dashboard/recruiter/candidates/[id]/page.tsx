'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileText, Sparkles, Star, User, BookOpen, Layers, Briefcase, Award, CheckCircle2, MessageSquare, Send, Calendar, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { recruiterAPI } from '@/lib/api/recruiter'
import { resumeAPI } from '@/lib/api/resume'

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

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const candidateId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [candidateData, setCandidateData] = useState<any>(null)
  
  // Note inputs
  const [recruiterNotes, setRecruiterNotes] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')
  const [commMessage, setCommMessage] = useState('')
  const [updatingNotes, setUpdatingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchDetails()
  }, [candidateId])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const res = await recruiterAPI.getCandidateDetails(candidateId)
      if (res.success) {
        setCandidateData(res.data)
        setRecruiterNotes(res.data.candidate.recruiterNotes || '')
        setInterviewNotes(res.data.candidate.interviewNotes || '')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidate details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotes = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUpdatingNotes(true)
      const res = await recruiterAPI.updateNotes(candidateId, {
        recruiterNotes,
        interviewNotes,
        communicationMessage: commMessage || undefined
      })
      if (res.success) {
        setCommMessage('')
        fetchDetails()
        alert('Notes updated successfully')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update notes')
    } finally {
      setUpdatingNotes(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true)
      const res = await recruiterAPI.updateStatus(candidateId, newStatus)
      if (res.success) {
        fetchDetails()
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update candidate status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 text-foreground p-6">
        <div className="h-10 bg-white/5 rounded animate-pulse w-32"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded animate-pulse"></div>
          <div className="h-96 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error || !candidateData) {
    return (
      <div className="text-center py-12 text-foreground space-y-4">
        <p className="text-red-500 font-semibold">{error || 'Candidate not found'}</p>
        <Link href="/dashboard/recruiter">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const { candidate, resume, parsedResume, atsScore, aiAnalysis } = candidateData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'offered': return 'success'
      case 'interviewed': return 'default'
      case 'shortlisted': return 'warning'
      case 'rejected': return 'danger'
      default: return 'outline'
    }
  }

  return (
    <motion.div
      className="space-y-8 text-foreground pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button and Status Controller */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/dashboard/recruiter">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
        </Link>

        {/* Status Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={updatingStatus}
            onClick={() => handleStatusChange('shortlisted')}
            className={candidate.candidateStatus === 'shortlisted' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : ''}
          >
            <Star className="w-4 h-4 mr-1.5" /> Shortlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={updatingStatus}
            onClick={() => handleStatusChange('interviewed')}
            className={candidate.candidateStatus === 'interviewed' ? 'border-primary bg-primary/10 text-primary' : ''}
          >
            <Calendar className="w-4 h-4 mr-1.5" /> Schedule Interview
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={updatingStatus}
            onClick={() => handleStatusChange('offered')}
            className={candidate.candidateStatus === 'offered' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : ''}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Offer Role
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={updatingStatus}
            onClick={() => handleStatusChange('rejected')}
          >
            Reject Candidate
          </Button>
        </div>
      </motion.div>

      {/* Candidate Top Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white/5 to-zinc-900/40 border border-white/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <span className="text-xl font-bold">
                {candidate.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{candidate.fullName || candidate.name}</h1>
                <Badge variant={getStatusBadge(candidate.candidateStatus)} size="sm">
                  {candidate.candidateStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {candidate.email} • {candidate.phoneNumber} • {candidate.currentLocation || 'No Location'}
              </p>
            </div>
          </div>

          {atsScore && (
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block font-semibold uppercase">ATS Score</span>
                <span className="text-2xl font-black text-primary">{atsScore.overallScore}%</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-bold text-xs">
                {atsScore.overallScore >= 80 ? 'A' : atsScore.overallScore >= 60 ? 'B' : 'C'}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Detail Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: parsed resume detail modules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Summary Card */}
          {aiAnalysis && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-accent/10 to-transparent border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-base">AI Resume Analysis</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground/90">
                  {aiAnalysis.summary || 'Summary not calculated. Run ATS Analysis.'}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Education & Background */}
          {parsedResume && parsedResume.education && parsedResume.education.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-bold text-base">Education Background</h3>
                </div>
                <div className="space-y-4">
                  {parsedResume.education.map((edu: any, idx: number) => (
                    <div key={idx} className="border-l border-white/10 pl-4 py-1 space-y-1">
                      <p className="font-bold text-sm text-foreground">{edu.degree || 'Degree / Stream'}</p>
                      <p className="text-xs text-muted-foreground">{edu.institution || 'University / College'}</p>
                      <span className="text-[10px] text-muted-foreground/60">{edu.year || 'Graduation date'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Experience */}
          {parsedResume && parsedResume.experience && parsedResume.experience.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-bold text-base">Professional Experience</h3>
                </div>
                <div className="space-y-4">
                  {parsedResume.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="border-l border-white/10 pl-4 py-1 space-y-2">
                      <div className="flex justify-between items-start flex-wrap">
                        <div>
                          <p className="font-bold text-sm text-foreground">{exp.position}</p>
                          <p className="text-xs text-muted-foreground">{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Projects */}
          {parsedResume && parsedResume.projects && parsedResume.projects.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-bold text-base">Featured Projects</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedResume.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                      <p className="font-bold text-sm text-foreground">{proj.name}</p>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Side: Resume preview, notes console, ATS breakdown */}
        <div className="space-y-6">
          {/* Active File Download / Details */}
          {resume ? (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base">Resume File</h3>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs flex justify-between items-center">
                  <span className="font-semibold truncate max-w-[150px]">{resume.originalName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resumeAPI.downloadResume(resume.filename, resume.originalName)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 text-center text-muted-foreground text-xs">
                No active resume file found.
              </Card>
            </motion.div>
          )}

          {/* Key Skills badge aggregation */}
          {candidate.skills && candidate.skills.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card glass={true} className="p-6 border-white/5 space-y-3">
                <h3 className="font-bold text-base">Keywords & Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notes and History Console */}
          <motion.div variants={itemVariants}>
            <Card glass={true} className="p-6 border-white/5 space-y-4">
              <h3 className="font-bold text-base">Recruitment Notes</h3>
              <form onSubmit={handleUpdateNotes} className="space-y-4">
                {/* Recruiter notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">General Screening Notes</label>
                  <textarea
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    placeholder="Enter screening observations, career match insights..."
                    className="w-full p-3 bg-white/5 text-xs text-foreground border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={4}
                  />
                </div>

                {/* Interview notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">Interview Evaluation Notes</label>
                  <textarea
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Technical assessments, behavioral comments..."
                    className="w-full p-3 bg-white/5 text-xs text-foreground border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={4}
                  />
                </div>

                {/* Send a message / update log */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">New Contact Log</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commMessage}
                      onChange={(e) => setCommMessage(e.target.value)}
                      placeholder="e.g. Sent screening email..."
                      className="flex-1 px-3 py-2 bg-white/5 text-xs text-foreground border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button type="submit" size="sm" disabled={updatingNotes}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <Button variant="primary" size="sm" className="w-full" disabled={updatingNotes}>
                  {updatingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </form>

              {/* Communication History Visual Logs */}
              {candidate.communicationHistory && candidate.communicationHistory.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Communication History</span>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {candidate.communicationHistory.map((history: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white/5 rounded border border-white/5 text-[10px]">
                        <p className="text-foreground">{history.message}</p>
                        <div className="flex justify-between items-center text-muted-foreground mt-1">
                          <span>By {history.author}</span>
                          <span>{new Date(history.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
