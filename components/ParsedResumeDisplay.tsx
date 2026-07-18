'use client';

import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/card';
import { Badge } from '@/components/badge';
import { ParsedResume } from '@/lib/api/resume';

interface ParsedResumeDisplayProps {
  parsedData: ParsedResume | null;
  isLoading?: boolean;
  error?: string | null;
}

export function ParsedResumeDisplay({
  parsedData,
  isLoading = false,
  error = null,
}: ParsedResumeDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Parsing your resume...</p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a few seconds
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-red-500/10 border-red-500/50">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-center">{error}</p>
      </Card>
    );
  }

  if (!parsedData) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No parsed data available. Upload a resume to get started.
        </p>
      </Card>
    );
  }

  if (!parsedData.isParsed) {
    return (
      <Card className="p-8 bg-yellow-500/10 border-yellow-500/50 text-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
        <p className="text-yellow-500">Parsing in progress...</p>
        <p className="text-sm text-muted-foreground mt-2">
          {parsedData.parseError || 'Please wait while we extract your information'}
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Success Badge */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="text-sm text-green-500 font-medium">
          Resume parsed successfully
        </span>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedData.name && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{parsedData.name}</p>
                </div>
              </div>
            )}

            {parsedData.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{parsedData.email}</p>
                </div>
              </div>
            )}

            {parsedData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{parsedData.phone}</p>
                </div>
              </div>
            )}
          </div>

          {!parsedData.name && !parsedData.email && !parsedData.phone && (
            <p className="text-sm text-muted-foreground italic">
              No personal information extracted
            </p>
          )}
        </Card>
      </motion.div>

      {/* Skills */}
      {parsedData.skills && parsedData.skills.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Experience */}
      {parsedData.experience && parsedData.experience.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Experience</h3>
            </div>

            <div className="space-y-4">
              {parsedData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-2 border-primary/30 pl-4 pb-4 last:pb-0"
                >
                  {exp.position && (
                    <h4 className="font-semibold text-lg">{exp.position}</h4>
                  )}
                  {exp.company && (
                    <p className="text-primary font-medium">{exp.company}</p>
                  )}
                  {exp.duration && (
                    <p className="text-sm text-muted-foreground">{exp.duration}</p>
                  )}
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Education */}
      {parsedData.education && parsedData.education.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Education</h3>
            </div>

            <div className="space-y-3">
              {parsedData.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  {edu.degree && <h4 className="font-semibold">{edu.degree}</h4>}
                  {edu.institution && (
                    <p className="text-primary">{edu.institution}</p>
                  )}
                  {edu.year && (
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Projects */}
      {parsedData.projects && parsedData.projects.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FolderGit2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Projects</h3>
            </div>

            <div className="space-y-4">
              {parsedData.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  {project.name && (
                    <h4 className="font-semibold">{project.name}</h4>
                  )}
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Certifications */}
      {parsedData.certifications && parsedData.certifications.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Certifications</h3>
            </div>

            <ul className="space-y-2">
              {parsedData.certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
