import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

const LowStockTable = ({ items, isDarkMode = false }) => {
  const getStockStatus = (current, min) => {
    const percentage = (current / min) * 100;
    if (isDarkMode) {
      if (percentage <= 50) return { color: 'text-red-400', bg: 'bg-red-900/20', text: 'Critical' };
      if (percentage <= 75) return { color: 'text-yellow-400', bg: 'bg-yellow-900/20', text: 'Low' };
      return { color: 'text-blue-400', bg: 'bg-blue-900/20', text: 'Warning' };
    } else {
      if (percentage <= 50) return { color: 'text-danger-600', bg: 'bg-danger-50', text: 'Critical' };
      if (percentage <= 75) return { color: 'text-warning-600', bg: 'bg-warning-50', text: 'Low' };
      return { color: 'text-primary-600', bg: 'bg-primary-50', text: 'Warning' };
    }
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
          Low Stock Items
        </h3>
        <div className={`flex items-center text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <AlertTriangle className="w-4 h-4 mr-1" />
          {items.length} items need restocking
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Product
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Category
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Stock Level
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Price
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
          }`}>
            {items.map((item) => {
              const status = getStockStatus(item.currentStock, item.minStock);
              return (
                <tr key={item.id} className={`transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center">
                      <span className="font-medium">{item.currentStock}</span>
                      <span className={`mx-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>/</span>
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {item.minStock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${status.bg} ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ₹{item.price.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 && (
        <div className={`text-center py-8 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <Package className={`w-12 h-12 mx-auto mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p>All items are well stocked</p>
        </div>
      )}
      
      {items.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg transition-all duration-300 ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className={`w-5 h-5 mr-2 transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Consider placing orders for items with critical stock levels to avoid stockouts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockTable; 