'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card } from '@/components/card'

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-founder', expertise: 'AI & Recruitment' },
  { name: 'Michael Johnson', role: 'CTO & Co-founder', expertise: 'Machine Learning' },
  { name: 'Emma Rodriguez', role: 'Head of Product', expertise: 'User Experience' },
  { name: 'David Kim', role: 'VP Sales', expertise: 'Enterprise Solutions' },
]

const stats = [
  { number: '10K+', label: 'Companies using RecruitAI' },
  { number: '2.5M+', label: 'Candidates analyzed' },
  { number: '500M+', label: 'Resumes processed' },
  { number: '98%', label: 'Customer satisfaction' },
]

export default function AboutPage() {
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
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Hero Section */}
          <motion.div
            className="text-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline">Our Story</Badge>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold">
              Transforming Recruitment with AI
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Founded in 2023, RecruitAI combines cutting-edge artificial intelligence with deep recruitment expertise to revolutionize how companies find and evaluate talent.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center space-y-2 p-6">
                  <div className="text-4xl font-bold text-primary">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                We believe that finding great talent shouldn&apos;t be time-consuming or biased. Our mission is to empower recruiters with intelligent tools that save time, improve quality, and create better hiring outcomes.
              </p>
              <p className="text-lg text-muted-foreground">
                By leveraging advanced AI algorithms, we help companies identify the best candidates faster, reduce hiring bias, and build diverse teams.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-2xl p-8 space-y-4"
            >
              <h3 className="text-2xl font-bold">Why RecruitAI?</h3>
              <ul className="space-y-3">
                {[
                  'State-of-the-art AI technology',
                  'Easy to use interface',
                  'Enterprise-grade security',
                  'Dedicated support team',
                  'Continuous innovation',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experienced leaders in AI, recruitment, and technology
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {team.map((member, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center space-y-4 p-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto" />
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-primary text-sm">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.expertise}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-12 text-center space-y-6"
          >
            <h2 className="text-4xl font-bold">Join Thousands of Companies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your recruitment process with RecruitAI today
            </p>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
