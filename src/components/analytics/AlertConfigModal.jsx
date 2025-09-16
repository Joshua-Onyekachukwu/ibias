import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, TrendingUp, TrendingDown, Target, DollarSign, Users, Activity, Mail, Smartphone, Save, Info, CheckCircle, ToggleLeft as Toggle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AlertConfigModal = ({ isOpen, onClose, currentThresholds, onSave }) => {
  const [thresholds, setThresholds] = useState(currentThresholds || {});
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const alertMetrics = [
    {
      id: 'revenue',
      name: 'Revenue',
      icon: DollarSign,
      unit: '$',
      description: 'Monitor revenue performance',
      color: 'green',
      defaultMin: 100000,
      defaultMax: 200000
    },
    {
      id: 'conversion',
      name: 'Conversion Rate',
      icon: Target,
      unit: '%',
      description: 'Track conversion rate changes',
      color: 'blue',
      defaultMin: 2.5,
      defaultMax: 5.0
    },
    {
      id: 'churn',
      name: 'Churn Rate',
      icon: TrendingDown,
      unit: '%',
      description: 'Monitor customer churn',
      color: 'red',
      defaultMin: 0,
      defaultMax: 8.0
    },
    {
      id: 'traffic',
      name: 'Website Traffic',
      icon: Activity,
      unit: '',
      description: 'Track visitor volume',
      color: 'purple',
      defaultMin: 10000,
      defaultMax: 50000
    },
    {
      id: 'users',
      name: 'Active Users',
      icon: Users,
      unit: '',
      description: 'Monitor user engagement',
      color: 'indigo',
      defaultMin: 5000,
      defaultMax: 20000
    }
  ];

  const handleThresholdChange = (metricId, type, value) => {
    setThresholds(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleEnabledChange = (metricId, enabled) => {
    setThresholds(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        enabled
      }
    }));
  };

  const handleResetDefaults = (metricId) => {
    const metric = alertMetrics.find(m => m.id === metricId);
    if (metric) {
      setThresholds(prev => ({
        ...prev,
        [metricId]: {
          min: metric.defaultMin,
          max: metric.defaultMax,
          enabled: true
        }
      }));
      toast.success(`Reset ${metric.name} to default thresholds`);
    }
  };

  const handleSave = () => {
    onSave(thresholds, notifications);
    toast.success('Alert settings saved successfully');
    onClose();
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800',
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      red: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Configure Alert Thresholds
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up alerts for important metrics to stay informed
                </p>
              </div>
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
              {/* Alert Metrics Configuration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Metric Thresholds
                  </h4>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {showAdvanced ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                  </button>
                </div>
                
                <div className="space-y-5">
                  {alertMetrics.map((metric) => {
                    const threshold = thresholds[metric.id] || { min: metric.defaultMin, max: metric.defaultMax, enabled: false };
                    
                    return (
                      <div key={metric.id} className={`p-5 border rounded-xl transition-all duration-300 ${
                        threshold.enabled 
                          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getColorClasses(metric.color)} mr-3`}>
                              <metric.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {metric.name}
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {metric.description}
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={threshold.enabled}
                              onChange={(e) => handleEnabledChange(metric.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        {threshold.enabled && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Minimum Threshold
                                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                    (Alert when below)
                                  </span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={threshold.min}
                                    onChange={(e) => handleThresholdChange(metric.id, 'min', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="0"
                                  />
                                  {metric.unit && (
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                      {metric.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Maximum Threshold
                                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                    (Alert when above)
                                  </span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={threshold.max}
                                    onChange={(e) => handleThresholdChange(metric.id, 'max', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="100"
                                  />
                                  {metric.unit && (
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                      {metric.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {showAdvanced && (
                              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Advanced settings
                                  </div>
                                  <button
                                    onClick={() => handleResetDefaults(metric.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                  >
                                    Reset to defaults
                                  </button>
                                </div>
                                
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Alert Frequency
                                    </label>
                                    <select
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                      <option value="immediate">Immediate</option>
                                      <option value="hourly">Hourly (Max 1/hour)</option>
                                      <option value="daily">Daily Summary</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Alert Priority
                                    </label>
                                    <select
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                      <option value="high">High</option>
                                      <option value="medium">Medium</option>
                                      <option value="low">Low</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Preferences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Email notifications
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Push notifications
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            SMS notifications
                          </span>
                          <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                            Pro
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Alert Preview */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h5 className="font-medium text-blue-900 dark:text-blue-300">
                    How Alerts Work
                  </h5>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  You'll receive notifications when any enabled metric falls outside its configured thresholds. 
                  Alerts are checked every 15 minutes and will only trigger once per hour to avoid spam.
                </p>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg mr-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Alert Example
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Conversion rate has dropped below 2.5% (currently 2.1%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertConfigModal;