'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Calendar,
  Tag,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit,
  Star,
  Flag,
  Bookmark,
  Share2,
  RefreshCw,
  Download,
  FileText,
  Zap,
  PieChart,
  DollarSign,
  Users,
  ShoppingCart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  source: 'ai_insights' | 'analytics' | 'user_behavior' | 'market_trends' | 'custom'
  status: 'pending' | 'in_progress' | 'implemented' | 'rejected' | 'planned'
  priority: 'low' | 'medium' | 'high' | 'critical'
  impact: 'minimal' | 'moderate' | 'significant' | 'major'
  confidence: number
  createdAt: Date
  updatedAt: Date
  implementedAt?: Date
  assignedTo?: string
  tags: string[]
  upvotes: number
  downvotes: number
  comments: number
  estimatedEffort: 'quick_win' | 'medium' | 'major_project'
  estimatedImpact: {
    revenue?: number
    conversion?: number
    retention?: number
    efficiency?: number
  }
  relatedMetrics: string[]
  icon: any
}

interface RecommendationComment {
  id: string
  recommendationId: string
  author: string
  content: string
  timestamp: Date
  isInternal: boolean
}

interface RecommendationHistory {
  id: string
  recommendationId: string
  action: string
  timestamp: Date
  user: string
  details?: string
  previousStatus?: string
  newStatus?: string
}

export default function RecommendationTrackerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null)
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Mock recommendations data
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Implement cart abandonment recovery emails',
      description: 'Set up automated email sequences to recover abandoned carts. Analysis shows potential 15% recovery rate.',
      category: 'Marketing',
      source: 'analytics',
      status: 'pending',
      priority: 'high',
      impact: 'significant',
      confidence: 85,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['email', 'automation', 'conversion'],
      upvotes: 12,
      downvotes: 2,
      comments: 5,
      estimatedEffort: 'medium',
      estimatedImpact: {
        revenue: 12500,
        conversion: 15
      },
      relatedMetrics: ['cart_abandonment_rate', 'email_conversion_rate', 'revenue'],
      icon: ShoppingCart
    },
    {
      id: '2',
      title: 'Optimize pricing strategy for premium tier',
      description: 'AI analysis suggests increasing premium tier pricing by 10% would maximize revenue without significant customer loss.',
      category: 'Pricing',
      source: 'ai_insights',
      status: 'in_progress',
      priority: 'critical',
      impact: 'major',
      confidence: 92,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedTo: 'Sarah Johnson',
      tags: ['pricing', 'revenue', 'premium'],
      upvotes: 18,
      downvotes: 3,
      comments: 7,
      estimatedEffort: 'quick_win',
      estimatedImpact: {
        revenue: 45000
      },
      relatedMetrics: ['arpu', 'churn_rate', 'conversion_rate'],
      icon: DollarSign
    },
    {
      id: '3',
      title: 'Implement personalized product recommendations',
      description: 'Add AI-powered product recommendations based on user browsing history and purchase patterns.',
      category: 'User Experience',
      source: 'user_behavior',
      status: 'implemented',
      priority: 'high',
      impact: 'significant',
      confidence: 88,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      implementedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      assignedTo: 'Michael Chen',
      tags: ['personalization', 'ai', 'recommendations'],
      upvotes: 24,
      downvotes: 1,
      comments: 9,
      estimatedEffort: 'medium',
      estimatedImpact: {
        revenue: 28000,
        conversion: 8
      },
      relatedMetrics: ['average_order_value', 'pages_per_session', 'conversion_rate'],
      icon: Lightbulb
    },
    {
      id: '4',
      title: 'Streamline checkout process',
      description: 'Reduce checkout steps from 5 to 3 to minimize friction and abandonment.',
      category: 'User Experience',
      source: 'analytics',
      status: 'planned',
      priority: 'high',
      impact: 'significant',
      confidence: 90,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedTo: 'Alex Wong',
      tags: ['checkout', 'conversion', 'ux'],
      upvotes: 15,
      downvotes: 0,
      comments: 6,
      estimatedEffort: 'medium',
      estimatedImpact: {
        conversion: 12,
        revenue: 18000
      },
      relatedMetrics: ['checkout_abandonment_rate', 'time_to_purchase', 'conversion_rate'],
      icon: ShoppingCart
    },
    {
      id: '5',
      title: 'Launch referral program',
      description: 'Implement customer referral program with incentives for both referrer and referee.',
      category: 'Marketing',
      source: 'market_trends',
      status: 'pending',
      priority: 'medium',
      impact: 'moderate',
      confidence: 75,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      tags: ['referral', 'acquisition', 'growth'],
      upvotes: 9,
      downvotes: 4,
      comments: 3,
      estimatedEffort: 'medium',
      estimatedImpact: {
        revenue: 15000
      },
      relatedMetrics: ['customer_acquisition_cost', 'viral_coefficient', 'new_users'],
      icon: Users
    },
    {
      id: '6',
      title: 'Implement A/B testing framework',
      description: 'Set up systematic A/B testing capability for continuous optimization of key pages and features.',
      category: 'Analytics',
      source: 'ai_insights',
      status: 'rejected',
      priority: 'medium',
      impact: 'significant',
      confidence: 82,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      tags: ['testing', 'optimization', 'analytics'],
      upvotes: 7,
      downvotes: 8,
      comments: 12,
      estimatedEffort: 'major_project',
      estimatedImpact: {
        conversion: 5,
        efficiency: 20
      },
      relatedMetrics: ['conversion_rate', 'engagement_rate', 'bounce_rate'],
      icon: BarChart3
    },
    {
      id: '7',
      title: 'Enhance mobile app performance',
      description: 'Optimize mobile app loading times and reduce crashes based on user feedback and analytics.',
      category: 'Technical',
      source: 'user_behavior',
      status: 'in_progress',
      priority: 'high',
      impact: 'moderate',
      confidence: 88,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: 'Priya Patel',
      tags: ['mobile', 'performance', 'optimization'],
      upvotes: 14,
      downvotes: 1,
      comments: 8,
      estimatedEffort: 'medium',
      estimatedImpact: {
        retention: 15
      },
      relatedMetrics: ['app_crash_rate', 'session_duration', 'user_retention'],
      icon: Zap
    },
    {
      id: '8',
      title: 'Implement customer segmentation for targeted campaigns',
      description: 'Create detailed customer segments based on behavior and demographics for more targeted marketing.',
      category: 'Marketing',
      source: 'analytics',
      status: 'pending',
      priority: 'medium',
      impact: 'significant',
      confidence: 85,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      tags: ['segmentation', 'marketing', 'personalization'],
      upvotes: 11,
      downvotes: 2,
      comments: 4,
      estimatedEffort: 'medium',
      estimatedImpact: {
        conversion: 10,
        revenue: 22000
      },
      relatedMetrics: ['campaign_conversion_rate', 'email_open_rate', 'customer_ltv'],
      icon: Users
    }
  ]

  // Mock comments data
  const comments: RecommendationComment[] = [
    {
      id: '1',
      recommendationId: '1',
      author: 'Emily Rodriguez',
      content: 'We should prioritize this. Our cart abandonment rate is 25% higher than industry average.',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isInternal: true
    },
    {
      id: '2',
      recommendationId: '1',
      author: 'David Kim',
      content: 'I agree. We already have the email templates ready, just need to set up the automation.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isInternal: true
    },
    {
      id: '3',
      recommendationId: '1',
      author: 'Sarah Johnson',
      content: 'Marketing team can implement this in the next sprint. Adding to our backlog.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isInternal: false
    }
  ]

  // Mock history data
  const history: RecommendationHistory[] = [
    {
      id: '1',
      recommendationId: '1',
      action: 'created',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      user: 'AI Insights Engine',
      details: 'Generated from analytics data showing high cart abandonment rate'
    },
    {
      id: '2',
      recommendationId: '1',
      action: 'status_change',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      user: 'Emily Rodriguez',
      previousStatus: 'new',
      newStatus: 'pending',
      details: 'Moved to pending after initial review'
    },
    {
      id: '3',
      recommendationId: '1',
      action: 'priority_change',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson',
      details: 'Priority increased from medium to high based on potential impact'
    }
  ]

  const categories = ['all', 'Marketing', 'Pricing', 'User Experience', 'Technical', 'Analytics', 'Content', 'SEO']
  const statuses = ['all', 'pending', 'in_progress', 'implemented', 'rejected', 'planned']
  const priorities = ['all', 'low', 'medium', 'high', 'critical']
  const sources = ['all', 'ai_insights', 'analytics', 'user_behavior', 'market_trends', 'custom']

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'planned':
        return <Calendar className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'planned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 dark:text-red-400'
      case 'high':
        return 'text-orange-600 dark:text-orange-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-green-600 dark:text-green-400'
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'ai_insights':
        return 'AI Insights'
      case 'analytics':
        return 'Analytics'
      case 'user_behavior':
        return 'User Behavior'
      case 'market_trends':
        return 'Market Trends'
      default:
        return 'Custom'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai_insights':
        return <Lightbulb className="h-4 w-4" />
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />
      case 'user_behavior':
        return <User className="h-4 w-4" />
      case 'market_trends':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'major':
        return 'text-purple-600 dark:text-purple-400'
      case 'significant':
        return 'text-blue-600 dark:text-blue-400'
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'quick_win':
        return 'Quick Win'
      case 'medium':
        return 'Medium Effort'
      case 'major_project':
        return 'Major Project'
      default:
        return 'Unknown'
    }
  }

  const filteredRecommendations = recommendations.filter(recommendation => {
    const matchesSearch = searchQuery === '' || 
      recommendation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recommendation.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || recommendation.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || recommendation.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || recommendation.priority === selectedPriority
    const matchesSource = selectedSource === 'all' || recommendation.source === selectedSource
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesSource
  })

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
        break
      case 'impact':
        const impactOrder = { major: 4, significant: 3, moderate: 2, minimal: 1 }
        comparison = impactOrder[a.impact as keyof typeof impactOrder] - impactOrder[b.impact as keyof typeof impactOrder]
        break
      case 'confidence':
        comparison = a.confidence - b.confidence
        break
      case 'date':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'votes':
        comparison = (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes)
        break
      default:
        comparison = 0
    }
    return sortOrder === 'desc' ? -comparison : comparison
  })

  const handleStatusChange = (recommendationId: string, newStatus: string) => {
    toast.success(`Recommendation status updated to ${newStatus}`)
  }

  const handlePriorityChange = (recommendationId: string, newPriority: string) => {
    toast.success(`Recommendation priority updated to ${newPriority}`)
  }

  const handleAssign = (recommendationId: string, user: string) => {
    toast.success(`Recommendation assigned to ${user}`)
  }

  const handleVote = (recommendationId: string, voteType: 'up' | 'down') => {
    toast.success(`Vote recorded: ${voteType === 'up' ? 'Upvoted' : 'Downvoted'} recommendation`)
  }

  const handleDelete = (recommendationId: string) => {
    toast.success('Recommendation deleted')
  }

  const handleToggleExpand = (recommendationId: string) => {
    setExpandedRecommendation(expandedRecommendation === recommendationId ? null : recommendationId)
  }

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const pendingCount = recommendations.filter(r => r.status === 'pending').length
  const implementedCount = recommendations.filter(r => r.status === 'implemented').length
  const inProgressCount = recommendations.filter(r => r.status === 'in_progress').length

  const getRecommendationComments = (recommendationId: string) => {
    return comments.filter(comment => comment.recommendationId === recommendationId)
  }

  const getRecommendationHistory = (recommendationId: string) => {
    return history.filter(item => item.recommendationId === recommendationId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-yellow-500" />
            Recommendation Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and implement AI-generated recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Implemented</p>
                <p className="text-2xl font-bold text-green-600">{implementedCount}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-purple-600">{recommendations.length}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search recommendations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSortChange('priority')}>
              Sort by Priority {sortBy === 'priority' && (sortOrder === 'desc' ? '↓' : '↑')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('impact')}>
              Sort by Impact {sortBy === 'impact' && (sortOrder === 'desc' ? '↓' : '↑')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('confidence')}>
              Sort by Confidence {sortBy === 'confidence' && (sortOrder === 'desc' ? '↓' : '↑')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('date')}>
              Sort by Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('votes')}>
              Sort by Votes {sortBy === 'votes' && (sortOrder === 'desc' ? '↓' : '↑')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Recommendations Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="implemented">Implemented</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {sortedRecommendations.map((recommendation, index) => {
            const Icon = recommendation.icon || Lightbulb
            const isExpanded = expandedRecommendation === recommendation.id
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "transition-shadow",
                  isExpanded ? "shadow-md" : "hover:shadow-sm"
                )}>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          recommendation.priority === 'critical' ? "bg-red-100 dark:bg-red-900/20" :
                          recommendation.priority === 'high' ? "bg-orange-100 dark:bg-orange-900/20" :
                          recommendation.priority === 'medium' ? "bg-yellow-100 dark:bg-yellow-900/20" :
                          "bg-green-100 dark:bg-green-900/20"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            recommendation.priority === 'critical' ? "text-red-600" :
                            recommendation.priority === 'high' ? "text-orange-600" :
                            recommendation.priority === 'medium' ? "text-yellow-600" :
                            "text-green-600"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {recommendation.category} • {getSourceLabel(recommendation.source)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(recommendation.status)}>
                          {getStatusIcon(recommendation.status)}
                          <span className="ml-1">
                            {recommendation.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleExpand(recommendation.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                      
                      {isExpanded && (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                              <p className={cn("font-medium", getPriorityColor(recommendation.priority))}>
                                {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Impact</p>
                              <p className={cn("font-medium", getImpactColor(recommendation.impact))}>
                                {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                              <div className="flex items-center gap-2">
                                <Progress value={recommendation.confidence} className="h-2 w-16" />
                                <span className="font-medium text-gray-900 dark:text-white">{recommendation.confidence}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {recommendation.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Estimated Impact</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {recommendation.estimatedImpact.revenue && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    ${recommendation.estimatedImpact.revenue.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {recommendation.estimatedImpact.conversion && (
                                <div className="flex items-center gap-2">
                                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {recommendation.estimatedImpact.conversion}% conversion
                                  </span>
                                </div>
                              )}
                              {recommendation.estimatedImpact.retention && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {recommendation.estimatedImpact.retention}% retention
                                  </span>
                                </div>
                              )}
                              {recommendation.estimatedImpact.efficiency && (
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {recommendation.estimatedImpact.efficiency}% efficiency
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Effort Required</p>
                            <Badge variant="outline">
                              {getEffortLabel(recommendation.estimatedEffort)}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Related Metrics</p>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.relatedMetrics.map((metric, metricIndex) => (
                                <Badge key={metricIndex} variant="outline" className="text-xs">
                                  {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {recommendation.assignedTo && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned To</p>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {recommendation.assignedTo}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleVote(recommendation.id, 'up')}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{recommendation.upvotes}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleVote(recommendation.id, 'down')}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                  <span>{recommendation.downvotes}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => setShowComments(!showComments)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{recommendation.comments}</span>
                                </Button>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    Save
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleStatusChange(recommendation.id, 'in_progress')}>
                                    <Clock className="mr-2 h-4 w-4 text-blue-600" />
                                    Mark In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(recommendation.id, 'implemented')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Mark Implemented
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(recommendation.id, 'rejected')}>
                                    <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handlePriorityChange(recommendation.id, 'high')}>
                                    <Flag className="mr-2 h-4 w-4 text-orange-600" />
                                    Set High Priority
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDelete(recommendation.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {showComments && (
                            <div className="mt-4 space-y-4">
                              <Separator />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Comments</h4>
                                <div className="space-y-3">
                                  {getRecommendationComments(recommendation.id).map(comment => (
                                    <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {comment.author}
                                          </span>
                                          {comment.isInternal && (
                                            <Badge variant="outline" className="text-xs">Internal</Badge>
                                          )}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {comment.timestamp.toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowHistory(!showHistory)}
                            className="mt-2"
                          >
                            {showHistory ? 'Hide History' : 'View History'}
                          </Button>

                          {showHistory && (
                            <div className="mt-4 space-y-4">
                              <Separator />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">History</h4>
                                <div className="space-y-3">
                                  {getRecommendationHistory(recommendation.id).map(item => (
                                    <div key={item.id} className="flex items-start gap-3">
                                      <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-0.5">
                                        {item.action === 'created' ? (
                                          <Lightbulb className="h-3 w-3 text-yellow-600" />
                                        ) : item.action === 'status_change' ? (
                                          <RefreshCw className="h-3 w-3 text-blue-600" />
                                        ) : (
                                          <Flag className="h-3 w-3 text-orange-600" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.user}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.timestamp.toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {item.action === 'created' ? (
                                            'Created this recommendation'
                                          ) : item.action === 'status_change' ? (
                                            `Changed status from ${item.previousStatus} to ${item.newStatus}`
                                          ) : (
                                            item.details
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {recommendation.status !== 'implemented' && recommendation.status !== 'rejected' && (
                          <Select onValueChange={(value) => handleStatusChange(recommendation.id, value)}>
                            <SelectTrigger className="h-8 w-36">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="implemented">Implemented</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="planned">Planned</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!isExpanded && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => handleVote(recommendation.id, 'up')}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{recommendation.upvotes}</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => handleVote(recommendation.id, 'down')}
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span>{recommendation.downvotes}</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {sortedRecommendations.filter(r => r.status === 'pending').map((recommendation, index) => {
            const Icon = recommendation.icon || Lightbulb
            return (
              <Card key={recommendation.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-yellow-600" />
                      <div>
                        <CardTitle>{recommendation.title}</CardTitle>
                        <CardDescription>{recommendation.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{recommendation.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getSourceLabel(recommendation.source)}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {recommendation.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm" onClick={() => handleStatusChange(recommendation.id, 'in_progress')}>
                      Start Implementation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {sortedRecommendations.filter(r => r.status === 'in_progress').map((recommendation, index) => {
            const Icon = recommendation.icon || Lightbulb
            return (
              <Card key={recommendation.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle>{recommendation.title}</CardTitle>
                        <CardDescription>
                          {recommendation.assignedTo ? `Assigned to ${recommendation.assignedTo}` : 'Unassigned'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{recommendation.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getEffortLabel(recommendation.estimatedEffort)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => handleStatusChange(recommendation.id, 'implemented')}>
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="implemented" className="space-y-4">
          {sortedRecommendations.filter(r => r.status === 'implemented').map((recommendation, index) => {
            const Icon = recommendation.icon || Lightbulb
            return (
              <Card key={recommendation.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-green-600" />
                      <div>
                        <CardTitle>{recommendation.title}</CardTitle>
                        <CardDescription>
                          Implemented {recommendation.implementedAt?.toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Implemented
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{recommendation.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Object.entries(recommendation.estimatedImpact).map(([key, value], i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {key === 'revenue' ? `$${value}` : `${value}% ${key}`}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{recommendation.upvotes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}