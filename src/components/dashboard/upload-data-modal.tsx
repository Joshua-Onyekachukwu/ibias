'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, File, FileText, FileSpreadsheet, Database, Check, AlertCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface UploadDataModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

interface UploadOptions {
  dataType: 'customers' | 'orders' | 'products' | 'analytics' | 'financial'
  overwriteExisting: boolean
  validateData: boolean
  createBackup: boolean
}

export function UploadDataModal({ isOpen, onClose }: UploadDataModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [options, setOptions] = useState<UploadOptions>({
    dataType: 'customers',
    overwriteExisting: false,
    validateData: true,
    createBackup: true
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedFileTypes = {
    customers: '.csv,.xlsx,.json',
    orders: '.csv,.xlsx,.json',
    products: '.csv,.xlsx,.json',
    analytics: '.csv,.xlsx,.json',
    financial: '.csv,.xlsx,.json'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles: UploadFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const simulateUpload = async (fileId: string) => {
    const updateProgress = (progress: number, status: UploadFile['status'], error?: string) => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress, status, error } : f
      ))
    }

    updateProgress(0, 'uploading')
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      updateProgress(i, 'uploading')
    }

    // Simulate random success/failure
    const success = Math.random() > 0.2 // 80% success rate
    if (success) {
      updateProgress(100, 'completed')
    } else {
      updateProgress(0, 'error', 'Upload failed. Please try again.')
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload')
      return
    }

    setIsUploading(true)
    
    try {
      // Upload files concurrently
      await Promise.all(files.map(file => simulateUpload(file.id)))
      
      const successCount = files.filter(f => f.status === 'completed').length
      const errorCount = files.filter(f => f.status === 'error').length
      
      if (errorCount === 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`)
      } else {
        toast.warning(`Uploaded ${successCount} file(s), ${errorCount} failed`)
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'csv':
        return <FileText className="h-5 w-5 text-green-600" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-blue-600" />
      case 'json':
        return <Database className="h-5 w-5 text-purple-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upload Data
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Import data files to update your dashboard
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Data Type Selection */}
            <div className="space-y-2">
              <Label>Data Type</Label>
              <Select value={options.dataType} onValueChange={(value: UploadOptions['dataType']) => setOptions(prev => ({ ...prev, dataType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customers">Customer Data</SelectItem>
                  <SelectItem value="orders">Order Data</SelectItem>
                  <SelectItem value="products">Product Data</SelectItem>
                  <SelectItem value="analytics">Analytics Data</SelectItem>
                  <SelectItem value="financial">Financial Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <Label>Files</Label>
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: CSV, Excel, JSON
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Maximum file size: 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes[options.dataType]}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Files ({files.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {getFileIcon(uploadFile.file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                        {uploadFile.status === 'uploading' && (
                          <Progress value={uploadFile.progress} className="mt-1 h-1" />
                        )}
                        {uploadFile.error && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {uploadFile.error}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadFile.status)}
                        {uploadFile.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-4">
              <Label>Upload Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite"
                    checked={options.overwriteExisting}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, overwriteExisting: checked as boolean }))}
                  />
                  <Label htmlFor="overwrite" className="text-sm">
                    Overwrite existing data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validate"
                    checked={options.validateData}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, validateData: checked as boolean }))}
                  />
                  <Label htmlFor="validate" className="text-sm">
                    Validate data before import
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backup"
                    checked={options.createBackup}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, createBackup: checked as boolean }))}
                  />
                  <Label htmlFor="backup" className="text-sm">
                    Create backup before import
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UploadDataModal