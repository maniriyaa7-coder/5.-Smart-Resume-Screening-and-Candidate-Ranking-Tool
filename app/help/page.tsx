'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/badge'
import { Input } from '@/components/input'
import { Card } from '@/components/card'

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Get Started" in the top navigation and choose your role (Recruiter or Candidate). Fill in your details and verify your email to get started.',
      },
      {
        question: 'What are the system requirements?',
        answer: 'RecruitAI works on all modern web browsers. We recommend using the latest version of Chrome, Firefox, Safari, or Edge.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes! We offer a 14-day free trial for all new users. No credit card required to start.',
      },
    ],
  },
  {
    category: 'Resume Analysis',
    items: [
      {
        question: 'What file formats are supported?',
        answer: 'We support PDF, Word (.docx), and text (.txt) files. Maximum file size is 10MB.',
      },
      {
        question: 'How long does resume analysis take?',
        answer: 'Most resumes are analyzed within seconds. Complex resumes may take up to a minute.',
      },
      {
        question: 'What is an ATS score?',
        answer: 'An ATS score measures how well your resume is optimized for Applicant Tracking Systems. A higher score means better compatibility with ATS software.',
      },
    ],
  },
  {
    category: 'Billing',
    items: [
      {
        question: 'Can I change my plan anytime?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
      },
      {
        question: 'Is there a cancellation fee?',
        answer: 'No, there are no cancellation fees. You can cancel your subscription anytime from your account settings.',
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

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

  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent={false} />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <motion.div
            className="text-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline">Help Center</Badge>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold">
              How Can We Help?
            </motion.h1>
            <motion.div variants={itemVariants} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFaqs.map((section, sectionIndex) => (
              section.items.length > 0 && (
                <motion.div key={sectionIndex} variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary">{section.category}</h2>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => {
                      const itemId = `${sectionIndex}-${itemIndex}`
                      const isExpanded = expandedItem === itemId
                      return (
                        <Card
                          key={itemIndex}
                          className="cursor-pointer hover:bg-primary/5 transition-all"
                          onClick={() => setExpandedItem(isExpanded ? null : itemId)}
                        >
                          <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-bold text-lg flex-1">{item.question}</h3>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                              </motion.div>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{
                                opacity: isExpanded ? 1 : 0,
                                height: isExpanded ? 'auto' : 0,
                              }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground">{item.answer}</p>
                            </motion.div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-12 text-center space-y-6 border border-primary/20"
          >
            <h2 className="text-3xl font-bold">Didn&apos;t find what you were looking for?</h2>
            <p className="text-lg text-muted-foreground">
              Our support team is here to help. Contact us for assistance.
            </p>
            <a href="mailto:support@recruitai.com" className="text-primary hover:text-primary/80 font-medium">
              support@recruitai.com
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
