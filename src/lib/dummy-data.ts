// Centralized dummy data for IBIAS dashboard - TechVibe Electronics
// A comprehensive e-commerce business specializing in consumer electronics
// Founded: 2019 | Headquarters: Austin, TX | Employees: 150+
// Annual Revenue: $34.2M | Monthly Active Users: 85K+

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'indigo' | 'emerald' | 'orange' | 'amber';
  description?: string;
  subtitle?: string;
  target?: number;
  lastUpdated?: string;
  comparisonPeriod?: string;
}

export interface ProductData {
  id: string;
  name: string;
  revenue: number;
  units: number;
  growth: number;
  category: string;
}

export interface ActivityData {
  id: string;
  type: 'sale' | 'signup' | 'refund' | 'support';
  description: string;
  timestamp: string;
  amount?: number;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface CustomerSegment {
  id?: string;
  name: string;
  count: number;
  percentage: number;
  revenue: number;
  color: string;
  growth: number;
  avgOrderValue: number;
  description: string;
  icon: string;
}

export interface ConversionStep {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  rate: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  joinDate: string;
  timezone: string;
  lastLogin: string;
  avatar?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface SystemMetrics {
  uptime: string;
  responseTime: string;
  errorRate: string;
  dataQuality: string;
  lastUpdated: string;
}

export interface DataQualityMetric {
  id: string;
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastChecked: string;
  issues?: string[];
}

// TechVibe Electronics - Company Profile
export const companyProfile = {
  name: 'TechVibe Electronics',
  founded: '2019',
  headquarters: 'Austin, TX',
  employees: 152,
  industry: 'Consumer Electronics E-commerce',
  website: 'techvibe.com',
  description: 'Leading online retailer of premium consumer electronics and smart devices'
};

// User Profile Data
export const userProfile = {
  name: 'Semek Johnson',
  email: 'semek.johnson@techvibe.com',
  avatar: '/avatars/semek.jpg',
  timezone: 'UTC-6', // Austin, TX timezone
  lastLogin: new Date().toISOString(),
  role: 'Chief Analytics Officer',
  company: 'TechVibe Electronics',
  joinDate: '2021-03-15',
  department: 'Business Intelligence'
}

// Primary KPI Data - TechVibe Electronics August 2025
export const primaryKPIs: KPIData[] = [
  {
    id: 'total-revenue',
    title: 'Monthly Revenue',
    value: '$3,820,000',
    change: '+14.2%',
    trend: 'up',
    icon: 'DollarSign',
    color: 'blue',
    description: 'Total revenue generated this month',
    subtitle: 'vs last month',
    target: 4000000,
    lastUpdated: '2m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'total-customers',
    title: 'Active Customers',
    value: '21,300',
    change: '+9.7%',
    trend: 'up',
    icon: 'Users',
    color: 'green',
    description: 'Monthly active customers',
    subtitle: 'vs last month',
    target: 25000,
    lastUpdated: '1m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '4.12%',
    change: '+0.24%',
    trend: 'up',
    icon: 'Target',
    color: 'purple',
    description: 'Visitor to customer conversion rate',
    subtitle: 'vs last month',
    target: 4.5,
    lastUpdated: '3m ago',
    comparisonPeriod: 'July 2025'
  }
];

// Secondary KPI Data - TechVibe Electronics Performance Metrics
export const secondaryKPIs: KPIData[] = [
  {
    id: 'avg-order-value',
    title: 'Avg Order Value',
    value: '$337.25',
    change: '+6.8%',
    trend: 'up',
    icon: 'ShoppingCart',
    color: 'indigo',
    description: 'Average value per order',
    subtitle: 'vs last month',
    target: 350,
    lastUpdated: '5m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'bounce-rate',
    title: 'Bounce Rate',
    value: '22.1%',
    change: '-3.2%',
    trend: 'down',
    icon: 'TrendingDown',
    color: 'red',
    description: 'Percentage of single-page sessions',
    subtitle: 'vs last month',
    target: 20,
    lastUpdated: '4m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'monthly-orders',
    title: 'Monthly Orders',
    value: '11,340',
    change: '+18.2%',
    trend: 'up',
    icon: 'Package',
    color: 'emerald',
    description: 'Total orders this month',
    subtitle: 'vs last month',
    target: 12000,
    lastUpdated: '6m ago',
    comparisonPeriod: 'July 2025'
  }
];

// Additional KPI Data - TechVibe Electronics Customer Metrics
export const additionalKPIs: KPIData[] = [
  {
    id: 'customer-lifetime-value',
    title: 'Customer LTV',
    value: '$1,485',
    change: '+22.1%',
    trend: 'up',
    icon: 'TrendingUp',
    color: 'emerald',
    description: 'Average customer lifetime value',
    subtitle: 'vs last quarter',
    target: 1600,
    lastUpdated: '3m ago',
    comparisonPeriod: 'Q2 2025'
  },
  {
    id: 'return-rate',
    title: 'Return Rate',
    value: '2.3%',
    change: '-0.6%',
    trend: 'down',
    icon: 'RotateCcw',
    color: 'orange',
    description: 'Product return rate (lower is better)',
    subtitle: 'vs last month',
    target: 2.0,
    lastUpdated: '1m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'inventory-turnover',
    title: 'Inventory Turnover',
    value: '7.4x',
    change: '+1.2x',
    trend: 'up',
    icon: 'Package',
    color: 'blue',
    description: 'Inventory turnover ratio',
    subtitle: 'vs last quarter',
    target: 8.0,
    lastUpdated: '2h ago',
    comparisonPeriod: 'Q2 2025'
  }
];

// KPI Data - TechVibe Electronics Main Dashboard Metrics
export const kpiData: KPIData[] = [
  {
    id: 'annual-revenue',
    title: 'Annual Revenue',
    value: '$42.8M',
    change: '+25.1%',
    trend: 'up',
    icon: 'DollarSign',
    color: 'emerald',
    description: 'Total annual revenue (2025 projected)',
    subtitle: 'vs 2024',
    target: 45000000,
    lastUpdated: '1h ago',
    comparisonPeriod: '2024'
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '156,420',
    change: '+12.8%',
    trend: 'up',
    icon: 'Users',
    color: 'blue',
    description: 'Total registered customers',
    subtitle: 'vs last month',
    target: 170000,
    lastUpdated: '30m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '4.12%',
    change: '+0.24%',
    trend: 'up',
    icon: 'Target',
    color: 'purple',
    description: 'Visitor to customer conversion rate',
    subtitle: 'vs last month',
    target: 4.5,
    lastUpdated: '15m ago',
    comparisonPeriod: 'July 2025'
  },
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    value: '4.7/5',
    change: '+0.2',
    trend: 'up',
    icon: 'Star',
    color: 'amber',
    description: 'Average customer rating',
    subtitle: 'vs last quarter',
    target: 4.8,
    lastUpdated: '2h ago',
    comparisonPeriod: 'Q2 2025'
  }
];



// Business metrics summary - defined separately for export
export const businessSummary = {
  totalRevenue: 42800000, // $42.8M annual (2025 projected)
  monthlyRevenue: 3820000, // August 2025
  totalCustomers: 156420,
  monthlyOrders: 11340,
  avgOrderValue: 337.25,
  conversionRate: 4.12,
  customerSatisfaction: 4.8,
  marketShare: 15.2, // % in consumer electronics
  employeeCount: 185,
  foundedYear: 2019,
  geographic: {
    regions: [
      { name: 'North America', revenue: 18564000, percentage: 54.3, growth: 12.8 },
      { name: 'Europe', revenue: 10260000, percentage: 30.0, growth: 18.2 },
      { name: 'Asia Pacific', revenue: 4104000, percentage: 12.0, growth: 28.5 },
      { name: 'Other', revenue: 1272000, percentage: 3.7, growth: 15.1 }
    ],
    countries: [
      { name: 'United States', revenue: 15651600, percentage: 36.6, growth: 14.5 },
      { name: 'Canada', revenue: 2912400, percentage: 6.8, growth: 17.2 },
      { name: 'United Kingdom', revenue: 4104000, percentage: 9.6, growth: 10.7 },
      { name: 'Germany', revenue: 3420000, percentage: 8.0, growth: 8.3 },
      { name: 'France', revenue: 2736000, percentage: 6.4, growth: 12.1 },
      { name: 'Japan', revenue: 2052000, percentage: 4.8, growth: 22.3 },
      { name: 'Australia', revenue: 1368000, percentage: 3.2, growth: 24.1 },
      { name: 'China', revenue: 684000, percentage: 1.6, growth: 35.7 },
      { name: 'Others', revenue: 9872000, percentage: 23.0, growth: 18.9 }
    ]
  }
};

export const dashboardData = {
  // User information
  user: {
    name: 'Semek Johnson',
    lastLogin: new Date().toISOString(),
    role: 'Chief Analytics Officer',
    company: 'TechVibe Electronics'
  },

  // Revenue chart data - TechVibe Electronics Jan 2024 to Aug 2025
  revenueChart: [
    // 2024 Data
    { month: 'Jan 2024', value: 2180000, orders: 6470, customers: 12450 },
    { month: 'Feb 2024', value: 2420000, orders: 7180, customers: 13200 },
    { month: 'Mar 2024', value: 2650000, orders: 7860, customers: 14100 },
    { month: 'Apr 2024', value: 2890000, orders: 8580, customers: 15300 },
    { month: 'May 2024', value: 3120000, orders: 9260, customers: 16800 },
    { month: 'Jun 2024', value: 2980000, orders: 8840, customers: 16200 },
    { month: 'Jul 2024', value: 3250000, orders: 9650, customers: 17500 },
    { month: 'Aug 2024', value: 3180000, orders: 9440, customers: 17200 },
    { month: 'Sep 2024', value: 2920000, orders: 8670, customers: 16400 },
    { month: 'Oct 2024', value: 3080000, orders: 9140, customers: 17000 },
    { month: 'Nov 2024', value: 2530000, orders: 7520, customers: 15800 },
    { month: 'Dec 2024', value: 2847392, orders: 8456, customers: 16900 },
    // 2025 Data - Growth trajectory continues
    { month: 'Jan 2025', value: 3150000, orders: 9350, customers: 18200 },
    { month: 'Feb 2025', value: 3280000, orders: 9740, customers: 18800 },
    { month: 'Mar 2025', value: 3420000, orders: 10150, customers: 19400 },
    { month: 'Apr 2025', value: 3580000, orders: 10620, customers: 20100 },
    { month: 'May 2025', value: 3750000, orders: 11130, customers: 20800 },
    { month: 'Jun 2025', value: 3650000, orders: 10840, customers: 20500 },
    { month: 'Jul 2025', value: 3890000, orders: 11550, customers: 21600 },
    { month: 'Aug 2025', value: 3820000, orders: 11340, customers: 21300 }
  ],

  // Top products - TechVibe Electronics Best Sellers
  topProducts: [
    {
      id: 'TV-001',
      name: 'TechVibe Pro Wireless Headphones',
      revenue: 485000,
      units: 1940,
      growth: 28.5,
      category: 'Audio',
      price: 249.99,
      margin: 42.5,
      image: '/products/headphones.jpg',
    },
    {
      id: 'TV-002',
      name: 'SmartFit Health Tracker Pro',
      revenue: 398000,
      units: 1990,
      growth: 18.7,
      category: 'Wearables',
      price: 199.99,
      margin: 38.2,
      image: '/products/fitness-tracker.jpg',
    },
    {
      id: 'TV-003',
      name: 'UltraSound Bluetooth Speaker',
      revenue: 287500,
      units: 2300,
      growth: 15.2,
      category: 'Audio',
      price: 125.00,
      margin: 35.8,
      image: '/products/speaker.jpg',
    },
    {
      id: 'TV-004',
      name: 'PowerPad Wireless Charger',
      revenue: 176000,
      units: 2200,
      growth: 22.3,
      category: 'Accessories',
      price: 79.99,
      margin: 45.2,
      image: '/products/charger.jpg',
    },
    {
      id: 'TV-005',
      name: 'TechVibe Smart Watch Elite',
      revenue: 542000,
      units: 1355,
      growth: 32.1,
      category: 'Wearables',
      price: 399.99,
      margin: 40.8,
      image: '/products/smartwatch.jpg',
    },
    {
      id: 'TV-006',
      name: 'SilentPro Noise Cancelling Earbuds',
      revenue: 289000,
      units: 1445,
      growth: 25.8,
      category: 'Audio',
      price: 199.99,
      margin: 41.2,
      image: '/products/earbuds.jpg',
    },
    {
      id: 'TV-007',
      name: 'GameMaster Mechanical Keyboard',
      revenue: 256000,
      units: 1280,
      growth: 18.9,
      category: 'Gaming',
      price: 199.99,
      margin: 38.5,
      image: '/products/keyboard.jpg',
    },
    {
      id: 'TV-008',
      name: 'ClearVision 4K Webcam',
      revenue: 167500,
      units: 1115,
      growth: 29.4,
      category: 'Computing',
      price: 149.99,
      margin: 43.8,
      image: '/products/webcam.jpg',
    },
  ],

  // Customer segments - TechVibe Electronics Customer Analytics
  customerSegments: [
    {
      id: 'new-customers',
      name: 'New Customers',
      count: 23750,
      percentage: 28,
      revenue: 7980000,
      color: '#10B981',
      growth: 24.8,
      avgOrderValue: 336.00,
      description: 'First-time customers within last 30 days',
      icon: '🆕',
      acquisitionCost: 45.50,
      lifetimeValue: 1247.00,
      retentionRate: 68.5
    },
    {
      id: 'returning-customers',
      name: 'Returning Customers',
      count: 44060,
      percentage: 52,
      revenue: 16840000,
      color: '#06B6D4',
      growth: 12.3,
      avgOrderValue: 382.25,
      description: 'Customers with 2+ purchases',
      icon: '🔄',
      acquisitionCost: 28.75,
      lifetimeValue: 1856.00,
      retentionRate: 85.2
    },
    {
      id: 'vip-customers',
      name: 'VIP Customers',
      count: 8473,
      percentage: 10,
      revenue: 6780000,
      color: '#8B5CF6',
      growth: 18.7,
      avgOrderValue: 800.50,
      description: 'High-value customers (>$2000 lifetime)',
      icon: '👑',
      acquisitionCost: 125.00,
      lifetimeValue: 3420.00,
      retentionRate: 94.8
    },
    {
      id: 'at-risk',
      name: 'At Risk',
      count: 8473,
      percentage: 10,
      revenue: 1270000,
      color: '#F59E0B',
      growth: -8.5,
      avgOrderValue: 150.00,
      description: 'Customers with declining engagement',
      icon: '⚠️',
      acquisitionCost: 52.25,
      lifetimeValue: 485.00,
      retentionRate: 32.1
    },
  ],

  // Conversion funnel - TechVibe Electronics Customer Journey
  conversionFunnel: [
    {
      id: 'visitors',
      stage: 'Website Visitors',
      count: 261200,
      percentage: 100,
      color: '#8B5CF6',
      icon: '👥',
      description: 'Total unique monthly visitors',
      dropoffRate: 0,
      avgTimeSpent: '2m 45s'
    },
    {
      id: 'product-views',
      stage: 'Product Interest',
      count: 117540,
      percentage: 45.0,
      color: '#06B6D4',
      icon: '👁️',
      description: 'Viewed product details',
      dropoffRate: 55.0,
      avgTimeSpent: '4m 12s'
    },
    {
      id: 'add-to-cart',
      stage: 'Add to Cart',
      count: 62912,
      percentage: 24.1,
      color: '#10B981',
      icon: '🛒',
      description: 'Added items to shopping cart',
      dropoffRate: 46.5,
      avgTimeSpent: '6m 30s'
    },
    {
      id: 'checkout',
      stage: 'Checkout Started',
      count: 44404,
      percentage: 17.0,
      color: '#F59E0B',
      icon: '💳',
      description: 'Initiated checkout process',
      dropoffRate: 29.4,
      avgTimeSpent: '3m 45s'
    },
    {
      id: 'completed',
      stage: 'Order Completed',
      count: 8456,
      percentage: 3.24,
      color: '#059669',
      icon: '✅',
      description: 'Successfully completed purchase',
      dropoffRate: 80.9,
      avgTimeSpent: '8m 15s'
    },
  ],

  // Live activities - TechVibe Electronics Real-time Events
  liveActivities: [
    {
      id: 'LA-001',
      type: 'purchase',
      user: 'John D.',
      action: 'purchased TechVibe Pro Wireless Headphones',
      amount: 249.99,
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      location: 'Austin, TX',
      orderId: 'TV-ORD-2024-001',
      status: 'success'
    },
    {
      id: 'LA-002',
      type: 'signup',
      user: 'Sarah M.',
      action: 'created new customer account',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      location: 'Seattle, WA',
      status: 'success'
    },
    {
      id: 'LA-003',
      type: 'purchase',
      user: 'Mike R.',
      action: 'purchased SmartFit Health Tracker Pro',
      amount: 199.99,
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      location: 'Toronto, CA',
      orderId: 'TV-ORD-2024-002',
      status: 'success'
    },
    {
      id: 'LA-004',
      type: 'support',
      user: 'Emma L.',
      action: 'initiated chat support for product inquiry',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      location: 'London, UK',
      status: 'info'
    },
    {
      id: 'LA-005',
      type: 'purchase',
      user: 'David K.',
      action: 'purchased TechVibe Smart Watch Elite',
      amount: 399.99,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      location: 'Los Angeles, CA',
      orderId: 'TV-ORD-2024-003',
      status: 'success'
    },
    {
      id: 'LA-006',
      type: 'purchase',
      user: 'Lisa Chen',
      action: 'purchased GameMaster Mechanical Keyboard',
      amount: 199.99,
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      location: 'San Francisco, CA',
      orderId: 'TV-ORD-2024-004',
      status: 'success'
    },
  ],

  // System performance - TechVibe Electronics Infrastructure
  systemPerformance: {
    uptime: 99.97,
    responseTime: 185,
    errorRate: 0.008,
    activeConnections: 84732,
    throughput: '2.4K req/sec',
    cpuUsage: 23.5,
    memoryUsage: 67.2,
    diskUsage: 45.8,
    networkLatency: 12.3,
    lastUpdated: new Date()
  },

  // Data quality metrics - TechVibe Electronics Data Health
  dataQuality: {
    overall: 98.7,
    completeness: 99.4,
    accuracy: 98.2,
    consistency: 99.1,
    timeliness: 97.8,
    validity: 98.9,
    lastUpdated: new Date(),
    issues: [
      'Minor data sync delay in inventory system',
      '2 duplicate customer records identified'
    ],
    dataPoints: 2847392,
    recordsProcessed: 8456,
    syncStatus: 'healthy'
  }
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};