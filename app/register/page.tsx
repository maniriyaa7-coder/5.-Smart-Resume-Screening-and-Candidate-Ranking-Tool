'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/badge'
import { Navbar } from '@/components/navbar'

export default function RegisterPage() {
  const router = useRouter()

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
        <motion.div
          className="max-w-2xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <Badge variant="outline">Get Started</Badge>
            <h1 className="text-4xl font-bold">Choose Your Role</h1>
            <p className="text-lg text-muted-foreground">Select how you&apos;ll be using RecruitAI</p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <motion.button
              onClick={() => router.push('/register-recruiter')}
              className="glass-card rounded-2xl p-6 space-y-4 hover:bg-primary/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Recruiter</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Screen candidates</li>
                <li>Manage job postings</li>
                <li>AI-powered matching</li>
              </ul>
            </motion.button>

            <motion.button
              onClick={() => router.push('/register-candidate')}
              className="glass-card rounded-2xl p-6 space-y-4 hover:bg-accent/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Candidate</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Upload resume</li>
                <li>Get ATS score</li>
                <li>Find jobs</li>
              </ul>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
