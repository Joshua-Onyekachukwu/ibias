import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock,
  Mail,
  FileText,
  Repeat,
  Users,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Info,
  AlertTriangle,
  FileBarChart2,
  FileSpreadsheet,
  FilePieChart
} from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleReportModal = ({ isOpen, onClose }) => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    format: 'pdf',
    recipients: [''],
    includeCharts: true,
    metrics: ['revenue', 'users', 'conversion'],
    customMessage: '',
    dateRange: '30d'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Report', icon: FilePieChart, description: 'Comprehensive report with charts and tables' },
    { value: 'excel', label: 'Excel Workbook', icon: FileSpreadsheet, description: 'Data in spreadsheet format with multiple tabs' },
    { value: 'csv', label: 'CSV Data', icon: FileBarChart2, description: 'Raw data in comma-separated values format' }
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: 'custom', label: 'Custom range' }
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

  const handleInputChange = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetricToggle = (metricId) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const toggleAllInCategory = (category, checked) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    
    if (checked) {
      // Add all metrics in this category that aren't already selected
      setReportConfig(prev => ({
        ...prev,
        metrics: [
          ...prev.metrics,
          ...categoryMetricIds.filter(id => !prev.metrics.includes(id))
        ]
      }));
    } else {
      // Remove all metrics in this category
      setReportConfig(prev => ({
        ...prev,
        metrics: prev.metrics.filter(id => !categoryMetricIds.includes(id))
      }));
    }
  };

  const isCategorySelected = (category) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    return categoryMetricIds.every(id => reportConfig.metrics.includes(id));
  };

  const isCategoryPartiallySelected = (category) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id);
    return categoryMetricIds.some(id => reportConfig.metrics.includes(id)) && 
           !categoryMetricIds.every(id => reportConfig.metrics.includes(id));
  };

  const addRecipient = () => {
    setReportConfig(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index, email) => {
    setReportConfig(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? email : recipient
      )
    }));
  };

  const removeRecipient = (index) => {
    setReportConfig(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!reportConfig.name.trim()) {
      toast.error('Please enter a report name');
      return;
    }

    const validRecipients = reportConfig.recipients.filter(email => 
      email.trim() && email.includes('@')
    );

    if (validRecipients.length === 0) {
      toast.error('Please add at least one valid email recipient');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In production, save to backend
      console.log('Scheduling report:', reportConfig);
      toast.success('Report scheduled successfully');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && !reportConfig.name.trim()) {
      toast.error('Please enter a report name');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Name
              </label>
              <input
                type="text"
                value={reportConfig.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Monthly Performance Report"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => handleInputChange('format', format.value)}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      reportConfig.format === format.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <format.icon className={`h-8 w-8 mb-2 ${
                      reportConfig.format === format.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className="text-sm font-medium text-center text-gray-900 dark:text-white">
                      {format.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {format.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={reportConfig.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {reportConfig.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={reportConfig.dayOfWeek}
                    onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {reportConfig.frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day of Month
                  </label>
                  <select
                    value={reportConfig.dayOfMonth || '1'}
                    onChange={(e) => handleInputChange('dayOfMonth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </option>
                    ))}
                    <option value="last">Last day of month</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={reportConfig.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range to Include
                </label>
                <select
                  value={reportConfig.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
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
                            checked={reportConfig.metrics.includes(metric.id)}
                            onChange={() => handleMetricToggle(metric.id)}
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
                {reportConfig.metrics.length} metrics selected
              </div>
            </div>

            {/* Additional Options */}
            {reportConfig.format === 'pdf' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Report Options
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeCharts}
                      onChange={(e) => handleInputChange('includeCharts', e.target.checked)}
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
                      Include executive summary
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={reportConfig.customMessage}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
                placeholder="Add a custom message to include in the report email..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Email Recipients
              </label>
              <div className="space-y-3">
                {reportConfig.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {reportConfig.recipients.length > 1 && (
                      <button
                        onClick={() => removeRecipient(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRecipient}
                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add recipient
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Report Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{reportConfig.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formats.find(f => f.value === reportConfig.format)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Frequency:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {frequencies.find(f => f.value === reportConfig.frequency)?.label}
                    {reportConfig.frequency === 'weekly' && ` (${daysOfWeek.find(d => d.value === reportConfig.dayOfWeek)?.label})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{reportConfig.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Metrics:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{reportConfig.metrics.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recipients:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {reportConfig.recipients.filter(r => r.trim()).length} email(s)
                  </span>
                </div>
              </div>
            </div>

            {/* First Report Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">First Report</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your first report will be generated and sent according to your selected schedule. 
                    You can also generate a one-time report immediately after saving this configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Schedule Automated Report
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Step {step} of {totalSteps}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
            <div 
              className="bg-blue-600 h-1 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>

          <div className="p-6">
            {renderStepContent()}
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : step === totalSteps ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Schedule Report
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleReportModal;