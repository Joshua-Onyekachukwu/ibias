'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, TrendingUp, Package, Search, Filter, MoreVertical, Eye } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  items: number
}

interface OrdersModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: 'Sarah Johnson',
    amount: 299.99,
    status: 'delivered',
    date: '2024-01-15',
    items: 3
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: 'Michael Chen',
    amount: 149.50,
    status: 'shipped',
    date: '2024-01-14',
    items: 2
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: 'Emma Wilson',
    amount: 89.99,
    status: 'processing',
    date: '2024-01-13',
    items: 1
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: 'David Rodriguez',
    amount: 199.75,
    status: 'pending',
    date: '2024-01-12',
    items: 4
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: 'Lisa Anderson',
    amount: 75.25,
    status: 'cancelled',
    date: '2024-01-11',
    items: 1
  }
]

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'shipped':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

export function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track and manage customer orders</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">2,847</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Revenue</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">$89,247</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Pending</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">47</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">This Week</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">156</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {mockOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      #{order.id}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">${order.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
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