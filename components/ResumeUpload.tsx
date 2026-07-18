'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, Check, AlertCircle, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/button';
import { resumeAPI, Resume } from '@/lib/api/resume';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeUploadProps {
  onUploadSuccess?: (resume: Resume) => void;
  existingResume?: Resume | null;
}

export function ResumeUpload({ onUploadSuccess, existingResume }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resume, setResume] = useState<Resume | null>(existingResume || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are allowed';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = resume
        ? await resumeAPI.replace(selectedFile, setProgress)
        : await resumeAPI.upload(selectedFile, setProgress);

      if (response.success && response.data) {
        setResume(response.data.resume);
        setSuccess(true);
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.resume);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!resume || !window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resume._id);
      setResume(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Delete failed. Please try again.');
    }
  };

  const handleDownload = () => {
    if (resume) {
      resumeAPI.downloadResume(resume.filename, resume.originalName);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    return <FileText className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!resume && !selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleChange}
          />

          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your resume here, or click to browse
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>

            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX • Max size: 5MB
            </p>
          </div>
        </motion.div>
      )}

      {/* Selected File Preview (Before Upload) */}
      {selectedFile && !uploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {getFileIcon(selectedFile.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{selectedFile.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="primary" onClick={handleUpload} className="flex-1">
              {resume ? 'Replace Resume' : 'Upload Resume'}
            </Button>
            <Button variant="outline" onClick={() => setSelectedFile(null)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Resume */}
      {resume && !selectedFile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {getFileIcon(resume.mimeType)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{resume.originalName}</h4>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(resume.size)} • Uploaded{' '}
                {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Replace
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleChange}
          />
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-500">
              {resume ? 'Resume updated successfully!' : 'Resume deleted successfully!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
