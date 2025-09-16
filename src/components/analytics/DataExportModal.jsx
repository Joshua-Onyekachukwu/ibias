import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  FileText, 
  Table, 
  BarChart3,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  Database,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const DataExportModal = ({ isOpen, onClose, data, title = "Export Analytics Data" }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'conversion']);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [fileName, setFileName] = useState('analytics_export');

  const exportFormats = [
    { 
      id: 'csv', 
      name: 'CSV', 
      icon: Table, 
      description: 'Comma-separated values for spreadsheets',
      fileExtension: '.csv'
    },
    { 
      id: 'excel', 
      name: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'Excel workbook with multiple sheets',
      fileExtension: '.xlsx'
    },
    { 
      id: 'pdf', 
      name: 'PDF Report', 
      icon: FilePieChart, 
      description: 'Formatted report with charts and tables',
      fileExtension: '.pdf'
    },
    { 
      id: 'json', 
      name: 'JSON', 
      icon: FileBarChart2, 
      description: 'Raw data in JSON format for developers',
      fileExtension: '.json'
    }
  ];

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', category: 'Financial' },
    { id: 'users', name: 'Users', category: 'Audience' },
    { id: 'conversion', name: 'Conversion Rate', category: 'Performance' },
    { id: 'sessions', name: 'Sessions', category: 'Audience' },
    { id: 'pageviews', name: 'Page Views', category: 'Audience' },
    { id: 'bounceRate', name: 'Bounce Rate', category: 'Performance' },
    { id: 'avgOrderValue', name: 'Avg Order Value', category: 'Financial' },
    { id: 'customerLifetimeValue', name: 'Customer LTV', category: 'Financial' },
    { id: 'churnRate', name: 'Churn Rate', category: 'Performance' },
    { id: 'trafficSources', name: 'Traffic Sources', category: 'Acquisition' },
    { id: 'deviceBreakdown', name: 'Device Breakdown', category: 'Technical' },
    { id: 'geographicData', name: 'Geographic Data', category: 'Audience' }
  ];

  // Group metrics by category
  const metricsByCategory = availableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {});

  const handleExport = async () => {
    if (selectedMetrics.length === 0) {
      toast.error('Please select at least one metric to export');
      return;
    }

    setExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        format: exportFormat,
        dateRange,
        metrics: selectedMetrics,
        includeCharts,
        fileName,
        timestamp: new Date().toISOString()
      };

      // In production, this would call your export API
      console.log('Exporting data:', exportData);
      
      const format = exportFormats.find(f => f.id === exportFormat);
      toast.success(`Successfully exported data as ${format.name}`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const toggleMetric = (metricId) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const toggleAllInCategory = (category, checked) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    
    if (checked) {
      // Add all metrics in this category that aren't already selected
      setSelectedMetrics(prev => [
        ...prev,
        ...categoryMetricIds.filter(id => !prev.includes(id))
      ]);
    } else {
      // Remove all metrics in this category
      setSelectedMetrics(prev => 
        prev.filter(id => !categoryMetricIds.includes(id))
      );
    }
  };

  const isCategorySelected = (category) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    return categoryMetricIds.every(id => selectedMetrics.includes(id));
  };

  const isCategoryPartiallySelected = (category) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    return categoryMetricIds.some(id => selectedMetrics.includes(id)) && 
           !categoryMetricIds.every(id => selectedMetrics.includes(id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* File Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Name
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="analytics_export"
                  />
                  <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-600 dark:text-gray-300">
                    {exportFormats.find(f => f.id === exportFormat)?.fileExtension || '.csv'}
                  </span>
                </div>
              </div>
              
              {/* Export Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id)}
                      className={`flex items-center p-4 border-2 rounded-lg transition-all ${
                        exportFormat === format.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <format.icon className={`h-6 w-6 mr-3 ${
                        exportFormat === format.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format.description}
                        </div>
                      </div>
                      {exportFormat === format.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 3 months</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
                
                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Metrics to Include
                </label>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {Object.entries(metricsByCategory).map(([category, metrics]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={isCategorySelected(category)}
                          ref={input => {
                            if (input) {
                              input.indeterminate = isCategoryPartiallySelected(category);
                            }
                          }}
                          onChange={(e) => toggleAllInCategory(category, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {category}
                        </label>
                      </div>
                      <div className="ml-6 grid grid-cols-2 gap-2">
                        {metrics.map((metric) => (
                          <label key={metric.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.includes(metric.id)}
                              onChange={() => toggleMetric(metric.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {metric.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedMetrics.length} metrics selected
                </div>
              </div>

              {/* Additional Options */}
              {(exportFormat === 'pdf' || exportFormat === 'excel') && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Additional Options
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include charts and visualizations
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include summary statistics
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Add table of contents
                      </span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Data Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Data Security</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your exported data is encrypted and will be automatically deleted from our servers after 7 days. 
                      Please ensure you handle this data in accordance with your organization's data policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              Last export: {typeof window !== 'undefined' ? new Date().toLocaleDateString() : '--/--/----'}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleExport}
                disabled={exporting || selectedMetrics.length === 0}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DataExportModal;