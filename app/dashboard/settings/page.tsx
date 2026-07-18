'use client'

import { motion } from 'framer-motion'
import { Save, Bell, Lock, User, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'
import { Input } from '@/components/input'

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
  visible: { opacity: 1, y: 0 },
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      className="space-y-6 max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div variants={itemVariants}>
        <Card glass={true}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="john@example.com" />
            <Input label="Company" placeholder="Your Company" />
            <Button variant="primary" size="md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            {saved && <p className="text-sm text-emerald-500">✓ Changes saved successfully</p>}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div variants={itemVariants}>
        <Card glass={true}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div>
                  <p className="font-medium">Login Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                </div>
              </label>
            </div>
            <Button variant="outline" size="md">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card glass={true}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control how you receive updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'New Applications', desc: 'Get notified when new candidates apply' },
              { title: 'Interview Reminders', desc: 'Receive reminders before scheduled interviews' },
              { title: 'Offer Updates', desc: 'Updates when candidates accept or decline offers' },
              { title: 'Weekly Summary', desc: 'Get a weekly recap of your hiring metrics' },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing */}
      <motion.div variants={itemVariants}>
        <Card glass={true}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <div>
                <CardTitle>Plan & Billing</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-semibold mb-1">Professional Plan</p>
              <p className="text-sm text-muted-foreground mb-4">$99/month • Unlimited candidates • Priority support</p>
              <Button variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
