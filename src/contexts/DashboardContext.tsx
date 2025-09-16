'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Memoize utility function
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Type definitions
interface KPI {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface KPIs {
  revenue: KPI;
  customers: KPI;
  conversionRate: KPI;
  churnRate: KPI;
}

interface Widget {
  id: string;
  type: 'chart' | 'analytics' | 'forecast' | 'insights';
  title: string;
  position: {
    x: number;
    y: number;
  };
}

interface Activity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  [key: string]: any;
}

interface Notification {
  id: number;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read?: boolean;
}

interface DashboardData {
  kpis: KPIs;
  recentActivity: Activity[];
  notifications: Notification[];
  widgets: Widget[];
  liveData?: LiveData;
  lastUpdated?: string;
}

interface LiveData {
  revenue: number;
  customers: number;
  conversionRate: number;
  churnRate: number;
  orders: number;
  activeUsers: number;
  avgOrderValue: number;
  customerLifetimeValue: number;
  lastUpdated: string;
}

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
}

interface DashboardContextType {
  dashboardData: DashboardData;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData>>;
  liveData: LiveData;
  updateLiveData: (updates: Partial<LiveData>) => void;
  integrations: Integration[];
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  connectIntegration: (integrationId: string) => Promise<boolean>;
  disconnectIntegration: (integrationId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  updateDashboardData: (updates: Partial<DashboardData>) => Promise<void>;
  getKPIData: (kpiId: keyof KPIs) => KPI | null;
}

interface DashboardProviderProps {
  children: ReactNode;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const supabase = createClient();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    kpis: {
      revenue: { value: 125000, change: 12, trend: 'up' },
      customers: { value: 2847, change: 8, trend: 'up' },
      conversionRate: { value: 3.2, change: -2, trend: 'down' },
      churnRate: { value: 5.8, change: -1, trend: 'down' }
    },
    recentActivity: [],
    notifications: [],
    widgets: [
      { id: 'revenue-chart', type: 'chart', title: 'Revenue Overview', position: { x: 0, y: 0 } },
      { id: 'customer-analytics', type: 'analytics', title: 'Customer Analytics', position: { x: 1, y: 0 } },
      { id: 'sales-forecast', type: 'forecast', title: 'Sales Forecast', position: { x: 0, y: 1 } },
      { id: 'ai-insights', type: 'insights', title: 'AI Recommendations', position: { x: 1, y: 1 } }
    ]
  });

  const [liveData, setLiveData] = useState<LiveData>(() => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('ibias_live_data');
        if (savedData) {
          return JSON.parse(savedData) as LiveData;
        }
      } catch (e) {
        console.error('Error parsing saved live data:', e);
      }
    }
    
    // Default values if no saved data or on server side
    return {
      revenue: 125000,
      customers: 2847,
      conversionRate: 3.2,
      churnRate: 5.8,
      orders: 1234,
      activeUsers: 456,
      avgOrderValue: 90,
      customerLifetimeValue: 248,
      lastUpdated: new Date().toISOString()
    };
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'shopify', name: 'Shopify', status: 'disconnected', lastSync: null },
    { id: 'google-analytics', name: 'Google Analytics', status: 'disconnected', lastSync: null },
    { id: 'hubspot', name: 'HubSpot', status: 'disconnected', lastSync: null }
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Save liveData to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ibias_live_data', JSON.stringify({
        ...liveData,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [liveData]);

  // Load integrations from Supabase
  useEffect(() => {
    const loadIntegrations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error loading integrations:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const userIntegrations = data.map(integration => ({
            id: integration.integration_id,
            name: integration.integration_name,
            status: integration.status,
            lastSync: integration.last_sync
          }));
          setIntegrations(userIntegrations);
        }
      } catch (error) {
        console.error('Error loading integrations:', error);
      }
    };
    
    loadIntegrations();
  }, [user, supabase]);

  // Simulate realistic data changes with proper trends - but less frequently
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        // Calculate realistic changes based on current trends
        const revenueChange = Math.floor(prev.revenue * (Math.random() * 0.01 - 0.005)); // -0.5% to +0.5%
        const customerChange = Math.floor(Math.random() * 10) - 3; // -3 to +7
        const conversionChange = Math.round((Math.random() - 0.48) * 0.1 * 10) / 10; // Slight downward trend, rounded to 1 decimal
        const churnChange = Math.round((Math.random() - 0.52) * 0.1 * 10) / 10; // Slight downward trend, rounded to 1 decimal
        const orderChange = Math.floor(Math.random() * 5) - 1; // -1 to +4
        const userChange = Math.floor(Math.random() * 15) - 5; // -5 to +10
        
        // Ensure values stay within realistic ranges and use whole numbers for currency
        const newRevenue = Math.max(100000, Math.round(prev.revenue + revenueChange));
        const newCustomers = Math.max(2000, prev.customers + customerChange);
        const newConversion = Math.max(0.5, Math.min(8, Math.round(prev.conversionRate + conversionChange * 10) / 10));
        const newChurn = Math.max(0.1, Math.min(15, Math.round(prev.churnRate + churnChange * 10) / 10));
        const newOrders = Math.max(1000, prev.orders + orderChange);
        const newUsers = Math.max(300, prev.activeUsers + userChange);
        
        // Calculate derived metrics
        const newAvgOrderValue = Math.round(newRevenue / newOrders);
        const newLifetimeValue = Math.round((newRevenue / newCustomers) * (1 / (newChurn / 100)));
        
        return {
          revenue: newRevenue,
          customers: newCustomers,
          conversionRate: newConversion,
          churnRate: newChurn,
          orders: newOrders,
          activeUsers: newUsers,
          avgOrderValue: newAvgOrderValue,
          customerLifetimeValue: newLifetimeValue,
          lastUpdated: new Date().toISOString()
        };
      });
    }, 60000); // Update every 60 seconds instead of 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch dashboard data from Supabase
  const fetchDashboardData = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch dashboard data from Supabase
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('user_dashboards')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (dashboardError && dashboardError.code !== 'PGRST116') {
        throw dashboardError;
      }
      
      if (dashboardData) {
        setDashboardData(prev => ({
          ...prev,
          kpis: dashboardData.kpis || prev.kpis,
          widgets: dashboardData.widgets || prev.widgets,
          recentActivity: dashboardData.recent_activity || [],
          notifications: dashboardData.notifications || [],
          lastUpdated: dashboardData.updated_at
        }));
        
        // If there's live data, update that too
        if (dashboardData.live_data) {
          setLiveData(prev => ({
            ...prev,
            ...dashboardData.live_data,
            lastUpdated: dashboardData.live_data.lastUpdated || new Date().toISOString()
          }));
        }
      } else {
        // If no data exists, create default dashboard
        const defaultData = {
          user_id: user.id,
          kpis: {
            revenue: { value: 125000, change: 12, trend: 'up' as const },
            customers: { value: 2847, change: 8, trend: 'up' as const },
            conversionRate: { value: 3.2, change: -2, trend: 'down' as const },
            churnRate: { value: 5.8, change: -1, trend: 'down' as const }
          },
          widgets: [
            { id: 'revenue-chart', type: 'chart' as const, title: 'Revenue Overview', position: { x: 0, y: 0 } },
            { id: 'customer-analytics', type: 'analytics' as const, title: 'Customer Analytics', position: { x: 1, y: 0 } },
            { id: 'sales-forecast', type: 'forecast' as const, title: 'Sales Forecast', position: { x: 0, y: 1 } },
            { id: 'ai-insights', type: 'insights' as const, title: 'AI Recommendations', position: { x: 1, y: 1 } }
          ],
          recent_activity: [],
          notifications: [],
          live_data: { ...liveData }
        };
        
        const { error: createError } = await supabase
          .from('user_dashboards')
          .insert([defaultData]);
        
        if (createError) {
          console.error('Error creating default dashboard:', createError);
          toast.error('Unable to create dashboard data.');
        } else {
          setDashboardData(prev => ({
            ...prev,
            kpis: defaultData.kpis,
            widgets: defaultData.widgets,
            recentActivity: defaultData.recent_activity,
            notifications: defaultData.notifications
          }));
        }
      }
      
      // Fetch recent activity from Supabase
      try {
        const { data: activities, error: activityError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (activityError) {
          console.log('No activity data found:', activityError);
        } else if (activities) {
          const formattedActivities: Activity[] = activities.map(activity => ({
            id: activity.id,
            type: activity.type,
            description: activity.message || activity.description || 'No description available',
            timestamp: activity.created_at,
            metadata: activity.metadata
          }));
          
          setDashboardData(prev => ({
            ...prev,
            recentActivity: formattedActivities
          }));
        }
      } catch (activityError) {
        console.log('No activity data found, using defaults');
      }
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user, liveData, supabase]);

  // Load dashboard data when user changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Update dashboard data in Supabase
  const updateDashboardData = useCallback(async (updates: Partial<DashboardData>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update local state first
      setDashboardData(prev => {
        const newData = { 
          ...prev, 
          ...updates,
          lastUpdated: new Date().toISOString()
        };
        
        return newData;
      });
      
      // Update Supabase
      const { error } = await supabase
        .from('user_dashboards')
        .upsert({
          user_id: user.id,
          kpis: updates.kpis,
          widgets: updates.widgets,
          recent_activity: updates.recentActivity,
          notifications: updates.notifications,
          live_data: liveData,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating dashboard data:', error);
        toast.error('Failed to update dashboard data');
      }
      
    } catch (error: any) {
      console.error('Error updating dashboard data:', error);
      setError('Failed to update dashboard data');
      toast.error('Failed to update dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user, liveData, supabase]);

  // Update live data
  const updateLiveData = useCallback((updates: Partial<LiveData>): void => {
    setLiveData(prev => {
      const updated = { ...prev, ...updates, lastUpdated: new Date().toISOString() };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ibias_live_data', JSON.stringify(updated));
      }
      
      // If user is logged in, also update in Supabase
      if (user) {
        supabase
          .from('user_dashboards')
          .upsert({
            user_id: user.id,
            live_data: updated,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error updating live data in Supabase:', error);
            }
          });
      }
      
      return updated;
    });
  }, [user, supabase]);

  // Memoized widget update function
  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>): void => {
    setDashboardData(prev => {
      const updatedWidgets = prev.widgets.map(widget => 
        widget.id === widgetId ? { ...widget, ...updates } : widget
      );
      
      const newData = {
        ...prev,
        widgets: updatedWidgets,
        lastUpdated: new Date().toISOString()
      };
      
      // If user is logged in, also update in Supabase
      if (user) {
        supabase
          .from('user_dashboards')
          .upsert({
            user_id: user.id,
            widgets: updatedWidgets,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error updating widgets in Supabase:', error);
            }
          });
      }
      
      return newData;
    });
  }, [user, supabase]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): void => {
    const newNotification: Notification = { 
      id: Date.now(), 
      timestamp: new Date().toISOString(), 
      ...notification 
    };
    
    setDashboardData(prev => {
      const updatedNotifications = [
        newNotification,
        ...prev.notifications.slice(0, 9)
      ];
      
      // If user is logged in, also update in Supabase
      if (user) {
        // Add to notifications table
        supabase
          .from('user_notifications')
          .insert({
            user_id: user.id,
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            read: newNotification.read || false,
            created_at: newNotification.timestamp
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error adding notification to Supabase:', error);
            }
          });
        
        // Update dashboard data
        supabase
          .from('user_dashboards')
          .upsert({
            user_id: user.id,
            notifications: updatedNotifications,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error updating notifications in Supabase:', error);
            }
          });
      }
      
      return {
        ...prev,
        notifications: updatedNotifications
      };
    });
  }, [user, supabase]);

  // Connect integration
  const connectIntegration = useCallback(async (integrationId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newIntegrations = integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'connected' as const, lastSync: new Date().toISOString() }
          : integration
      );
      
      // If the integration doesn't exist in the array, add it
      if (!newIntegrations.find(i => i.id === integrationId)) {
        newIntegrations.push({
          id: integrationId,
          name: integrationId.charAt(0).toUpperCase() + integrationId.slice(1),
          status: 'connected',
          lastSync: new Date().toISOString()
        });
      }
      
      setIntegrations(newIntegrations);
      
      // Update in Supabase
      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: user.id,
          integration_id: integrationId,
          integration_name: integrationId.charAt(0).toUpperCase() + integrationId.slice(1),
          status: 'connected',
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error connecting integration:', error);
        toast.error('Failed to connect integration');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error connecting integration:', error);
      toast.error('Failed to connect integration');
      return false;
    }
  }, [user, integrations, supabase]);

  // Disconnect integration
  const disconnectIntegration = useCallback(async (integrationId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newIntegrations = integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' as const, lastSync: null }
          : integration
      );
      
      setIntegrations(newIntegrations);
      
      // Update in Supabase
      const { error } = await supabase
        .from('user_integrations')
        .update({
          status: 'disconnected',
          last_sync: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('integration_id', integrationId);
      
      if (error) {
        console.error('Error disconnecting integration:', error);
        toast.error('Failed to disconnect integration');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      toast.error('Failed to disconnect integration');
      return false;
    }
  }, [user, integrations, supabase]);

  // Get KPI data (memoized)
  const getKPIData = memoize((kpiId: keyof KPIs): KPI | null => {
    return dashboardData.kpis[kpiId] || null;
  });

  const value: DashboardContextType = {
    dashboardData,
    setDashboardData,
    liveData,
    updateLiveData,
    integrations,
    updateWidget,
    addNotification,
    connectIntegration,
    disconnectIntegration,
    isLoading,
    error,
    fetchDashboardData,
    updateDashboardData,
    getKPIData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;