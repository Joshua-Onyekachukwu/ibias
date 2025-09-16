'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Users, ShoppingCart, DollarSign, Filter, Plus } from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'sales' | 'customers' | 'inventory' | 'financial'
  generatedDate: string
  size: string
  status: 'ready' | 'generating' | 'failed'
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  type: 'sales' | 'customers' | 'inventory' | 'financial'
  color: string
  bgColor: string
}

interface ReportsModalProps {
  isOpen: boolean
  onClose: () => void
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'sales-overview',
    name: 'Sales Overview',
    description: 'Comprehensive sales performance analysis',
    icon: BarChart3,
    type: 'sales',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20'
  },
  {
    id: 'customer-analytics',
    name: 'Customer Analytics',
    description: 'Customer behavior and demographics',
    icon: Users,
    type: 'customers',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20'
  },
  {
    id: 'revenue-report',
    name: 'Revenue Report',
    description: 'Financial performance and trends',
    icon: DollarSign,
    type: 'financial',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20'
  },
  {
    id: 'product-performance',
    name: 'Product Performance',
    description: 'Inventory and product analytics',
    icon: ShoppingCart,
    type: 'inventory',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20'
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    description: 'Market trends and forecasting',
    icon: TrendingUp,
    type: 'sales',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20'
  },
  {
    id: 'custom-report',
    name: 'Custom Report',
    description: 'Build your own custom report',
    icon: Plus,
    type: 'sales',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20'
  }
]

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report - January 2024',
    type: 'sales',
    generatedDate: '2024-01-15',
    size: '2.4 MB',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Customer Analytics Q4 2023',
    type: 'customers',
    generatedDate: '2024-01-10',
    size: '1.8 MB',
    status: 'ready'
  },
  {
    id: '3',
    name: 'Revenue Analysis - December 2023',
    type: 'financial',
    generatedDate: '2024-01-08',
    size: '3.1 MB',
    status: 'ready'
  },
  {
    id: '4',
    name: 'Inventory Report - Current',
    type: 'inventory',
    generatedDate: '2024-01-14',
    size: '1.2 MB',
    status: 'generating'
  }
]

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'generating':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'recent'>('templates')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Center</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate and manage business reports</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'templates'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Report Templates
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'recent'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Recent Reports
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'templates' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose a Report Template</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Select from our pre-built report templates or create a custom report</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${template.bgColor} hover:shadow-lg transition-all duration-200 text-left`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${template.color} bg-white dark:bg-gray-800`}>
                          <template.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recent' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Reports</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download or view your recently generated reports</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockReports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{report.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Generated on {report.generatedDate} • {report.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                        {report.status === 'ready' && (
                          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}