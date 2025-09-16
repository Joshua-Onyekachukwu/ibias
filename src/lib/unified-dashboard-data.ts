// Unified Dashboard Data Source
// Central data management for all dashboard components

export interface UnifiedDashboardData {
  // Company & User Profile
  companyProfile: {
    name: string;
    industry: string;
    size: string;
    founded: string;
    website: string;
    logo: string;
  };
  userProfile: {
    name: string;
    email: string;
    role: string;
    avatar: string;
    lastLogin: string;
    timezone: string;
  };

  // Core Business Metrics
  businessSummary: {
    totalRevenue: number;
    totalCustomers: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    customerSatisfaction: number;
    monthlyGrowth: number;
    yearOverYearGrowth: number;
  };

  // KPI Data
  kpiData: Array<{
    id: string;
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
    icon: string;
    color: string;
    description: string;
    target?: string;
    period: string;
  }>;

  // Chart Data
  chartData: {
    revenue: Array<{
      month: string;
      revenue: number;
      customers: number;
      orders: number;
      conversion: number;
    }>;
    timeRange: string;
    currency: string;
  };

  // Product Data
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    units: number;
    growth: number;
    category: string;
    price: number;
    margin: number;
    image: string;
    rating: number;
    inventory: number;
    status: 'active' | 'low_stock' | 'out_of_stock';
    lifecycle: 'new' | 'growing' | 'mature' | 'declining';
  }>;

  // Customer Segments
  customerSegments: Array<{
    id: string;
    name: string;
    count: number;
    percentage: number;
    revenue: number;
    color: string;
    growth: number;
    averageOrderValue: number;
    description: string;
    icon: string;
    acquisitionCost: number;
    lifetimeValue: number;
    retentionRate: number;
    riskScore?: number;
  }>;

  customerDistribution: {
    total: number;
    segments: Array<{
      name: string;
      value: number;
      percentage: number;
      color: string;
    }>;
  };

  // Conversion Funnel
  conversionFunnel: Array<{
    id: string;
    stage: string;
    count: number;
    percentage: number;
    color: string;
    icon: string;
    description: string;
    dropOffRate: number;
    averageTime: string;
    conversionRate?: number;
  }>;

  conversionAnalytics: {
    overallConversion: number;
    addToCartRate: number;
    checkoutCompletion: number;
    averageSessionDuration: string;
    cartAbandonmentRate: number;
    topDropOffStage: string;
  };

  // Live Data
  liveActivities: Array<{
    id: string;
    user: string;
    action: string;
    amount?: number;
    timestamp: string;
    location: string;
    status: 'completed' | 'pending' | 'failed';
    type: 'purchase' | 'signup' | 'refund' | 'view' | 'support';
    avatar?: string;
  }>;

  liveMetrics: {
    activeSessions: number;
    revenueToday: number;
    conversionRate: number;
    customerSatisfaction: number;
    isLiveDataActive: boolean;
    lastUpdate: string;
    syncStatus: 'synced' | 'syncing' | 'error';
  };

  // System Performance
  systemPerformance: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    activeConnections: number;
    throughput: number;
  };

  // Data Quality
  dataQuality: {
    overallScore: number;
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
    issues: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      count: number;
    }>;
  };

  // Integrations
  integrations: Array<{
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'error' | 'syncing';
    lastSync: string;
    dataPoints: number;
    icon: string;
    color: string;
    description: string;
    health: number;
  }>;

  // Quick Actions
  quickActions: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    action: string;
    category: 'analytics' | 'export' | 'ai' | 'integration' | 'report';
    enabled: boolean;
  }>;
}

