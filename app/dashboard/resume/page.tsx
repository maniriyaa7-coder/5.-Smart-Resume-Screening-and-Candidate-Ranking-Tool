'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/card'
import { ResumeUpload } from '@/components/ResumeUpload'
import { ParsedResumeDisplay } from '@/components/ParsedResumeDisplay'
import { resumeAPI, Resume, ParsedResume } from '@/lib/api/resume'
import { useAuth } from '@/contexts/AuthContext'

export default function ResumePage() {
  const { user } = useAuth()
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null)
  const [allResumes, setAllResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [parsingLoading, setParsingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsingError, setParsingError] = useState<string | null>(null)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load current active resume
      try {
        const currentResponse = await resumeAPI.getResume()
        if (currentResponse.success && currentResponse.data) {
          setCurrentResume(currentResponse.data.resume)
          
          // Load parsed data for current resume
          loadParsedData()
        }
      } catch (err: any) {
        // No resume found is ok
        if (!err.message.includes('No resume found')) {
          throw err
        }
      }

      // Load all resumes
      const allResponse = await resumeAPI.getAllResumes()
      if (allResponse.success && allResponse.data) {
        setAllResumes(allResponse.data.resumes)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const loadParsedData = async () => {
    try {
      setParsingLoading(true)
      setParsingError(null)

      const response = await resumeAPI.getParsedResume()
      
      if (response.success && response.data) {
        setParsedData(response.data.parsedResume)
      } else if (response.isParsing) {
        // Still parsing, retry after a delay
        setTimeout(() => {
          loadParsedData()
        }, 3000) // Retry after 3 seconds
      }
    } catch (err: any) {
      if (err.message.includes('parsing in progress')) {
        // Retry after delay
        setTimeout(() => {
          loadParsedData()
        }, 3000)
      } else {
        setParsingError(err.message || 'Failed to load parsed data')
      }
    } finally {
      setParsingLoading(false)
    }
  }

  const handleUploadSuccess = (resume: Resume) => {
    setCurrentResume(resume)
    setParsedData(null)
    
    // Start polling for parsed data
    setTimeout(() => {
      loadParsedData()
    }, 2000) // Start checking after 2 seconds
    
    loadResumes() // Reload all resumes
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
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

  if (user?.role !== 'candidate') {
    return (
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Recruiter Account</h2>
            <p className="text-muted-foreground">
              Resume upload is only available for candidate accounts.
            </p>
          </Card>
        </motion.div>
      </motion.div>
    )
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
        <h1 className="text-4xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your resume for job applications
        </p>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </motion.div>
      )}

      {/* Upload Component */}
      <motion.div variants={itemVariants}>
        <ResumeUpload
          existingResume={currentResume}
          onUploadSuccess={handleUploadSuccess}
        />
      </motion.div>

      {/* Parsed Resume Data */}
      {currentResume && (
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4">Extracted Information</h2>
          <ParsedResumeDisplay
            parsedData={parsedData}
            isLoading={parsingLoading}
            error={parsingError}
          />
        </motion.div>
      )}

      {/* Upload History */}
      {allResumes.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4">Upload History</h2>
          <div className="space-y-3">
            {allResumes.map((resume) => (
              <Card
                key={resume._id}
                className={`flex items-center justify-between p-4 ${
                  resume.isActive ? 'border-primary' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{resume.originalName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(resume.uploadedAt).toLocaleDateString()} •{' '}
                        {formatFileSize(resume.size)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {resume.isActive && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  )}
                  {!resume.isActive && (
                    <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-semibold rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div variants={itemVariants}>
          <Card className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading resumes...</p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
