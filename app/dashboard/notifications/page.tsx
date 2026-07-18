'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Trash2, CheckCircle, AlertCircle, MessageSquare, Calendar } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

const notificationsList = [
  {
    id: 1,
    type: 'application',
    icon: MessageSquare,
    title: 'New Application',
    description: 'Sarah Johnson applied for Senior Frontend Engineer',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'interview',
    icon: Calendar,
    title: 'Interview Completed',
    description: 'Michael Chen completed his phone interview',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: 3,
    type: 'alert',
    icon: AlertCircle,
    title: 'Low ATS Score',
    description: 'John Smith has an ATS score below 50%',
    timestamp: '2 days ago',
    isRead: true,
  },
  {
    id: 4,
    type: 'update',
    icon: CheckCircle,
    title: 'Job Posted',
    description: 'Your "Product Manager" job posting is now live',
    timestamp: '3 days ago',
    isRead: true,
  },
  {
    id: 5,
    type: 'application',
    icon: MessageSquare,
    title: 'New Application',
    description: 'Emma Davis applied for UX Designer',
    timestamp: '5 days ago',
    isRead: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsList)

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

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
            <h1 className="text-4xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Stay updated with your recruitment activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon
            return (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                layout
              >
                <Card
                  className={`p-4 hover:bg-primary/5 transition-all ${
                    !notification.isRead ? 'bg-primary/10 border-primary/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          {notification.description}
                        </p>
                        <p className="text-muted-foreground text-xs mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-primary"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
