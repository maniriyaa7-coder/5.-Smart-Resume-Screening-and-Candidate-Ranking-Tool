'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Briefcase, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Engineer',
    bio: 'Passionate about building user-centered products with modern web technologies.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    experience: [
      {
        id: 1,
        company: 'Tech Company A',
        role: 'Senior Frontend Engineer',
        duration: '2021 - Present',
        description: 'Led frontend team and architecture decisions',
      },
      {
        id: 2,
        company: 'Tech Company B',
        role: 'Frontend Engineer',
        duration: '2019 - 2021',
        description: 'Developed web applications and mentored junior developers',
      },
    ],
  })

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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your professional information</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{formData.fullName}</h2>
                  <p className="text-muted-foreground text-lg mt-1">{formData.title}</p>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p className="text-foreground">{formData.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <p className="text-foreground">{formData.phone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              ) : (
                <p className="text-foreground">{formData.location}</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bio */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">About</h2>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground resize-none"
              rows={4}
            />
          ) : (
            <p className="text-muted-foreground">{formData.bio}</p>
          )}
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, i) => (
              <Badge key={i} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Experience */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold">Experience</h2>
          <div className="space-y-6">
            {formData.experience.map((exp) => (
              <div key={exp.id} className="pb-6 border-b border-border last:pb-0 last:border-0">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{exp.role}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">{exp.duration}</p>
                    <p className="text-foreground mt-2">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      {isEditing && (
        <motion.div variants={itemVariants} className="flex gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
