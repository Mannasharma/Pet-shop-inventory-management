import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, percentage, trend, icon: Icon, color = 'primary', isDarkMode = false }) => {
  const colorClasses = {
    primary: isDarkMode 
      ? 'bg-blue-900/20 text-blue-400 border-blue-800' 
      : 'bg-primary-50 text-primary-600 border-primary-200',
    success: isDarkMode 
      ? 'bg-green-900/20 text-green-400 border-green-800' 
      : 'bg-success-50 text-success-600 border-success-200',
    warning: isDarkMode 
      ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' 
      : 'bg-warning-50 text-warning-600 border-warning-200',
    danger: isDarkMode 
      ? 'bg-red-900/20 text-red-400 border-red-800' 
      : 'bg-danger-50 text-danger-600 border-danger-200'
  };

  const iconColorClasses = {
    primary: isDarkMode 
      ? 'bg-blue-900/30 text-blue-400' 
      : 'bg-primary-100 text-primary-600',
    success: isDarkMode 
      ? 'bg-green-900/30 text-green-400' 
      : 'bg-success-100 text-success-600',
    warning: isDarkMode 
      ? 'bg-yellow-900/30 text-yellow-400' 
      : 'bg-warning-100 text-warning-600',
    danger: isDarkMode 
      ? 'bg-red-900/30 text-red-400' 
      : 'bg-danger-100 text-danger-600'
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {typeof value === 'number' && title.toLowerCase().includes('revenue') 
              ? `₹${value.toLocaleString()}`
              : value.toLocaleString()
            }
          </p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className={`w-4 h-4 mr-1 transition-colors duration-300 ${
                isDarkMode ? 'text-green-400' : 'text-success-500'
              }`} />
            ) : (
              <TrendingDown className={`w-4 h-4 mr-1 transition-colors duration-300 ${
                isDarkMode ? 'text-red-400' : 'text-danger-500'
              }`} />
            )}
            <span className={`text-sm font-medium transition-colors duration-300 ${
              trend === 'up' 
                ? isDarkMode ? 'text-green-400' : 'text-success-600'
                : isDarkMode ? 'text-red-400' : 'text-danger-600'
            }`}>
              {percentage}%
            </span>
            <span className={`text-sm ml-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              from yesterday
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg transition-all duration-300 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard; 