import React, { useState, useRef } from "react";
import { Bell, User, LogOut, Sun, Moon, Plus, ChevronDown } from "lucide-react";
import { authAPI } from "../services/api";

const Header = ({
  onThemeToggle,
  isDarkMode,
  activeTab,
  setActiveTab,
  onOpenSidebar,
  onLogout,
}) => {
  const tabs = [
    {
      name: "Sales",
      icon: (
        <span role="img" aria-label="Sales">
          📊
        </span>
      ),
    },
    {
      name: "Dashboard",
      icon: (
        <span role="img" aria-label="Dashboard">
          🏠
        </span>
      ),
    },
    {
      name: "Inventory",
      icon: (
        <span role="img" aria-label="Inventory">
          📦
        </span>
      ),
    },
    {
      name: "Reports",
      icon: (
        <span role="img" aria-label="Reports">
          📊
        </span>
      ),
    },
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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [plusDropdownOpen]);

  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const storeRef = useRef();

  // Close dropdown on outside click for store manager
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (storeRef.current && !storeRef.current.contains(event.target)) {
        setStoreDropdownOpen(false);
      }
    }
    if (storeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [storeDropdownOpen]);

  // Get user role from localStorage (default to NORMAL if not set)
  const userRole =
    (typeof window !== "undefined" && localStorage.getItem("userRole")) ||
    "NORMAL";

  // Filter tabs based on role
  const visibleTabs =
    userRole === "ADMIN" ? tabs : tabs.filter((tab) => tab.name !== "Reports");

  return (
    <header
      className={`shadow-sm border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
          : "bg-white border-gray-200 shadow-gray-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                🐾 Joy Ram Petstore
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center">
            <div
              className={`flex rounded-xl transition-all duration-300 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {visibleTabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.name
                      ? isDarkMode
                        ? "bg-gray-600 text-white shadow-lg shadow-gray-900/30"
                        : "bg-white text-gray-900 shadow-lg shadow-gray-200/50"
                      : isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  } ${idx !== visibleTabs.length - 1 ? "mr-1" : ""}`}
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
                  ? "text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {/* Store Manager Dropdown (moved here) */}
            {userRole === "ADMIN" && (
              <div className="relative" ref={storeRef}>
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setStoreDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={storeDropdownOpen}
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Store Manager</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {storeDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <button
                      className={`w-full text-left px-4 py-3 rounded-t-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "hover:bg-blue-700 text-white"
                          : "hover:bg-primary-100 text-gray-900"
                      }`}
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        if (
                          typeof window !== "undefined" &&
                          window.onStoreManagerAction
                        )
                          window.onStoreManagerAction("existing");
                      }}
                    >
                      Existing Users
                    </button>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-b-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "hover:bg-blue-700 text-white"
                          : "hover:bg-primary-100 text-gray-900"
                      }`}
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        if (
                          typeof window !== "undefined" &&
                          window.onStoreManagerAction
                        )
                          window.onStoreManagerAction("add");
                      }}
                    >
                      Add User
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* End Store Manager Dropdown */}
            {/* Plus icon for Inventory only */}
            {activeTab === "Inventory" && (
              <div className="relative" ref={plusRef}>
                <button
                  className={`p-1 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                    isDarkMode
                      ? "text-white bg-blue-600 hover:bg-blue-500"
                      : "text-white bg-primary-500 hover:bg-primary-600"
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
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <button
                      className={`w-full text-left px-4 py-3 rounded-t-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "hover:bg-blue-700 text-white"
                          : "hover:bg-primary-100 text-gray-900"
                      }`}
                      onClick={() => {
                        setPlusDropdownOpen(false);
                        onOpenSidebar && onOpenSidebar("single");
                      }}
                    >
                      Add single product
                    </button>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-b-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "hover:bg-blue-700 text-white"
                          : "hover:bg-primary-100 text-gray-900"
                      }`}
                      onClick={() => {
                        setPlusDropdownOpen(false);
                        onOpenSidebar && onOpenSidebar("multi");
                      }}
                    >
                      Add multiple products
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Profile dropdown */}
            {/* Logout */}
            <button
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                  : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
              }`}
              onClick={async () => {
                try {
                  await authAPI.logout();
                  // Clear all localStorage
                  localStorage.clear();
                  // Clear all cookies for this site
                  if (document.cookie && document.cookie !== "") {
                    const cookies = document.cookie.split(";");
                    for (let cookie of cookies) {
                      const eqPos = cookie.indexOf("=");
                      const name =
                        eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                      document.cookie =
                        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    }
                  }
                  window.location.reload();
                } catch (err) {
                  // Optionally show error
                }
              }}
            >
              <span className="sr-only">Logout</span>
              <LogOut className="h-5 w-5" />
            </button>

            {showLogoutToast && (
              <div
                className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-green-300"
                    : "bg-white text-green-700 border border-green-200"
                }`}
              >
                Logged out successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
