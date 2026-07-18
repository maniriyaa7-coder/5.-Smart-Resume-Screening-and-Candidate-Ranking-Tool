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

export default function RegisterRecruiterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    recruiterName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    companyWebsite: '',
    companyLocation: '',
    agree: false,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required'
    }

    if (!formData.recruiterName.trim()) {
      errors.recruiterName = 'Recruiter name is required'
    } else if (formData.recruiterName.trim().length < 2) {
      errors.recruiterName = 'Recruiter name must be at least 2 characters'
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

    if (!formData.companyWebsite.trim()) {
      errors.companyWebsite = 'Company website is required'
    } else if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.companyWebsite)) {
      errors.companyWebsite = 'Please enter a valid website URL'
    }

    if (!formData.companyLocation.trim()) {
      errors.companyLocation = 'Company location is required'
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
      const response = await fetch(`${apiBaseUrl}/auth/recruiter/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          companyName: formData.companyName,
          recruiterName: formData.recruiterName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          companyWebsite: formData.companyWebsite,
          companyLocation: formData.companyLocation,
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
        
        // Redirect to recruiter dashboard
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
              <Badge variant="outline">Recruiter Registration</Badge>
              <h1 className="text-3xl font-bold">Create Your Recruiter Account</h1>
              <p className="text-muted-foreground">Start hiring top talent with AI</p>
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
                  <label className="text-sm font-medium mb-2 block">Company Name *</label>
                  <Input
                    type="text"
                    placeholder="TechCorp Inc"
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value })
                      if (validationErrors.companyName) {
                        setValidationErrors({ ...validationErrors, companyName: '' })
                      }
                    }}
                  />
                  {validationErrors.companyName && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.companyName}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Recruiter Name *</label>
                  <Input
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.recruiterName}
                    onChange={(e) => {
                      setFormData({ ...formData, recruiterName: e.target.value })
                      if (validationErrors.recruiterName) {
                        setValidationErrors({ ...validationErrors, recruiterName: '' })
                      }
                    }}
                  />
                  {validationErrors.recruiterName && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.recruiterName}</p>
                  )}
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block">Email Address *</label>
                <Input
                  type="email"
                  placeholder="recruiter@company.com"
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
                  <label className="text-sm font-medium mb-2 block">Company Website *</label>
                  <Input
                    type="text"
                    placeholder="https://company.com"
                    value={formData.companyWebsite}
                    onChange={(e) => {
                      setFormData({ ...formData, companyWebsite: e.target.value })
                      if (validationErrors.companyWebsite) {
                        setValidationErrors({ ...validationErrors, companyWebsite: '' })
                      }
                    }}
                  />
                  {validationErrors.companyWebsite && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.companyWebsite}</p>
                  )}
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block">Company Location *</label>
                <Input
                  type="text"
                  placeholder="New York, NY"
                  value={formData.companyLocation}
                  onChange={(e) => {
                    setFormData({ ...formData, companyLocation: e.target.value })
                    if (validationErrors.companyLocation) {
                      setValidationErrors({ ...validationErrors, companyLocation: '' })
                    }
                  }}
                />
                {validationErrors.companyLocation && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.companyLocation}</p>
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
                  {isLoading ? 'Creating Account...' : 'Create Recruiter Account'} 
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
