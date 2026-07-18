'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Brain, TrendingUp, Lock, Users, BarChart3, Gauge, Sparkles, Star, Play } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { Navbar } from '@/components/navbar'
import { Modal } from '@/components/modal'

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

export default function Home() {
  const [showDemoModal, setShowDemoModal] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent={true} />
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="Watch Demo"
      >
        <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <Play className="w-16 h-16 text-primary mx-auto" />
            <p className="text-foreground">Demo video will play here</p>
          </div>
        </div>
      </Modal>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center space-y-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline">✨ AI-Powered Recruitment</Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="gradient-text">Find Your Perfect</span>
              <br />
              <span className="text-foreground">Talent in Minutes</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI to analyze candidates, screen resumes, and predict job fit with unprecedented accuracy.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <button onClick={() => setShowDemoModal(true)}>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </button>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 1 }}
            className="glass-card rounded-2xl p-2 md:p-4 shadow-2xl"
          >
            <div className="bg-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-muted-foreground">dashboard.recruitai.com</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-secondary/20 rounded-lg p-4 space-y-2">
                    <div className="h-3 bg-primary/30 rounded w-1/2" />
                    <div className="h-2 bg-primary/20 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: 'Hiring Teams', value: '10K+' },
              { label: 'Candidates Screened', value: '2.5M+' },
              { label: 'Time Saved', value: '70%' },
              { label: 'Avg. Satisfaction', value: '4.9★' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a world-class recruitment process
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Brain, title: 'AI Resume Screening', desc: 'Automatically analyze and score resumes' },
              { icon: Gauge, title: 'Job Fit Prediction', desc: 'Predict candidate success with ML models' },
              { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Track hiring metrics in real-time' },
              { icon: Lock, title: 'Enterprise Security', desc: 'Bank-level encryption & compliance' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Process 1000s of candidates instantly' },
              { icon: Users, title: 'Team Collaboration', desc: 'Work together seamlessly' },
              { icon: BarChart3, title: 'Advanced Reports', desc: 'Deep insights into hiring pipeline' },
              { icon: Sparkles, title: 'AI Interview Prep', desc: 'AI-powered interview guidance' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card glass={true} hover={true}>
                  <div className="flex flex-col items-start gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { step: '1', title: 'Upload Jobs', desc: 'Post your job requirements' },
              { step: '2', title: 'Submit Candidates', desc: 'Add candidates to screen' },
              { step: '3', title: 'Get AI Insights', desc: 'Receive detailed AI analysis' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <Card glass={true}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Loved by Recruiters
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Sarah Johnson',
                role: 'HR Director',
                company: 'TechCorp',
                quote: 'RecruitAI reduced our hiring time by 60%. Incredible tool!',
              },
              {
                name: 'Mike Chen',
                role: 'Talent Manager',
                company: 'InnovateLabs',
                quote: 'The AI accuracy is mind-blowing. Best investment we made.',
              },
              {
                name: 'Lisa Davis',
                role: 'Recruiting Lead',
                company: 'FutureCo',
                quote: 'Team collaboration features saved us hours each week.',
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card glass={true}>
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Hiring?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of companies already using AI to revolutionize their recruitment process.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="group">
                Start Your Free Trial <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'Security', 'Roadmap'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact'],
            },
            {
              title: 'Resources',
              links: ['Documentation', 'API Docs', 'Guides', 'Support'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Compliance', 'Cookies'],
            },
          ].map((column, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground">© 2024 RecruitAI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a key={social} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
