'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for small teams',
    features: [
      'Up to 100 resumes/month',
      'AI resume analysis',
      'Basic ATS scoring',
      '5 job postings',
      'Email support',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Professional',
    price: '$149',
    description: 'For growing companies',
    features: [
      'Up to 1000 resumes/month',
      'Advanced AI analysis',
      'Priority ATS scoring',
      '50 job postings',
      'Team collaboration',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Start Free',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited resumes',
      'Custom AI models',
      'Advanced analytics',
      'Unlimited job postings',
      'API access',
      '24/7 dedicated support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
]

export default function PricingPage() {
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
              <Badge variant="outline">Simple Pricing</Badge>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold">
              Choose Your Plan
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing that scales with your business needs
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`rounded-2xl border transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 scale-105'
                    : 'bg-card/50 border-border hover:border-primary/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="px-6 py-3 bg-primary/20 border-b border-primary/50 text-center">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  <div>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
                  </div>

                  <Link href="/register">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-3 pt-6 border-t border-border">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
