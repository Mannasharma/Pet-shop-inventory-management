import React from 'react';
import { TrendingUp, Star } from 'lucide-react';

const TopProductsCard = ({ products, isDarkMode = false }) => {
  const getCategoryColor = (category) => {
    if (isDarkMode) {
      switch (category.toLowerCase()) {
        case 'food':
          return 'bg-orange-900/30 text-orange-400';
        case 'hygiene':
          return 'bg-blue-900/30 text-blue-400';
        case 'accessories':
          return 'bg-purple-900/30 text-purple-400';
        default:
          return 'bg-gray-800 text-gray-400';
      }
    } else {
      switch (category.toLowerCase()) {
        case 'food':
          return 'bg-orange-100 text-orange-700';
        case 'hygiene':
          return 'bg-blue-100 text-blue-700';
        case 'accessories':
          return 'bg-purple-100 text-purple-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
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
          Top Selling Products
        </h3>
        <div className={`flex items-center text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          This week
        </div>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          }`}>
            <div className="flex-shrink-0">
              {index < 3 ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 
                    ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : index === 1 
                      ? isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      : isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                }`}>
                  {index + 1}
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {product.image}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getCategoryColor(product.category)}`}>
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.sales} sold
                  </p>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-green-400' : 'text-success-600'
                  }`}>
                    ₹{product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className={`text-center py-8 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <Star className={`w-12 h-12 mx-auto mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p>No sales data available</p>
        </div>
      )}
    </div>
  );
};

export default TopProductsCard; 