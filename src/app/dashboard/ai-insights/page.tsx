'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share,
  Download,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  MessageSquare,
  Sparkles,
  Bot,
  Cpu,
  Database,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AIInsight {
  id: string
  title: string
  description: string
  type: 'opportunity' | 'warning' | 'optimization' | 'prediction'
  priority: 'high' | 'medium' | 'low'
  impact: string
  confidence: number
  category: string
  actionable: boolean
  estimatedValue?: string
  timeframe?: string
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed'
  createdAt: Date
}

interface AIRecommendation {
  id: string
  title: string
  description: string
  category: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  confidence: number
  estimatedROI?: string
  steps: string[]
  metrics: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'rejected'
  votes: { up: number; down: number }
}

interface PredictiveModel {
  id: string
  name: string
  type: string
  accuracy: number
  lastTrained: Date
  predictions: {
    metric: string
    current: number
    predicted: number
    confidence: number
    timeframe: string
  }[]
}

export default function AIInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  // Mock AI insights data
  const insights: AIInsight[] = [
    {
      id: '1',
      title: 'Revenue Optimization Opportunity',
      description: 'AI detected a 23% increase in conversion rates when users view product demos. Consider promoting demo access on high-traffic pages.',
      type: 'opportunity',
      priority: 'high',
      impact: '+$12,500/month',
      confidence: 87,
      category: 'Revenue',
      actionable: true,
      estimatedValue: '$150,000 annually',
      timeframe: '2-4 weeks',
      status: 'new',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Customer Churn Risk Alert',
      description: 'ML model identifies 127 customers at high risk of churning within 30 days. Proactive engagement recommended.',
      type: 'warning',
      priority: 'high',
      impact: '-$45,000 potential loss',
      confidence: 92,
      category: 'Customer Retention',
      actionable: true,
      timeframe: 'Immediate',
      status: 'new',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Marketing Channel Optimization',
      description: 'Social media campaigns show 34% better ROI on weekends. Adjust budget allocation for optimal performance.',
      type: 'optimization',
      priority: 'medium',
      impact: '+18% ROI',
      confidence: 78,
      category: 'Marketing',
      actionable: true,
      estimatedValue: '$8,500/month',
      timeframe: '1 week',
      status: 'reviewed',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Seasonal Demand Prediction',
      description: 'AI forecasts 45% increase in demand for premium features during Q4. Prepare infrastructure and inventory.',
      type: 'prediction',
      priority: 'medium',
      impact: '+45% demand',
      confidence: 85,
      category: 'Operations',
      actionable: true,
      timeframe: '8-12 weeks',
      status: 'new',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: '5',
      title: 'User Experience Enhancement',
      description: 'Page load time optimization could reduce bounce rate by 15%. Focus on mobile performance improvements.',
      type: 'optimization',
      priority: 'medium',
      impact: '-15% bounce rate',
      confidence: 81,
      category: 'UX/Performance',
      actionable: true,
      estimatedValue: '$5,200/month',
      timeframe: '3-5 weeks',
      status: 'implemented',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ]

  // Mock recommendations
  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      title: 'Implement Dynamic Pricing Strategy',
      description: 'AI analysis suggests implementing dynamic pricing based on demand patterns, competitor analysis, and customer segments.',
      category: 'Revenue Optimization',
      impact: 'high',
      effort: 'medium',
      confidence: 89,
      estimatedROI: '25-35%',
      steps: [
        'Analyze historical pricing data and customer behavior',
        'Develop pricing algorithm with ML models',
        'A/B test dynamic pricing on select products',
        'Monitor performance and adjust parameters',
        'Full rollout with continuous optimization'
      ],
      metrics: ['Revenue per customer', 'Conversion rate', 'Customer satisfaction', 'Competitive position'],
      status: 'pending',
      votes: { up: 23, down: 2 }
    },
    {
      id: '2',
      title: 'Personalized Email Campaign Automation',
      description: 'Create AI-driven personalized email campaigns based on user behavior, preferences, and lifecycle stage.',
      category: 'Marketing Automation',
      impact: 'high',
      effort: 'low',
      confidence: 92,
      estimatedROI: '40-60%',
      steps: [
        'Segment users based on behavior patterns',
        'Create personalized email templates',
        'Set up automated trigger conditions',
        'Implement A/B testing framework',
        'Monitor and optimize campaign performance'
      ],
      metrics: ['Open rate', 'Click-through rate', 'Conversion rate', 'Revenue attribution'],
      status: 'in-progress',
      votes: { up: 31, down: 1 }
    },
    {
      id: '3',
      title: 'Predictive Customer Support',
      description: 'Implement AI-powered predictive support to identify and resolve customer issues before they escalate.',
      category: 'Customer Experience',
      impact: 'medium',
      effort: 'high',
      confidence: 76,
      estimatedROI: '15-25%',
      steps: [
        'Analyze support ticket patterns and customer data',
        'Develop predictive models for issue identification',
        'Create automated intervention workflows',
        'Train support team on new processes',
        'Implement feedback loop for continuous improvement'
      ],
      metrics: ['Customer satisfaction', 'Support ticket volume', 'Resolution time', 'Churn rate'],
      status: 'pending',
      votes: { up: 18, down: 5 }
    }
  ]

  // Mock predictive models
  const models: PredictiveModel[] = [
    {
      id: '1',
      name: 'Revenue Forecasting Model',
      type: 'Time Series',
      accuracy: 94.2,
      lastTrained: new Date(Date.now() - 24 * 60 * 60 * 1000),
      predictions: [
        { metric: 'Monthly Revenue', current: 124563, predicted: 142890, confidence: 89, timeframe: 'Next Month' },
        { metric: 'Quarterly Revenue', current: 373689, predicted: 445670, confidence: 85, timeframe: 'Next Quarter' }
      ]
    },
    {
      id: '2',
      name: 'Customer Churn Prediction',
      type: 'Classification',
      accuracy: 91.7,
      lastTrained: new Date(Date.now() - 12 * 60 * 60 * 1000),
      predictions: [
        { metric: 'High Risk Customers', current: 127, predicted: 89, confidence: 92, timeframe: 'Next 30 Days' },
        { metric: 'Churn Rate', current: 3.2, predicted: 2.1, confidence: 88, timeframe: 'Next Month' }
      ]
    },
    {
      id: '3',
      name: 'Demand Forecasting',
      type: 'Regression',
      accuracy: 87.3,
      lastTrained: new Date(Date.now() - 6 * 60 * 60 * 1000),
      predictions: [
        { metric: 'Product Demand', current: 2341, predicted: 3405, confidence: 84, timeframe: 'Next Week' },
        { metric: 'Service Requests', current: 456, predicted: 523, confidence: 79, timeframe: 'Next Month' }
      ]
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return Lightbulb
      case 'warning':
        return AlertTriangle
      case 'optimization':
        return Target
      case 'prediction':
        return TrendingUp
      default:
        return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'warning':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'optimization':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'prediction':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredInsights = insights.filter(insight => {
    const matchesCategory = selectedCategory === 'all' || insight.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesPriority = selectedPriority === 'all' || insight.priority === selectedPriority
    const matchesSearch = searchQuery === '' || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesPriority && matchesSearch
  })

  const handleGenerateInsights = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    toast.success('New AI insights generated!')
  }

  const handleCustomAnalysis = async () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a prompt for analysis')
      return
    }
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setCustomPrompt('')
    toast.success('Custom analysis completed!')
  }

  const handleVote = (recommendationId: string, type: 'up' | 'down') => {
    toast.success(`Vote recorded for recommendation`)
  }

  const handleImplement = (insightId: string) => {
    toast.success('Insight marked for implementation')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="h-7 w-7 text-purple-600" />
            AI Insights & Suggestions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered business insights and recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleGenerateInsights} disabled={isGenerating}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
            Generate Insights
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="ux">UX/Performance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Insights Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type)
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", getInsightColor(insight.type))}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleImplement(insight.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Implement
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bookmark className="mr-2 h-4 w-4" />
                              Save for Later
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{insight.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Impact</p>
                          <p className="font-medium text-gray-900 dark:text-white">{insight.impact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                          <div className="flex items-center gap-2">
                            <Progress value={insight.confidence} className="flex-1" />
                            <span className="text-sm font-medium">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      {insight.estimatedValue && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</p>
                          <p className="font-medium text-green-600">{insight.estimatedValue}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {insight.timeframe}
                        </div>
                        <Button size="sm" onClick={() => handleImplement(insight.id)}>
                          Implement
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{rec.title}</CardTitle>
                        <CardDescription className="mt-2">{rec.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline">{rec.category}</Badge>
                          <Badge className={cn(
                            "text-xs",
                            rec.status === 'completed' ? 'bg-green-100 text-green-800' :
                            rec.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            rec.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          )}>
                            {rec.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleVote(rec.id, 'up')}>
                          <ThumbsUp className="h-4 w-4" />
                          {rec.votes.up}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleVote(rec.id, 'down')}>
                          <ThumbsDown className="h-4 w-4" />
                          {rec.votes.down}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Impact</p>
                        <p className={cn("font-medium", getImpactColor(rec.impact))}>
                          {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Effort</p>
                        <p className={cn("font-medium", getEffortColor(rec.effort))}>
                          {rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={rec.confidence} className="flex-1" />
                          <span className="text-sm font-medium">{rec.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Est. ROI</p>
                        <p className="font-medium text-green-600">{rec.estimatedROI}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Implementation Steps</h4>
                        <ol className="space-y-2">
                          {rec.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Metrics</h4>
                        <div className="space-y-2">
                          {rec.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Discuss
                        </Button>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Start Implementation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>{model.type} Model</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                        <p className="text-lg font-bold text-green-600">{model.accuracy}%</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {model.predictions.map((prediction, predIndex) => (
                        <div key={predIndex} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {prediction.metric}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {prediction.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Current</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {typeof prediction.current === 'number' && prediction.current > 1000 
                                  ? prediction.current.toLocaleString()
                                  : prediction.current
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Predicted</p>
                              <p className="font-medium text-purple-600">
                                {typeof prediction.predicted === 'number' && prediction.predicted > 1000 
                                  ? prediction.predicted.toLocaleString()
                                  : prediction.predicted
                                }
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {prediction.timeframe}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last trained: {model.lastTrained.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Custom AI Analysis
              </CardTitle>
              <CardDescription>
                Ask our AI to analyze specific aspects of your business data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Analysis Prompt
                  </label>
                  <Textarea
                    placeholder="e.g., Analyze customer behavior patterns for users who purchased in the last 30 days and identify opportunities to increase repeat purchases..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI will analyze your data and provide actionable insights
                  </p>
                  <Button 
                    onClick={handleCustomAnalysis} 
                    disabled={isGenerating || !customPrompt.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Cpu className="h-4 w-4 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Analysis Results</CardTitle>
              <CardDescription>Previous custom analyses and their insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Customer Segmentation Analysis
                    </h4>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Analyzed customer purchase patterns and identified 3 distinct segments with different engagement strategies.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Pricing Optimization Study
                    </h4>
                    <Badge variant="outline">1 day ago</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Identified optimal pricing points for different customer segments, potentially increasing revenue by 18%.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}