// Generate mock data
export const generateUnifiedDashboardData = (): UnifiedDashboardData => {
  // const currentDate = new Date();
  // const _currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  // const _currentYear = currentDate.getFullYear();

  return {
    companyProfile: {
      name: "TechFlow Solutions",
      industry: "E-commerce Technology",
      size: "50-200 employees",
      founded: "2019",
      website: "https://techflow.com",
      logo: "/logos/techflow-logo.svg"
    },

    userProfile: {
      name: "Sarah Chen",
      email: "sarah.chen@techflow.com",
      role: "Analytics Manager",
      avatar: "/avatars/sarah-chen.jpg",
      lastLogin: "2 hours ago",
      timezone: "PST"
    },

    businessSummary: {
      totalRevenue: 2847650,
      totalCustomers: 12847,
      totalOrders: 8934,
      averageOrderValue: 318.75,
      conversionRate: 3.24,
      customerSatisfaction: 4.7,
      monthlyGrowth: 12.5,
      yearOverYearGrowth: 34.2
    },

    kpiData: [
      {
        id: "total-revenue",
        title: "Total Revenue",
        value: "$2.85M",
        change: "+12.5%",
        trend: "up",
        icon: "DollarSign",
        color: "emerald",
        description: "Total revenue this month",
        target: "$3.2M",
        period: "This Month"
      },
      {
        id: "total-customers",
        title: "Total Customers",
        value: "12,847",
        change: "+8.2%",
        trend: "up",
        icon: "Users",
        color: "blue",
        description: "Active customer base",
        target: "15,000",
        period: "This Month"
      },
      {
        id: "conversion-rate",
        title: "Conversion Rate",
        value: "3.24%",
        change: "+0.3%",
        trend: "up",
        icon: "TrendingUp",
        color: "purple",
        description: "Visitor to customer conversion",
        target: "4.0%",
        period: "This Month"
      },
      {
        id: "avg-order-value",
        title: "Avg Order Value",
        value: "$318.75",
        change: "+5.1%",
        trend: "up",
        icon: "ShoppingCart",
        color: "orange",
        description: "Average order value",
        target: "$350",
        period: "This Month"
      },
      {
        id: "active-users",
        title: "Active Users",
        value: "8,934",
        change: "+15.3%",
        trend: "up",
        icon: "Activity",
        color: "green",
        description: "Monthly active users",
        target: "10,000",
        period: "This Month"
      },
      {
        id: "total-orders",
        title: "Total Orders",
        value: "8,934",
        change: "+9.7%",
        trend: "up",
        icon: "Package",
        color: "indigo",
        description: "Orders processed this month",
        target: "10,000",
        period: "This Month"
      },
      {
        id: "customer-ltv",
        title: "Customer LTV",
        value: "$1,247",
        change: "+18.2%",
        trend: "up",
        icon: "Heart",
        color: "pink",
        description: "Average customer lifetime value",
        target: "$1,500",
        period: "This Quarter"
      },
      {
        id: "churn-rate",
        title: "Churn Rate",
        value: "2.1%",
        change: "-0.5%",
        trend: "up",
        icon: "UserMinus",
        color: "red",
        description: "Monthly customer churn rate",
        target: "<2.0%",
        period: "This Month"
      }
    ],

    chartData: {
      revenue: [
        { month: "Jan 2024", revenue: 1850000, customers: 8500, orders: 5200, conversion: 2.8 },
        { month: "Feb 2024", revenue: 1920000, customers: 8800, orders: 5450, conversion: 2.9 },
        { month: "Mar 2024", revenue: 2100000, customers: 9200, orders: 5800, conversion: 3.0 },
        { month: "Apr 2024", revenue: 2250000, customers: 9600, orders: 6100, conversion: 3.1 },
        { month: "May 2024", revenue: 2180000, customers: 9400, orders: 5950, conversion: 3.0 },
        { month: "Jun 2024", revenue: 2350000, customers: 10100, orders: 6400, conversion: 3.2 },
        { month: "Jul 2024", revenue: 2420000, customers: 10500, orders: 6650, conversion: 3.2 },
        { month: "Aug 2024", revenue: 2580000, customers: 11200, orders: 7100, conversion: 3.3 },
        { month: "Sep 2024", revenue: 2650000, customers: 11600, orders: 7350, conversion: 3.2 },
        { month: "Oct 2024", revenue: 2720000, customers: 12000, orders: 7600, conversion: 3.3 },
        { month: "Nov 2024", revenue: 2780000, customers: 12400, orders: 7850, conversion: 3.2 },
        { month: "Dec 2024", revenue: 2847650, customers: 12847, orders: 8934, conversion: 3.24 }
      ],
      timeRange: "Last 12 Months",
      currency: "USD"
    },

    topProducts: [
      {
        id: "prod-001",
        name: "Premium Wireless Headphones",
        revenue: 485000,
        units: 1250,
        growth: 23.5,
        category: "Electronics",
        price: 299.99,
        margin: 45.2,
        image: "/products/headphones.jpg",
        rating: 4.8,
        inventory: 150,
        status: "active",
        lifecycle: "growing"
      },
      {
        id: "prod-002",
        name: "Smart Fitness Tracker",
        revenue: 420000,
        units: 2100,
        growth: 18.7,
        category: "Wearables",
        price: 199.99,
        margin: 38.5,
        image: "/products/fitness-tracker.jpg",
        rating: 4.6,
        inventory: 75,
        status: "low_stock",
        lifecycle: "mature"
      },
      {
        id: "prod-003",
        name: "Ergonomic Office Chair",
        revenue: 380000,
        units: 760,
        growth: 15.2,
        category: "Furniture",
        price: 499.99,
        margin: 52.1,
        image: "/products/office-chair.jpg",
        rating: 4.7,
        inventory: 45,
        status: "low_stock",
        lifecycle: "mature"
      },
      {
        id: "prod-004",
        name: "4K Webcam Pro",
        revenue: 340000,
        units: 1700,
        growth: 28.9,
        category: "Electronics",
        price: 199.99,
        margin: 41.3,
        image: "/products/webcam.jpg",
        rating: 4.5,
        inventory: 200,
        status: "active",
        lifecycle: "growing"
      },
      {
        id: "prod-005",
        name: "Mechanical Gaming Keyboard",
        revenue: 295000,
        units: 1180,
        growth: 12.4,
        category: "Gaming",
        price: 249.99,
        margin: 43.7,
        image: "/products/keyboard.jpg",
        rating: 4.9,
        inventory: 120,
        status: "active",
        lifecycle: "mature"
      }
    ],

    customerSegments: [
      {
        id: "new-customers",
        name: "New Customers",
        count: 3854,
        percentage: 30.0,
        revenue: 854250,
        color: "#10B981",
        growth: 25.3,
        averageOrderValue: 221.50,
        description: "First-time buyers in the last 90 days",
        icon: "UserPlus",
        acquisitionCost: 45.20,
        lifetimeValue: 680.00,
        retentionRate: 68.5
      },
      {
        id: "returning-customers",
        name: "Returning Customers",
        count: 5139,
        percentage: 40.0,
        revenue: 1423950,
        color: "#3B82F6",
        growth: 12.8,
        averageOrderValue: 277.10,
        description: "Customers with 2-5 purchases",
        icon: "RefreshCw",
        acquisitionCost: 28.50,
        lifetimeValue: 1240.00,
        retentionRate: 82.3
      },
      {
        id: "vip-customers",
        name: "VIP Customers",
        count: 2569,
        percentage: 20.0,
        revenue: 1139400,
        color: "#F59E0B",
        growth: 8.5,
        averageOrderValue: 443.75,
        description: "High-value customers with 6+ purchases",
        icon: "Crown",
        acquisitionCost: 15.30,
        lifetimeValue: 2850.00,
        retentionRate: 94.7
      },
      {
        id: "at-risk",
        name: "At Risk",
        count: 1285,
        percentage: 10.0,
        revenue: 430050,
        color: "#EF4444",
        growth: -5.2,
        averageOrderValue: 334.75,
        description: "Customers who haven't purchased in 120+ days",
        icon: "AlertTriangle",
        acquisitionCost: 52.80,
        lifetimeValue: 890.00,
        retentionRate: 23.1,
        riskScore: 78.5
      }
    ],

    customerDistribution: {
      total: 12847,
      segments: [
        { name: "New Customers", value: 3854, percentage: 30.0, color: "#10B981" },
        { name: "Returning Customers", value: 5139, percentage: 40.0, color: "#3B82F6" },
        { name: "VIP Customers", value: 2569, percentage: 20.0, color: "#F59E0B" },
        { name: "At Risk", value: 1285, percentage: 10.0, color: "#EF4444" }
      ]
    },

    conversionFunnel: [
      {
        id: "visitors",
        stage: "Website Visitors",
        count: 125000,
        percentage: 100,
        color: "#3B82F6",
        icon: "Eye",
        description: "Total unique visitors",
        dropOffRate: 0,
        averageTime: "2m 34s"
      },
      {
        id: "interest",
        stage: "Product Interest",
        count: 45000,
        percentage: 36,
        color: "#8B5CF6",
        icon: "Search",
        description: "Viewed product pages",
        dropOffRate: 64,
        averageTime: "4m 12s",
        conversionRate: 36.0
      },
      {
        id: "cart",
        stage: "Add to Cart",
        count: 18000,
        percentage: 14.4,
        color: "#F59E0B",
        icon: "ShoppingCart",
        description: "Added items to cart",
        dropOffRate: 60,
        averageTime: "6m 45s",
        conversionRate: 40.0
      },
      {
        id: "checkout",
        stage: "Checkout Started",
        count: 12600,
        percentage: 10.08,
        color: "#10B981",
        icon: "CreditCard",
        description: "Initiated checkout process",
        dropOffRate: 30,
        averageTime: "3m 28s",
        conversionRate: 70.0
      },
      {
        id: "completed",
        stage: "Order Completed",
        count: 8934,
        percentage: 7.15,
        color: "#059669",
        icon: "CheckCircle",
        description: "Successfully completed purchase",
        dropOffRate: 29.1,
        averageTime: "1m 52s",
        conversionRate: 70.9
      }
    ],

    conversionAnalytics: {
      overallConversion: 7.15,
      addToCartRate: 40.0,
      checkoutCompletion: 70.9,
      averageSessionDuration: "4m 32s",
      cartAbandonmentRate: 50.4,
      topDropOffStage: "Product Interest"
    },

    liveActivities: generateLiveActivities(),

    liveMetrics: {
      activeSessions: 1247,
      revenueToday: 45680,
      conversionRate: 3.24,
      customerSatisfaction: 4.7,
      isLiveDataActive: true,
      lastUpdate: new Date().toISOString(),
      syncStatus: "synced"
    },

    systemPerformance: {
      uptime: 99.97,
      responseTime: 145,
      errorRate: 0.02,
      cpuUsage: 34.5,
      memoryUsage: 67.2,
      diskUsage: 45.8,
      activeConnections: 2847,
      throughput: 1250
    },

    dataQuality: {
      overallScore: 94.5,
      completeness: 96.8,
      accuracy: 94.2,
      consistency: 92.1,
      timeliness: 97.3,
      validity: 95.6,
      issues: [
        {
          type: "Missing Customer Data",
          description: "Some customer records missing email addresses",
          severity: "medium",
          count: 23
        },
        {
          type: "Duplicate Orders",
          description: "Potential duplicate order entries detected",
          severity: "low",
          count: 7
        },
        {
          type: "Outdated Product Info",
          description: "Product descriptions need updating",
          severity: "low",
          count: 12
        }
      ]
    },

    integrations: [
      {
        id: "shopify",
        name: "Shopify",
        status: "connected",
        lastSync: "2 minutes ago",
        dataPoints: 15420,
        icon: "ShoppingBag",
        color: "#95BF47",
        description: "E-commerce platform integration",
        health: 98.5
      },
      {
        id: "google-analytics",
        name: "Google Analytics",
        status: "connected",
        lastSync: "5 minutes ago",
        dataPoints: 8934,
        icon: "BarChart3",
        color: "#4285F4",
        description: "Web analytics and tracking",
        health: 96.2
      },
      {
        id: "stripe",
        name: "Stripe",
        status: "connected",
        lastSync: "1 minute ago",
        dataPoints: 12847,
        icon: "CreditCard",
        color: "#635BFF",
        description: "Payment processing integration",
        health: 99.1
      },
      {
        id: "facebook-ads",
        name: "Facebook Ads",
        status: "syncing",
        lastSync: "15 minutes ago",
        dataPoints: 5623,
        icon: "Target",
        color: "#1877F2",
        description: "Social media advertising platform",
        health: 87.3
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        status: "error",
        lastSync: "2 hours ago",
        dataPoints: 0,
        icon: "Mail",
        color: "#FFE01B",
        description: "Email marketing platform",
        health: 45.2
      }
    ],

    quickActions: [
      {
        id: "generate-report",
        title: "Generate Report",
        description: "Create comprehensive analytics report",
        icon: "FileText",
        color: "blue",
        action: "/dashboard/reports/generate",
        category: "report",
        enabled: true
      },
      {
        id: "export-data",
        title: "Export Data",
        description: "Export dashboard data to CSV/Excel",
        icon: "Download",
        color: "green",
        action: "/dashboard/export",
        category: "export",
        enabled: true
      },
      {
        id: "ai-insights",
        title: "AI Insights",
        description: "Get AI-powered business recommendations",
        icon: "Brain",
        color: "purple",
        action: "/dashboard/ai-insights",
        category: "ai",
        enabled: true
      },
      {
        id: "add-integration",
        title: "Add Integration",
        description: "Connect new data sources",
        icon: "Plus",
        color: "orange",
        action: "/dashboard/integrations",
        category: "integration",
        enabled: true
      },
      {
        id: "schedule-alert",
        title: "Schedule Alert",
        description: "Set up automated alerts and notifications",
        icon: "Bell",
        color: "yellow",
        action: "/dashboard/alerts",
        category: "analytics",
        enabled: true
      },
      {
        id: "view-analytics",
        title: "View Analytics",
        description: "Deep dive into detailed analytics",
        icon: "TrendingUp",
        color: "indigo",
        action: "/dashboard/analytics",
        category: "analytics",
        enabled: true
      }
    ]
  };
};

