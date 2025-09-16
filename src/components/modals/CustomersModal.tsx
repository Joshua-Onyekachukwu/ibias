'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, TrendingUp, UserPlus, Search, Filter, MoreVertical } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
}

interface CustomersModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    totalOrders: 12,
    totalSpent: 2450.00,
    lastOrder: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    totalOrders: 8,
    totalSpent: 1890.50,
    lastOrder: '2024-01-12',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    totalOrders: 15,
    totalSpent: 3200.75,
    lastOrder: '2024-01-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.r@email.com',
    totalOrders: 3,
    totalSpent: 450.25,
    lastOrder: '2023-12-28',
    status: 'inactive'
  }
]

export function CustomersModal({ isOpen, onClose }: CustomersModalProps) {
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
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage and view customer information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Customers</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">1,247</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active This Month</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">892</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">New This Week</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">23</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Customer List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {mockCustomers.map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{customer.totalOrders} orders</p>
                      <p className="text-sm text-muted-foreground">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last order</p>
                      <p className="text-sm font-medium text-foreground">{customer.lastOrder}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {customer.status}
                    </div>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}