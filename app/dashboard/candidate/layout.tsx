'use client'

import { motion } from 'framer-motion'
import { LayoutGrid, FileText, BarChart3, Settings, LogOut, Menu, X, Briefcase, Video, Bell, User, Star } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const sidebarItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard/candidate' },
  { icon: FileText, label: 'My Resume', href: '/dashboard/candidate/resume' },
  { icon: BarChart3, label: 'ATS Score', href: '/dashboard/candidate/ats-score' },
  { icon: Star, label: 'AI Resume Review', href: '/dashboard/candidate/ai-review' },
  { icon: Briefcase, label: 'Job Matches', href: '/dashboard/candidate/job-matches' },
  { icon: Briefcase, label: 'Applied Jobs', href: '/dashboard/candidate/applied-jobs' },
  { icon: Star, label: 'Saved Jobs', href: '/dashboard/candidate/saved-jobs' },
  { icon: Video, label: 'Mock Interview', href: '/dashboard/candidate/mock-interview' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/candidate/notifications' },
  { icon: User, label: 'Profile', href: '/dashboard/candidate/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/candidate/settings' },
]

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout, user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'candidate')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading || !user || user.role !== 'candidate') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } glass border-r border-border transition-all duration-300 flex flex-col fixed md:relative h-full z-30`}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
              <span className="font-bold text-foreground">Candidate Portal</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors md:hidden text-foreground"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                whileHover={{ x: sidebarOpen ? 4 : 0 }}
                title={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </motion.button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Top Bar */}
        <motion.header
          className="h-16 border-b border-border glass px-6 flex items-center justify-between"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:flex text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4 text-foreground">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-border">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:inline">{user?.name}</span>
              <div className="w-10 h-10 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center cursor-pointer">
                <span className="font-semibold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 overflow-auto text-foreground">
          <motion.div
            className="p-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </div>
  )
}
