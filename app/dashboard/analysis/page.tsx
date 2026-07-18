'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, Zap, AlertCircle, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

const skills = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Language' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Next.js', level: 88, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 92, category: 'Styling' },
  { name: 'GraphQL', level: 80, category: 'API' },
]

const recommendations = [
  'Add quantifiable achievements to your experience section',
  'Include specific technologies and frameworks you have used',
  'Improve formatting consistency throughout the document',
  'Add a dedicated skills section for better ATS parsing',
  'Include relevant certifications and awards',
]

export default function AnalysisPage() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Resume Analysis</h1>
            <p className="text-muted-foreground mt-2">
              John_Doe_Resume_2024.pdf
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ATS Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="gradient-bg from-primary/20 to-accent/20 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-muted-foreground">ATS Score</p>
              <div className="text-6xl font-bold gradient-text">92%</div>
              <Badge className="mt-4">Excellent Match</Badge>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <div className="text-center">
                <Target className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-semibold">Excellent</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Keywords Found', value: '45/50', icon: Zap },
          { label: 'Formatting Score', value: '88%', icon: TrendingUp },
          { label: 'Readability', value: '91%', icon: AlertCircle },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={i} variants={itemVariants}>
              <Card className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Skills Grid */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold">Detected Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{skill.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-primary">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold">AI Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-foreground/80">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
