'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    description: '',
    requirements: [] as string[],
    benefits: [] as string[],
  })
  const [currentRequirement, setCurrentRequirement] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating job:', formData)
  }

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement],
      }))
      setCurrentRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit],
      }))
      setCurrentBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
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
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold">Create New Job</h1>
        <p className="text-muted-foreground mt-2">Post a new job opening</p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-6">
            <h2 className="text-2xl font-bold">Basic Information</h2>

            <div>
              <label className="text-sm font-medium mb-2 block">Job Title</label>
              <Input
                placeholder="e.g., Senior Frontend Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Salary Range</label>
                <Input
                  placeholder="e.g., $150,000 - $200,000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <textarea
                placeholder="Describe the job and responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground resize-none"
                rows={6}
              />
            </div>
          </Card>
        </motion.div>

        {/* Requirements */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-6">
            <h2 className="text-2xl font-bold">Requirements</h2>

            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-3 bg-background rounded-lg border border-border"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement..."
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addRequirement()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-6">
            <h2 className="text-2xl font-bold">Benefits</h2>

            <div className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-3 bg-background rounded-lg border border-border"
                >
                  <span>{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a benefit..."
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addBenefit()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addBenefit}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex gap-3">
          <Link href="/dashboard/jobs" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="lg" type="submit" className="flex-1">
            Publish Job
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
