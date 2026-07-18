'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/card'
import { ResumeUpload } from '@/components/ResumeUpload'
import { ParsedResumeDisplay } from '@/components/ParsedResumeDisplay'
import { resumeAPI, Resume, ParsedResume } from '@/lib/api/resume'
import { useAuth } from '@/contexts/AuthContext'

export default function CandidateResumePage() {
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

      try {
        const currentResponse = await resumeAPI.getResume()
        if (currentResponse.success && currentResponse.data) {
          setCurrentResume(currentResponse.data.resume)
          loadParsedData()
        }
      } catch (err: any) {
        if (!err.message.includes('No resume found')) {
          throw err
        }
      }

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
        setTimeout(() => {
          loadParsedData()
        }, 3000)
      }
    } catch (err: any) {
      if (err.message.includes('parsing in progress')) {
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
    
    setTimeout(() => {
      loadParsedData()
    }, 2000)
    
    loadResumes()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-4xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your resume for job applications
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <ResumeUpload
        existingResume={currentResume}
        onUploadSuccess={handleUploadSuccess}
      />

      {currentResume && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Extracted Information</h2>
          <ParsedResumeDisplay
            parsedData={parsedData}
            isLoading={parsingLoading}
            error={parsingError}
          />
        </div>
      )}

      {allResumes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upload History</h2>
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
                  {resume.isActive ? (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-semibold rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