// Utility Functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (num: number, decimals = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Generate Live Activities
function generateLiveActivities() {
  const activities = [
    {
      id: "act-001",
      user: "John Smith",
      action: "purchased Premium Wireless Headphones",
      amount: 299.99,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      location: "New York, US",
      status: "completed" as const,
      type: "purchase" as const,
      avatar: "/avatars/john-smith.jpg"
    },
    {
      id: "act-002",
      user: "Emma Wilson",
      action: "signed up for newsletter",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      location: "London, UK",
      status: "completed" as const,
      type: "signup" as const,
      avatar: "/avatars/emma-wilson.jpg"
    },
    {
      id: "act-003",
      user: "Michael Chen",
      action: "requested refund for Smart Fitness Tracker",
      amount: 199.99,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      location: "Toronto, CA",
      status: "pending" as const,
      type: "refund" as const,
      avatar: "/avatars/michael-chen.jpg"
    },
    {
      id: "act-004",
      user: "Sarah Davis",
      action: "viewed Ergonomic Office Chair",
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      location: "Sydney, AU",
      status: "completed" as const,
      type: "view" as const,
      avatar: "/avatars/sarah-davis.jpg"
    },
    {
      id: "act-005",
      user: "David Rodriguez",
      action: "contacted support about order #12847",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      location: "Madrid, ES",
      status: "completed" as const,
      type: "support" as const,
      avatar: "/avatars/david-rodriguez.jpg"
    },
    {
      id: "act-006",
      user: "Lisa Johnson",
      action: "purchased 4K Webcam Pro",
      amount: 199.99,
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      location: "Berlin, DE",
      status: "completed" as const,
      type: "purchase" as const,
      avatar: "/avatars/lisa-johnson.jpg"
    }
  ];

  return activities;
}

// Update Live Metrics (for real-time simulation)
export const updateLiveMetrics = (currentMetrics: { activeSessions: number; revenueToday: number; conversionRate: number; customerSatisfaction: number }) => {
  const variations = {
    activeSessions: Math.floor(Math.random() * 100) - 50,
    revenueToday: Math.floor(Math.random() * 1000) - 500,
    conversionRate: (Math.random() * 0.2) - 0.1,
    customerSatisfaction: (Math.random() * 0.2) - 0.1
  };

  return {
    ...currentMetrics,
    activeSessions: Math.max(0, currentMetrics.activeSessions + variations.activeSessions),
    revenueToday: Math.max(0, currentMetrics.revenueToday + variations.revenueToday),
    conversionRate: Math.max(0, Math.min(100, currentMetrics.conversionRate + variations.conversionRate)),
    customerSatisfaction: Math.max(0, Math.min(5, currentMetrics.customerSatisfaction + variations.customerSatisfaction)),
    lastUpdate: new Date().toISOString()
  };
};

// Export the unified data instance
export const unifiedDashboardData = generateUnifiedDashboardData();

// Export default
export default unifiedDashboardData;