'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  BarChart3,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Palette,
  Info,
  Clock,
  ArrowRight,
  Grid3X3,
  Zap as ScatterIcon,
  TreePine,
  Radar as RadarIcon
} from 'lucide-react';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

// TypeScript interfaces
interface ChartType {
  id: 'heatmap' | 'scatter' | 'treemap' | 'radar';
  name: string;
  icon: React.ComponentType<any>;
}

interface Dimension {
  id: 'time' | 'geography' | 'channel' | 'device';
  name: string;
}

interface Metric {
  id: 'revenue' | 'customers' | 'conversionRate' | 'churnRate';
  name: string;
}

interface ColorScheme {
  id: string;
  name: string;
  scale: (t: number) => string;
}

interface ScatterDataPoint {
  x: number;
  y: number;
  z: number;
  category?: string;
}

interface TreemapDataPoint {
  name: string;
  size: number;
  children?: TreemapDataPoint[];
}

interface RadarDataPoint {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
}

interface EnhancedDataVisualizationProps {
  className?: string;
  dashboardData?: any;
  liveData?: any;
}

interface CustomTreemapContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  name?: string;
  value?: number;
  colorScale: (t: number) => string;
}

const EnhancedDataVisualization: React.FC<EnhancedDataVisualizationProps> = ({
  className = '',
  dashboardData,
  liveData
}) => {
  // State management
  const [selectedChart, setSelectedChart] = useState<'heatmap' | 'scatter' | 'treemap' | 'radar'>('heatmap');
  const [selectedDimension, setSelectedDimension] = useState<'time' | 'geography' | 'channel' | 'device'>('time');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'customers' | 'conversionRate' | 'churnRate'>('revenue');
  const [colorScheme, setColorScheme] = useState<string>('blues');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const heatmapRef = useRef<HTMLDivElement>(null);

  // Configuration arrays
  const chartTypes: ChartType[] = [
    { id: 'heatmap', name: 'Heatmap', icon: Grid3X3 },
    { id: 'scatter', name: 'Scatter Plot', icon: ScatterIcon },
    { id: 'treemap', name: 'Treemap', icon: TreePine },
    { id: 'radar', name: 'Radar Chart', icon: RadarIcon }
  ];

  const dimensions: Dimension[] = [
    { id: 'time', name: 'Time' },
    { id: 'geography', name: 'Geography' },
    { id: 'channel', name: 'Channel' },
    { id: 'device', name: 'Device' }
  ];

  const metrics: Metric[] = [
    { id: 'revenue', name: 'Revenue' },
    { id: 'customers', name: 'Customers' },
    { id: 'conversionRate', name: 'Conversion Rate' },
    { id: 'churnRate', name: 'Churn Rate' }
  ];

  const colorSchemes: ColorScheme[] = [
    { id: 'blues', name: 'Blues', scale: d3ScaleChromatic.interpolateBlues },
    { id: 'greens', name: 'Greens', scale: d3ScaleChromatic.interpolateGreens },
    { id: 'reds', name: 'Reds', scale: d3ScaleChromatic.interpolateReds },
    { id: 'oranges', name: 'Oranges', scale: d3ScaleChromatic.interpolateOranges },
    { id: 'purples', name: 'Purples', scale: d3ScaleChromatic.interpolatePurples },
    { id: 'viridis', name: 'Viridis', scale: d3ScaleChromatic.interpolateViridis },
    { id: 'plasma', name: 'Plasma', scale: d3ScaleChromatic.interpolatePlasma },
    { id: 'turbo', name: 'Turbo', scale: d3ScaleChromatic.interpolateTurbo }
  ];

  // Generate data based on selected chart type
  const generateData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let data: any[] = [];
      
      switch (selectedChart) {
        case 'heatmap':
          data = generateHeatmapData();
          break;
        case 'scatter':
          data = generateScatterData();
          break;
        case 'treemap':
          data = generateTreemapData();
          break;
        case 'radar':
          data = generateRadarData();
          break;
        default:
          data = [];
      }
      
      setVisualizationData(data);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Generate heatmap data
  const generateHeatmapData = (): HeatmapDataPoint[] => {
    const data: HeatmapDataPoint[] = [];
    
    if (selectedDimension === 'time') {
      // Time-based heatmap (day of week vs hour of day)
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const baseValue = Math.random() * 100;
          const timeMultiplier = hour >= 9 && hour <= 17 ? 1.5 : 0.7; // Business hours boost
          const weekendMultiplier = day === 0 || day === 6 ? 0.8 : 1.2; // Weekend reduction
          
          data.push({
            x: hour,
            y: day,
            value: baseValue * timeMultiplier * weekendMultiplier
          });
        }
      }
    } else if (selectedDimension === 'geography') {
      // Geography-based heatmap (region vs country)
      const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
      const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'China', 'Japan', 'Brazil', 'Australia'];
      
      regions.forEach((region, regionIndex) => {
        countries.forEach((country, countryIndex) => {
          const baseValue = Math.random() * 100;
          const regionMultiplier = regionIndex < 3 ? 1.3 : 0.9; // Favor first 3 regions
          
          data.push({
            x: countryIndex,
            y: regionIndex,
            value: baseValue * regionMultiplier
          });
        });
      });
    } else if (selectedDimension === 'channel') {
      // Channel-based heatmap (channel vs campaign type)
      const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'];
      const campaigns = ['Brand', 'Product', 'Promotional', 'Seasonal', 'Retargeting'];
      
      channels.forEach((channel, channelIndex) => {
        campaigns.forEach((campaign, campaignIndex) => {
          const baseValue = Math.random() * 100;
          const channelMultiplier = channelIndex < 2 ? 1.4 : 1.0; // Favor search channels
          
          data.push({
            x: campaignIndex,
            y: channelIndex,
            value: baseValue * channelMultiplier
          });
        });
      });
    } else if (selectedDimension === 'device') {
      // Device-based heatmap (device vs browser)
      const devices = ['Desktop', 'Mobile', 'Tablet'];
      const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
      
      devices.forEach((device, deviceIndex) => {
        browsers.forEach((browser, browserIndex) => {
          const baseValue = Math.random() * 100;
          const deviceMultiplier = deviceIndex === 0 ? 1.3 : deviceIndex === 1 ? 1.1 : 0.9;
          const browserMultiplier = browserIndex === 0 ? 1.2 : 1.0;
          
          data.push({
            x: browserIndex,
            y: deviceIndex,
            value: baseValue * deviceMultiplier * browserMultiplier
          });
        });
      });
    }
    
    return data;
  };

  // Generate scatter plot data
  const generateScatterData = (): ScatterDataPoint[] => {
    const data: ScatterDataPoint[] = [];
    const numPoints = 50;
    
    for (let i = 0; i < numPoints; i++) {
      let x: number, y: number, z: number;
      
      if (selectedDimension === 'time') {
        x = Math.random() * 24; // Hour of day
        y = 50 + Math.random() * 100; // Base metric value
        z = 20 + Math.random() * 80; // Size factor
        
        // Add business hours pattern
        if (x >= 9 && x <= 17) {
          y *= 1.3;
          z *= 1.2;
        }
      } else if (selectedDimension === 'geography') {
        x = Math.random() * 10; // Geographic index
        y = 30 + Math.random() * 120;
        z = 15 + Math.random() * 85;
        
        // Regional variations
        if (x < 3) y *= 1.4; // North America/Europe boost
      } else if (selectedDimension === 'channel') {
        x = Math.random() * 6; // Channel index
        y = 40 + Math.random() * 110;
        z = 25 + Math.random() * 75;
        
        // Channel performance variations
        if (x < 2) y *= 1.3; // Search channels
      } else {
        x = Math.random() * 3; // Device index
        y = 35 + Math.random() * 115;
        z = 20 + Math.random() * 80;
        
        // Device performance variations
        if (x < 1) y *= 1.25; // Desktop boost
      }
      
      // Adjust based on selected metric
      if (selectedMetric === 'revenue') {
        y *= 1.5;
        z *= 1.2;
      } else if (selectedMetric === 'conversionRate') {
        y *= 0.2;
        z *= 0.8;
      } else if (selectedMetric === 'churnRate') {
        y = 100 - y * 0.5;
      }
      
      data.push({ x, y, z });
    }
    
    return data;
  };

  // Generate treemap data
  const generateTreemapData = (): TreemapDataPoint[] => {
    let data: TreemapDataPoint[] = [];
    
    if (selectedDimension === 'geography') {
      data = [
        {
          name: 'North America',
          size: 0,
          children: [
            { name: 'USA', size: 1200 + Math.random() * 800 },
            { name: 'Canada', size: 600 + Math.random() * 400 },
            { name: 'Mexico', size: 400 + Math.random() * 300 }
          ]
        },
        {
          name: 'Europe',
          size: 0,
          children: [
            { name: 'UK', size: 800 + Math.random() * 500 },
            { name: 'Germany', size: 700 + Math.random() * 400 },
            { name: 'France', size: 600 + Math.random() * 300 },
            { name: 'Italy', size: 500 + Math.random() * 300 },
            { name: 'Spain', size: 400 + Math.random() * 200 }
          ]
        },
        {
          name: 'Asia',
          size: 0,
          children: [
            { name: 'China', size: 1000 + Math.random() * 600 },
            { name: 'Japan', size: 800 + Math.random() * 500 },
            { name: 'India', size: 700 + Math.random() * 400 },
            { name: 'South Korea', size: 500 + Math.random() * 300 }
          ]
        }
      ];
    } else if (selectedDimension === 'channel') {
      data = [
        {
          name: 'Organic',
          size: 0,
          children: [
            { name: 'Search', size: 1000 + Math.random() * 500 },
            { name: 'Direct', size: 800 + Math.random() * 400 }
          ]
        },
        {
          name: 'Paid',
          size: 0,
          children: [
            { name: 'Search Ads', size: 900 + Math.random() * 600 },
            { name: 'Display Ads', size: 700 + Math.random() * 400 },
            { name: 'Social Ads', size: 800 + Math.random() * 500 }
          ]
        }
      ];
    } else {
      data = [
        {
          name: 'Q1',
          size: 0,
          children: [
            { name: 'January', size: 800 + Math.random() * 400 },
            { name: 'February', size: 700 + Math.random() * 350 },
            { name: 'March', size: 900 + Math.random() * 450 }
          ]
        }
      ];
    }
    
    // Calculate parent sizes and apply metric adjustments
    return data.map(category => ({
      ...category,
      size: category.children ? category.children.reduce((sum, child) => sum + child.size, 0) : 0,
      children: category.children?.map(item => ({
        ...item,
        size: selectedMetric === 'revenue' ? item.size * 1.5 :
              selectedMetric === 'conversionRate' ? item.size * 0.2 :
              selectedMetric === 'churnRate' ? 2000 - item.size * 0.5 :
              item.size
      }))
    }));
  };

  // Generate radar chart data
  const generateRadarData = (): RadarDataPoint[] => {
    let subjects: string[] = [];
    
    if (selectedDimension === 'geography') {
      subjects = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
    } else if (selectedDimension === 'channel') {
      subjects = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'];
    } else if (selectedDimension === 'device') {
      subjects = ['Desktop', 'Mobile', 'Tablet'];
    } else {
      subjects = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    
    return subjects.map(subject => {
      let A = 120 + Math.random() * 30;
      let B = 110 + Math.random() * 20;
      let fullMark = 150;
      
      if (selectedMetric === 'revenue') {
        A *= 1.5;
        B *= 1.5;
        fullMark = 225;
      } else if (selectedMetric === 'conversionRate') {
        A *= 0.2;
        B *= 0.2;
        fullMark = 30;
      } else if (selectedMetric === 'churnRate') {
        A = 150 - A * 0.5;
        B = 150 - B * 0.5;
      }
      
      return { subject, A, B, fullMark };
    });
  };

  // Format value based on metric
  const formatValue = (value: number, metric: string): string => {
    if (metric === 'revenue') return `$${value.toLocaleString()}`;
    if (metric === 'conversionRate' || metric === 'churnRate') return `${value}%`;
    return value.toLocaleString();
  };

  // Get color for selected metric
  const getMetricColor = (): string => {
    const colorSchemeObj = colorSchemes.find(scheme => scheme.id === colorScheme);
    return colorSchemeObj ? colorSchemeObj.scale(0.7) : '#3B82F6';
  };

  // Get color scale for treemap
  const getColorScale = () => {
    const colorSchemeObj = colorSchemes.find(scheme => scheme.id === colorScheme);
    return colorSchemeObj ? colorSchemeObj.scale : d3ScaleChromatic.interpolateBlues;
  };

  // Handle refresh button click
  const handleRefresh = () => {
    generateData();
  };

  // Generate data on component mount and when dependencies change
  useEffect(() => {
    generateData();
  }, [selectedChart, selectedDimension, selectedMetric]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Enhanced Visualization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced data exploration
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Generating visualization...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enhanced Visualization
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced data exploration
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh visualization"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={showLegend ? "Hide legend" : "Show legend"}
          >
            {showLegend ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Chart type selector */}
        <div className="flex flex-wrap items-center gap-2">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedChart === chart.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <chart.icon className="h-4 w-4 mr-1" />
              {chart.name}
            </button>
          ))}
        </div>
        
        {/* Dimension selector */}
        <select
          value={selectedDimension}
          onChange={(e) => setSelectedDimension(e.target.value as 'time' | 'geography' | 'channel' | 'device')}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {dimensions.map(dimension => (
            <option key={dimension.id} value={dimension.id}>
              By {dimension.name}
            </option>
          ))}
        </select>
        
        {/* Metric selector */}
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as 'revenue' | 'customers' | 'conversionRate' | 'churnRate')}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {metrics.map(metric => (
            <option key={metric.id} value={metric.id}>
              {metric.name}
            </option>
          ))}
        </select>
        
        {/* Color scheme selector */}
        <div className="ml-auto flex items-center">
          <Palette className="h-4 w-4 mr-2 text-gray-400" />
          <select
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {colorSchemes.map(scheme => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Visualization container */}
      <div className={expanded ? 'h-96' : 'h-72'}>
        {selectedChart === 'heatmap' && (
          <div 
            ref={heatmapRef} 
            className="w-full h-full relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
          >
            {/* Heatmap placeholder - would integrate with heatmap.js */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Heatmap visualization</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {selectedDimension} × {selectedMetric}
                </p>
              </div>
            </div>
            
            {/* Legend */}
            {showLegend && (
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {metrics.find(m => m.id === selectedMetric)?.name} Intensity
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-3 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded"></div>
                  <div className="flex justify-between w-24 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {selectedChart === 'scatter' && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={selectedDimension === 'time' ? 'Hour' : 'Value'} 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={metrics.find(m => m.id === selectedMetric)?.name} 
                stroke="#6B7280"
                fontSize={12}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Size" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Scatter 
                name={metrics.find(m => m.id === selectedMetric)?.name} 
                data={visualizationData} 
                fill={getMetricColor()}
              />
              {showLegend && <Legend />}
            </ScatterChart>
          </ResponsiveContainer>
        )}
        
        {selectedChart === 'treemap' && (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={visualizationData}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedTreemapContent colorScale={getColorScale()} />}
            >
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        )}
        
        {selectedChart === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={visualizationData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar 
                name="Current Period" 
                dataKey="A" 
                stroke={getMetricColor()} 
                fill={getMetricColor()} 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Previous Period" 
                dataKey="B" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Visualization insights */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Visualization Insights
          </h4>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            • {selectedChart === 'heatmap' ? 'Heat intensity reveals patterns across dimensions' :
               selectedChart === 'scatter' ? 'Data points show correlations and outliers' :
               selectedChart === 'treemap' ? 'Hierarchical structure shows relative importance' :
               'Multi-dimensional comparison across categories'}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            • Current visualization focuses on {metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()} by {dimensions.find(d => d.id === selectedDimension)?.name.toLowerCase()}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            Export visualization
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Treemap content component
const CustomizedTreemapContent: React.FC<CustomTreemapContentProps> = (props) => {
  const { root, depth = 0, x = 0, y = 0, width = 0, height = 0, index = 0, name = '', colorScale } = props;
  
  const color = depth < 2 
    ? colorScale(index / (root?.children?.length || 1) * 0.8 + 0.2) 
    : colorScale(index / (root?.children?.length || 1) * 0.5 + 0.5);
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth < 2 && width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight={depth === 0 ? 'bold' : 'normal'}
        >
          {name}
        </text>
      )}
    </g>
  );
};

export default EnhancedDataVisualization;