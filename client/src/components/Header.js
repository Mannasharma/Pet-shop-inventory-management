import React, { useState, useRef } from 'react';
import { Bell, User, LogOut, Sun, Moon, Plus, ChevronDown } from 'lucide-react';

const Header = ({ onThemeToggle, isDarkMode, activeTab, setActiveTab, onOpenSidebar }) => {
  const tabs = [
    { name: 'Sales', icon: <span role="img" aria-label="Sales">📊</span> },
    { name: 'Dashboard', icon: <span role="img" aria-label="Dashboard">🏠</span> },
    { name: 'Inventory', icon: <span role="img" aria-label="Inventory">📦</span> },
    { name: 'Reports', icon: <span role="img" aria-label="Reports">📊</span> }
  ];

  // Dropdown state for plus button
  const [plusDropdownOpen, setPlusDropdownOpen] = useState(false);
  const plusRef = useRef();

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (plusRef.current && !plusRef.current.contains(event.target)) {
        setPlusDropdownOpen(false);
      }
    }
    if (plusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [plusDropdownOpen]);

  return (
    <header className={`shadow-sm border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🐾 Pet Shop Dashboard
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center">
            <div className={`flex rounded-xl transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {tabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.name
                      ? isDarkMode
                        ? 'bg-gray-600 text-white shadow-lg shadow-gray-900/30'
                        : 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  } ${idx !== tabs.length - 1 ? 'mr-1' : ''}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-semibold">{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-yellow-400 hover:bg-gray-700 hover:text-yellow-300' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className={`p-3 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}>
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
            </button>

            {/* Plus icon for Inventory only */}
            {activeTab === 'Inventory' && (
              <div className="relative" ref={plusRef}>
                <button
                  className={`p-1 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                    isDarkMode
                      ? 'text-white bg-blue-600 hover:bg-blue-500'
                      : 'text-white bg-primary-500 hover:bg-primary-600'
                  }`}
                  onClick={() => setPlusDropdownOpen((open) => !open)}
                  title="Add Product"
                  aria-haspopup="true"
                  aria-expanded={plusDropdownOpen}
                >
                  <Plus className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                {plusDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-t-lg transition-colors duration-200 ${
                        isDarkMode ? 'hover:bg-blue-700 text-white' : 'hover:bg-primary-100 text-gray-900'
                      }`}
                      onClick={() => {
                        setPlusDropdownOpen(false);
                        onOpenSidebar && onOpenSidebar('single');
                      }}
                    >
                      Add single product
                    </button>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-b-lg transition-colors duration-200 ${
                        isDarkMode ? 'hover:bg-blue-700 text-white' : 'hover:bg-primary-100 text-gray-900'
                      }`}
                      onClick={() => {
                        setPlusDropdownOpen(false);
                        onOpenSidebar && onOpenSidebar('multi');
                      }}
                    >
                      Add multiple products
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile dropdown */}
            <div className="relative">
              <button className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              }`}>
                <User className="h-5 w-5" />
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Store Manager
                </span>
              </button>
            </div>

            {/* Logout */}
            <button className={`p-3 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
            }`}>
              <span className="sr-only">Logout</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 