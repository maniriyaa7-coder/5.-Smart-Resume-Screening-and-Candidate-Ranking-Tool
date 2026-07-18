'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Navbar } from '@/components/navbar'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset requested for:', email)
    setSubmitted(true)
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
        <div className="max-w-md mx-auto">
          <motion.div
            className="glass-card rounded-2xl p-8 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <Badge variant="outline">Reset Password</Badge>
              <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
              <p className="text-muted-foreground">
                {submitted
                  ? 'Check your email for reset instructions'
                  : 'Enter your email and we&apos;ll send you a link to reset it'}
              </p>
            </motion.div>

            {submitted ? (
              <motion.div
                variants={itemVariants}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Email Sent!</p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve sent password reset instructions to {email}
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="primary" size="lg" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button variant="primary" size="lg" type="submit" className="w-full">
                    Send Reset Link <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center text-sm text-foreground/70">
                  Remember your password?{' '}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </Link>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
