import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

const StockAlertCard = ({ alerts, isDarkMode = false }) => {
  const getPriorityColor = (priority) => {
    if (isDarkMode) {
      switch (priority) {
        case 'high':
          return 'text-red-400 bg-red-900/20 border-red-800';
        case 'medium':
          return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
        case 'low':
          return 'text-blue-400 bg-blue-900/20 border-blue-800';
        default:
          return 'text-gray-400 bg-gray-800 border-gray-700';
      }
    } else {
      switch (priority) {
        case 'high':
          return 'text-danger-600 bg-danger-50 border-danger-200';
        case 'medium':
          return 'text-warning-600 bg-warning-50 border-warning-200';
        case 'low':
          return 'text-primary-600 bg-primary-50 border-primary-200';
        default:
          return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    }
  };

  const getPriorityIcon = (priority) => {
    if (isDarkMode) {
      switch (priority) {
        case 'high':
          return 'text-red-400';
        case 'medium':
          return 'text-yellow-400';
        case 'low':
          return 'text-blue-400';
        default:
          return 'text-gray-400';
      }
    } else {
      switch (priority) {
        case 'high':
          return 'text-danger-500';
        case 'medium':
          return 'text-warning-500';
        case 'low':
          return 'text-primary-500';
        default:
          return 'text-gray-500';
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Stock Alerts
        </h3>
        <div className={`flex items-center text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <AlertTriangle className="w-4 h-4 mr-1" />
          {alerts.length} items need attention
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-all duration-300 ${getPriorityColor(alert.priority)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className={`w-4 h-4 mr-2 ${getPriorityIcon(alert.priority)}`} />
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {alert.product}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {alert.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {alert.currentStock} / {alert.minStock}
                </p>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {alert.currentStock < alert.minStock ? 'Low Stock' : 'Stock OK'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length === 0 && (
        <div className={`text-center py-8 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <Package className={`w-12 h-12 mx-auto mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p>No stock alerts at the moment</p>
        </div>
      )}
    </div>
  );
};

export default StockAlertCard; 