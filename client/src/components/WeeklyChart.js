import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const WeeklyChart = ({ data, isDarkMode = false }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 shadow-gray-900/50' 
            : 'bg-white border-gray-200 shadow-gray-200/50'
        }`}>
          <p className={`font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {label}
          </p>
          <p className="text-success-600">
            Revenue: <span className="font-semibold">₹{payload[0]?.value?.toLocaleString?.() ?? ''}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Weekly Performance
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Revenue
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#f1f5f9"} />
            <XAxis 
              dataKey="day" 
              stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
              fontSize={12}
              tickFormatter={(value) => `₹${(value/1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart; 