'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Brain, Zap, Settings, Activity, TrendingUp, Database } from 'lucide-react'

export default function AdminModelsPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      status: 'active',
      usage: 85,
      cost: '$1,234.56',
      requests: '12,450'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'Anthropic',
      status: 'active',
      usage: 62,
      cost: '$892.34',
      requests: '8,920'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      status: 'standby',
      usage: 23,
      cost: '$156.78',
      requests: '3,210'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Models Management</h1>
        <p className="text-muted-foreground">
          Monitor and configure AI models, usage, and performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,580</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Costs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,283.68</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 primary, 1 fallback
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>
                Current AI model usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{model.name}</h3>
                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                          {model.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.provider}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Requests: {model.requests}</span>
                        <span>Cost: {model.cost}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-sm font-medium">{model.usage}% usage</div>
                      <Progress value={model.usage} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Configure AI model settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Primary Model</h3>
                    <p className="text-sm text-muted-foreground">Main AI model for processing</p>
                  </div>
                  <Button>Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Fallback Strategy</h3>
                    <p className="text-sm text-muted-foreground">Backup models and error handling</p>
                  </div>
                  <Button variant="outline">Setup</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground">API usage limits and throttling</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>
                Monitor AI model performance and health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Response Times</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">Chart placeholder</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Error Rates</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">Chart placeholder</span>
                    </div>
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