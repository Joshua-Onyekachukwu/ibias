'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Filter, FileText, FileSpreadsheet, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDashboardData } from '@/contexts/dashboard-data-context'

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ExportOptions {
  dataTypes: {
    customers: boolean
    orders: boolean
    revenue: boolean
    products: boolean
    analytics: boolean
  }
  exportFormat: 'pdf' | 'csv' | 'excel'
  includeFilters: boolean
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const { exportData } = useDashboardData()
  const [isExporting, setIsExporting] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    dataTypes: {
      customers: true,
      orders: true,
      revenue: true,
      products: false,
      analytics: false
    },
    exportFormat: 'csv',
    includeFilters: false
  })

  const handleDataTypeChange = (dataType: keyof ExportOptions['dataTypes'], checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      dataTypes: {
        ...prev.dataTypes,
        [dataType]: checked
      }
    }))
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const filters = options.includeFilters ? {
        dataTypes: Object.entries(options.dataTypes)
          .filter(([_, selected]) => selected)
          .map(([type]) => type)
      } : undefined
      
      await exportData(options.exportFormat, filters)
      onClose()
    } catch (error) {
      console.error('Failed to export data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const formatIcons = {
    pdf: FileText,
    csv: File,
    excel: FileSpreadsheet
  }

  const selectedCount = Object.values(options.dataTypes).filter(Boolean).length

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
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Export Data
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
                {/* Data Types Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Data Types</Label>
                  <div className="space-y-2">
                    {Object.entries(options.dataTypes).map(([dataType, checked]) => (
                      <div key={dataType} className="flex items-center space-x-2">
                        <Checkbox
                          id={dataType}
                          checked={checked}
                          onCheckedChange={(checked) => handleDataTypeChange(dataType as keyof ExportOptions['dataTypes'], checked as boolean)}
                        />
                        <Label htmlFor={dataType} className="text-sm capitalize">
                          {dataType}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCount > 0 && (
                    <p className="text-xs text-gray-500">
                      {selectedCount} data type{selectedCount !== 1 ? 's' : ''} selected
                    </p>
                  )}
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

                {/* Include Filters */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-filters"
                      checked={options.includeFilters}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeFilters: checked as boolean }))
                      }
                    />
                    <Label htmlFor="include-filters" className="text-sm font-medium flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Apply current dashboard filters
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 pl-6">
                    Include active date ranges and metric filters in the export
                  </p>
                </div>

                {/* Export Preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Export Preview
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Format: {options.exportFormat.toUpperCase()}</p>
                    <p>Data Types: {selectedCount} selected</p>
                    <p>Filters: {options.includeFilters ? 'Applied' : 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleExportData}
                  disabled={isExporting || selectedCount === 0}
                  className="min-w-[120px]"
                >
                  {isExporting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Exporting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
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