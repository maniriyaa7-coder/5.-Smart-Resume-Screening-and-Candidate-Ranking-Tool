'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, User, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<'recruiter' | 'candidate'>('recruiter')
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Auth submission:', { isLogin, role, formData })
  }

  const features = [
    'AI-powered candidate screening',
    'Real-time hiring analytics',
    'Team collaboration tools',
    'Enterprise security & compliance',
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-15" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl opacity-15" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
        {/* Left Side - Features */}
        <motion.div
          className="hidden lg:flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
            <span className="font-bold text-lg">RecruitAI</span>
          </Link>

          <div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="gradient-text">Transform Your</span>
              <br />
              <span>Hiring Process</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of companies using AI to find their perfect talent.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-card w-full">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-lg w-fit">
              {['Login', 'Sign Up'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setIsLogin(tab === 'Login')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    (tab === 'Login' && isLogin) || (tab === 'Sign Up' && !isLogin)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Role Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                {(['recruiter', 'candidate'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-lg border-2 transition-all text-center capitalize font-medium ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button variant="primary" size="lg" className="w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="md" className="w-full">
                Google
              </Button>
              <Button variant="outline" size="md" className="w-full">
                GitHub
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-muted-foreground mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Testimonial */}
          <motion.div
            className="mt-8 p-4 rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-foreground italic mb-2">
              &quot;RecruitAI cut our hiring time in half. We went from weeks to days.&quot;
            </p>
            <p className="text-xs text-muted-foreground">— Sarah Chen, HR Director at TechCorp</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
