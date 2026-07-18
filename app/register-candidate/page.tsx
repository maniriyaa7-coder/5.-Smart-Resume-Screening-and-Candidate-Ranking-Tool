'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Navbar } from '@/components/navbar'

export default function RegisterCandidatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    college: '',
    skills: '',
    currentLocation: '',
    agree: false,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    }

    if (!formData.college.trim()) {
      errors.college = 'College name is required'
    }

    if (!formData.skills.trim()) {
      errors.skills = 'At least one skill is required'
    }

    if (!formData.currentLocation.trim()) {
      errors.currentLocation = 'Current location is required'
    }

    if (!formData.agree) {
      errors.agree = 'You must agree to the Terms of Service'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/auth/candidate/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          college: formData.college,
          skills: formData.skills.split(',').map(s => s.trim()),
          currentLocation: formData.currentLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.success) {
        // Store tokens
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        
        // Redirect to candidate dashboard
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent={false} />

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-card rounded-2xl p-8 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <Badge variant="outline">Candidate Registration</Badge>
              <h1 className="text-3xl font-bold">Create Your Candidate Account</h1>
              <p className="text-muted-foreground">Start your job search journey</p>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value })
                      if (validationErrors.fullName) {
                        setValidationErrors({ ...validationErrors, fullName: '' })
                      }
                    }}
                  />
                  {validationErrors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.fullName}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (validationErrors.email) {
                        setValidationErrors({ ...validationErrors, email: '' })
                      }
                    }}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Password *</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        if (validationErrors.password) {
                          setValidationErrors({ ...validationErrors, password: '' })
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Confirm Password *</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value })
                        if (validationErrors.confirmPassword) {
                          setValidationErrors({ ...validationErrors, confirmPassword: '' })
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, phoneNumber: e.target.value })
                      if (validationErrors.phoneNumber) {
                        setValidationErrors({ ...validationErrors, phoneNumber: '' })
                      }
                    }}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">College/University *</label>
                  <Input
                    type="text"
                    placeholder="Stanford University"
                    value={formData.college}
                    onChange={(e) => {
                      setFormData({ ...formData, college: e.target.value })
                      if (validationErrors.college) {
                        setValidationErrors({ ...validationErrors, college: '' })
                      }
                    }}
                  />
                  {validationErrors.college && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.college}</p>
                  )}
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block">Skills (comma-separated) *</label>
                <Input
                  type="text"
                  placeholder="JavaScript, React, Node.js, Python"
                  value={formData.skills}
                  onChange={(e) => {
                    setFormData({ ...formData, skills: e.target.value })
                    if (validationErrors.skills) {
                      setValidationErrors({ ...validationErrors, skills: '' })
                    }
                  }}
                />
                {validationErrors.skills && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.skills}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block">Current Location *</label>
                <Input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.currentLocation}
                  onChange={(e) => {
                    setFormData({ ...formData, currentLocation: e.target.value })
                    if (validationErrors.currentLocation) {
                      setValidationErrors({ ...validationErrors, currentLocation: '' })
                    }
                  }}
                />
                {validationErrors.currentLocation && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.currentLocation}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => {
                    setFormData({ ...formData, agree: e.target.checked })
                    if (validationErrors.agree) {
                      setValidationErrors({ ...validationErrors, agree: '' })
                    }
                  }}
                  className="w-4 h-4 rounded border border-border"
                />
                <span className="text-sm text-foreground/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>
                </span>
              </motion.div>
              {validationErrors.agree && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.agree}</p>
              )}

              <motion.div variants={itemVariants}>
                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit" 
                  className="w-full" 
                  disabled={!formData.agree || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Candidate Account'} 
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="text-center text-sm text-foreground/70">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
              {' '} | {' '}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                Choose different role
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
