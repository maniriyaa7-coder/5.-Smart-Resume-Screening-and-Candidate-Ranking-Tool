'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, TrendingUp, Lock, Users, BarChart3, Gauge, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card } from '@/components/card'

const features = [
  {
    icon: Brain,
    title: 'AI Resume Analysis',
    description: 'Advanced AI algorithms analyze resumes and extract key information automatically.',
  },
  {
    icon: Gauge,
    title: 'ATS Scoring',
    description: 'Get accurate ATS (Applicant Tracking System) scores for every candidate.',
  },
  {
    icon: TrendingUp,
    title: 'Candidate Ranking',
    description: 'Intelligent ranking system to identify top candidates for your roles.',
  },
  {
    icon: Zap,
    title: 'Quick Processing',
    description: 'Process hundreds of resumes in minutes with our powerful AI engine.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share insights and collaborate with your team in real-time.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track hiring metrics and optimize your recruitment process.',
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Enterprise-grade security to protect candidate and company data.',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'AI-powered job-to-candidate matching for better results.',
  },
]

export default function FeaturesPage() {
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

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline">Powerful Features</Badge>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold">
              Everything You Need
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to streamline your recruitment process
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover:bg-primary/5 transition-colors">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-20 text-center space-y-6"
          >
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
