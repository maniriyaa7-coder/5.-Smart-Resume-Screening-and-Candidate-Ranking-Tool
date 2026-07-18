'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Download, MessageSquare, Eye, CheckCircle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/button'

import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { recruiterAPI } from '@/lib/api/recruiter'
import { resumeAPI } from '@/lib/api/resume'

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
  visible: { opacity: 1, y: 0 },
}

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'atsScore' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const res = await recruiterAPI.getCandidates()
      if (res.success) {
        setCandidates(res.data.candidates)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await recruiterAPI.updateStatus(id, status)
      if (res.success) {
        // Update local state
        setCandidates(prev =>
          prev.map(c => c._id === id ? { ...c, candidateStatus: status } : c)
        )
        if (selectedCandidate && selectedCandidate._id === id) {
          setSelectedCandidate((prev: any) => ({ ...prev, candidateStatus: status }))
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update candidate status')
    }
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(candidates, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "candidates_export.json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImport = async () => {
    const candidatesToImport = [
      {
        fullName: 'Jane Miller',
        email: `jane.miller_${Math.random().toString(36).substring(7)}@example.com`,
        phoneNumber: '555-876-5432',
        college: 'UC Berkeley',
        skills: 'Python, Django, React, AWS',
        currentLocation: 'San Francisco, CA',
        candidateStatus: 'applied'
      },
      {
        fullName: 'William Davies',
        email: `will.davies_${Math.random().toString(36).substring(7)}@example.com`,
        phoneNumber: '555-987-6543',
        college: 'Georgia Tech',
        skills: 'Java, Spring Boot, MySQL, Docker',
        currentLocation: 'Atlanta, GA',
        candidateStatus: 'applied'
      }
    ]

    try {
      const res = await recruiterAPI.importCandidates(candidatesToImport)
      if (res.success) {
        alert(res.message || 'Candidates imported successfully')
        fetchCandidates()
      }
    } catch (err: any) {
      alert(err.message || 'Failed to import candidates')
    }
  }

  // Filter candidates
  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = !selectedStatus || c.candidateStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Sort candidates
  const sorted = [...filtered].sort((a, b) => {
    let fieldA: any = a.createdAt
    let fieldB: any = b.createdAt

    if (sortBy === 'name') {
      fieldA = a.fullName || ''
      fieldB = b.fullName || ''
    } else if (sortBy === 'atsScore') {
      fieldA = a.atsScore?.overallScore || 0
      fieldB = b.atsScore?.overallScore || 0
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offered':
        return 'success'
      case 'interviewed':
        return 'default'
      case 'shortlisted':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return 'outline'
    }
  }

  const handleDownloadResume = (resume: any) => {
    if (!resume || !resume.filename) return
    resumeAPI.downloadResume(resume.filename, resume.originalName)
  }

  const triggerSort = (field: 'name' | 'atsScore' | 'date') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-white/5 rounded animate-pulse w-1/4"></div>
        <div className="h-20 bg-white/5 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-white/5 rounded animate-pulse"></div>
          <div className="h-64 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6 text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">Candidates Management</h2>
            <p className="text-muted-foreground">Search, screen, shortlist, and manage candidate registrations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="primary" size="md" onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Mock Candidates
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters Box */}
      <motion.div variants={itemVariants} className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, email, college, or skills..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground flex gap-1 items-center">
              <ArrowUpDown className="w-4 h-4" /> Sort by:
            </span>
            <Button
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => triggerSort('date')}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'atsScore' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => triggerSort('atsScore')}
            >
              ATS Score
            </Button>
            <Button
              variant={sortBy === 'name' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => triggerSort('name')}
            >
              Name
            </Button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm text-muted-foreground mr-2">Status:</span>
          {['All', 'applied', 'shortlisted', 'interviewed', 'offered', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status === 'All' ? null : status)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                (status === 'All' && !selectedStatus) || selectedStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main content grid split with details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List Column */}
        <div className="lg:col-span-2 space-y-4">
          {paginated.length === 0 ? (
            <div className="glass-card p-12 text-center text-muted-foreground">
              No candidates found matching your criteria.
            </div>
          ) : (
            <motion.div className="space-y-4" variants={containerVariants}>
              {paginated.map((candidate) => (
                <motion.div
                  key={candidate._id}
                  variants={itemVariants}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`cursor-pointer transition-all ${
                    selectedCandidate?._id === candidate._id ? 'scale-[1.01]' : ''
                  }`}
                >
                  <Card
                    glass={true}
                    hover={true}
                    className={`${
                      selectedCandidate?._id === candidate._id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-sm">
                            {candidate.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{candidate.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">College: {candidate.college}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(candidate.candidateStatus)}>
                          {candidate.candidateStatus}
                        </Badge>
                        {candidate.atsScore ? (
                          <span className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ATS: {candidate.atsScore.overallScore}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No Resume</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {candidate.skills?.slice(0, 5).map((s: string) => (
                        <Badge key={s} variant="outline" size="sm">
                          {s}
                        </Badge>
                      ))}
                      {candidate.skills?.length > 5 && (
                        <span className="text-xs text-muted-foreground self-center">+{candidate.skills.length - 5} more</span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({filtered.length} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Candidate Details Panel */}
        <div className="lg:col-span-1">
          {selectedCandidate ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 space-y-6 sticky top-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">
                    {selectedCandidate.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{selectedCandidate.fullName}</h3>
                <Badge variant={getStatusColor(selectedCandidate.candidateStatus)}>
                  {selectedCandidate.candidateStatus}
                </Badge>
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Email</span>
                  <span className="font-medium text-foreground">{selectedCandidate.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Phone</span>
                  <span className="font-medium text-foreground">{selectedCandidate.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">College</span>
                  <span className="font-medium text-foreground">{selectedCandidate.college}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Location</span>
                  <span className="font-medium text-foreground">{selectedCandidate.currentLocation}</span>
                </div>
              </div>

              {/* ATS score metrics */}
              {selectedCandidate.atsScore && (
                <div className="border-t border-border pt-4">
                  <span className="text-muted-foreground block text-xs mb-2">ATS Match Summary</span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">Overall ATS Match</span>
                    <span className="font-bold text-primary">{selectedCandidate.atsScore.overallScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${selectedCandidate.atsScore.overallScore}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="border-t border-border pt-4">
                <span className="text-muted-foreground block text-xs mb-2">Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills?.map((s: string) => (
                    <Badge key={s} variant="outline" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resume download / action */}
              {selectedCandidate.resume && (
                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-muted-foreground block text-xs">Resume File</span>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-border">
                    <span className="text-xs truncate font-medium flex-1 mr-2">{selectedCandidate.resume.originalName}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadResume(selectedCandidate.resume)}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Link to Dedicated candidate details page */}
              <div className="border-t border-border pt-4">
                <Link href={`/dashboard/recruiter/candidates/${selectedCandidate._id}`}>
                  <Button variant="primary" className="w-full text-xs">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile & Notes
                  </Button>
                </Link>
              </div>

              {/* Actions shortlist/reject */}
              <div className="border-t border-border pt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                  disabled={selectedCandidate.candidateStatus === 'shortlisted'}
                  onClick={() => handleStatusUpdate(selectedCandidate._id, 'shortlisted')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                  disabled={selectedCandidate.candidateStatus === 'rejected'}
                  onClick={() => handleStatusUpdate(selectedCandidate._id, 'rejected')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-6 text-center text-muted-foreground h-48 flex items-center justify-center">
              Select a candidate from the list to view full details.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
