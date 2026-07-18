'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Download, MessageSquare, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'

const candidates = [
  {
    id: 1,
    name: 'Alice Johnson',
    position: 'Senior Developer',
    score: 92,
    status: 'interviewed',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    appliedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    position: 'Product Manager',
    score: 88,
    status: 'screened',
    skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile'],
    appliedDate: '2024-01-14',
  },
  {
    id: 3,
    name: 'Carol White',
    position: 'Design Lead',
    score: 85,
    status: 'applied',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'CSS'],
    appliedDate: '2024-01-13',
  },
  {
    id: 4,
    name: 'David Lee',
    position: 'Senior Developer',
    score: 79,
    status: 'screened',
    skills: ['Python', 'SQL', 'Docker', 'DevOps'],
    appliedDate: '2024-01-12',
  },
  {
    id: 5,
    name: 'Eve Chen',
    position: 'Data Scientist',
    score: 95,
    status: 'offered',
    skills: ['Machine Learning', 'Python', 'Statistics', 'TensorFlow'],
    appliedDate: '2024-01-11',
  },
  {
    id: 6,
    name: 'Frank Williams',
    position: 'Senior Developer',
    score: 81,
    status: 'applied',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'Microservices'],
    appliedDate: '2024-01-10',
  },
]

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
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || c.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offered':
        return 'success'
      case 'interviewed':
        return 'default'
      case 'screened':
        return 'warning'
      default:
        return 'outline'
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Candidates</h2>
            <p className="text-muted-foreground">Manage and review all candidates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="md">
              Import Candidates
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name or position..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 items-end">
            <Button variant="outline" size="md" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {['All', 'applied', 'screened', 'interviewed', 'offered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status === 'All' ? null : status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                (status === 'All' && !selectedStatus) || selectedStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Candidates Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        {filteredCandidates.map((candidate) => (
          <motion.div key={candidate.id} variants={itemVariants}>
            <Card glass={true} hover={true}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">
                        {candidate.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(candidate.status)} size="md">
                    {candidate.status}
                  </Badge>
                </div>

                {/* Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
                    <span className="text-lg font-bold">{candidate.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground">Applied: {candidate.appliedDate}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  {candidate.status === 'interviewed' && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <motion.div variants={itemVariants} className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No candidates found matching your filters</p>
        </motion.div>
      )}
    </motion.div>
  )
}
