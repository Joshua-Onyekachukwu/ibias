'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Download, Save, FileText, FileSpreadsheet, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDashboardData } from '@/contexts/dashboard-data-context'

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ReportOptions {
  dateRange: {
    start: string
    end: string
  }
  metrics: {
    revenue: boolean
    customers: boolean
    orders: boolean
    conversion: boolean
    customerLTV: boolean
    avgOrderValue: boolean
    mrr: boolean
  }
  exportFormat: 'pdf' | 'csv' | 'excel'
  saveToSystem: boolean
  reportName: string
  description: string
}

export function GenerateReportModal({ isOpen, onClose }: GenerateReportModalProps) {
  const { generateReport } = useDashboardData()
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState<ReportOptions>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    metrics: {
      revenue: true,
      customers: true,
      orders: true,
      conversion: true,
      customerLTV: false,
      avgOrderValue: false,
      mrr: false
    },
    exportFormat: 'pdf',
    saveToSystem: true,
    reportName: `Dashboard Report - ${new Date().toLocaleDateString()}`,
    description: ''
  })

  const handleMetricChange = (metric: keyof ReportOptions['metrics'], checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: checked
      }
    }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      await generateReport(options)
      onClose()
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatIcons = {
    pdf: FileText,
    csv: File,
    excel: FileSpreadsheet
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Generate Report
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Date Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="start-date" className="text-xs text-gray-500">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={options.dateRange.start}
                        onChange={(e) => setOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-xs text-gray-500">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={options.dateRange.end}
                        onChange={(e) => setOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Metrics</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(options.metrics).map(([metric, checked]) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric}
                          checked={checked}
                          onCheckedChange={(checked) => handleMetricChange(metric as keyof ReportOptions['metrics'], checked as boolean)}
                        />
                        <Label htmlFor={metric} className="text-sm capitalize">
                          {metric.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Format */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Export Format</Label>
                  <Select
                    value={options.exportFormat}
                    onValueChange={(value: 'pdf' | 'csv' | 'excel') => 
                      setOptions(prev => ({ ...prev, exportFormat: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(formatIcons).map(([format, Icon]) => (
                        <SelectItem key={format} value={format}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {format.toUpperCase()}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Save to System */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-system"
                      checked={options.saveToSystem}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, saveToSystem: checked as boolean }))
                      }
                    />
                    <Label htmlFor="save-system" className="text-sm font-medium flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save to System
                    </Label>
                  </div>
                  
                  {options.saveToSystem && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pl-6"
                    >
                      <div>
                        <Label htmlFor="report-name" className="text-xs text-gray-500">Report Name</Label>
                        <Input
                          id="report-name"
                          value={options.reportName}
                          onChange={(e) => setOptions(prev => ({ ...prev, reportName: e.target.value }))}
                          placeholder="Enter report name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-xs text-gray-500">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={options.description}
                          onChange={(e) => setOptions(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter report description"
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="min-w-[120px]"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Generate Report
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}