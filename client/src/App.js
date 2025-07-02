import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import StockAlertCard from "./components/StockAlertCard";
import WeeklyChart from "./components/WeeklyChart";
import TopProductsCard from "./components/TopProductsCard";
import LowStockTable from "./components/LowStockTable";
import InventoryManager from "./components/InventoryManager";
import InventorySidebar from "./components/InventorySidebar";
import SalesDetails from "./components/SalesDetails";
import Reports from "./components/Reports";
import { ShoppingCart, DollarSign, Package, IndianRupee } from "lucide-react";
import {
  inventoryAPI,
  salesAPI,
  handleAPIError,
  authAPI,
} from "./services/api";
import {
  transformInventoryFromBackend,
  transformInventoryToBackend,
  transformInventoryUpdateToBackend,
  transformSalesFromBackend,
  transformSalesToBackend,
  toInputDateString,
  getTodayDateStringIST,
  getLast7DaysRangeIST,
  getLast7DaysRangeArrayIST,
} from "./utils/dataTransformers";
import Login from "./components/Login";
import StoreManagerSidebar from "./components/StoreManagerSidebar";

function getMonthStartDateString() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getLast7DaysRange() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: today.toISOString().slice(0, 10),
  };
}

function getLast7DaysRangeArray(fromDate) {
  const days = [];
  const from = new Date(fromDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function hasUidCookie() {
  return document.cookie.split(";").some((c) => c.trim().startsWith("uid="));
}

function App() {
  // Detect system theme preference on mount
  const getSystemTheme = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkMode, setIsDarkMode] = useState(getSystemTheme());
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState("single"); // 'single' or 'multi'
  const [inventory, setInventory] = useState([]);
  const [salesDetails, setSalesDetails] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [weekRange, setWeekRange] = useState(getLast7DaysRangeIST());
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasUidCookie());
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || ""
  );
  const [chartSales, setChartSales] = useState([]);
  const [chartRange, setChartRange] = useState("week");
  const [storeSidebarOpen, setStoreSidebarOpen] = useState(false);
  const [storeSidebarMode, setStoreSidebarMode] = useState("existing"); // 'existing' or 'add'

  // --- Inventory APIs using backend ---
  async function fetchInventory() {
    try {
      const response = await inventoryAPI.getAll();
      // console.log("Inventory API response:", response); // Remove this debug log
      // Defensive: ensure we pass an array
      const items = Array.isArray(response) ? response : [];
      const transformedData = transformInventoryFromBackend(items);
      setInventory(transformedData);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setInventory([]);
      handleAPIError(error, []);
    }
  }

  async function addInventory(items) {
    try {
      const transformedItems = transformInventoryToBackend(items);
      await inventoryAPI.add(transformedItems);
      // Refresh inventory after adding
      await fetchInventory();
    } catch (error) {
      console.error("Failed to add inventory:", error);
      handleAPIError(error);
    }
  }

  async function updateInventory(updatedItem) {
    try {
      const transformedItem = transformInventoryUpdateToBackend(updatedItem);
      await inventoryAPI.update([transformedItem]);
      // Refresh inventory after updating
      await fetchInventory();
    } catch (error) {
      console.error("Failed to update inventory:", error);
      handleAPIError(error);
    }
  }

  async function deleteInventory(productId) {
    try {
      await inventoryAPI.delete(productId);
      // Refresh inventory after deleting
      await fetchInventory();
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      handleAPIError(error);
    }
  }

  // --- Sales APIs using backend ---
  async function fetchSales(filters = {}) {
    try {
      const response = await salesAPI.getAll(filters);
      const transformedData = transformSalesFromBackend(response.sales || []);
      setSalesDetails(transformedData);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      setSalesDetails([]);
      handleAPIError(error, []);
    }
  }

  async function addSales(sales) {
    try {
      const transformedSales = transformSalesToBackend(sales);
      await salesAPI.add(transformedSales);
      // Refresh sales after adding
      await fetchSales();
      // Refresh inventory after adding sales
      await fetchInventory();
    } catch (error) {
      console.error("Failed to add sales:", error);
      handleAPIError(error);
    }
  }

  async function updateSales(sales) {
    try {
      const transformedSales = transformSalesToBackend(sales);
      await salesAPI.update(transformedSales);
      // Refresh sales after updating
      await fetchSales();
      // Refresh inventory after updating sales
      await fetchInventory();
    } catch (error) {
      console.error("Failed to update sales:", error);
      handleAPIError(error);
    }
  }

  async function deleteSales(saleIds) {
    try {
      await salesAPI.delete(saleIds);
      // Refresh sales after deleting
      await fetchSales();
      // Refresh inventory after deleting sales
      await fetchInventory();
    } catch (error) {
      console.error("Failed to delete sales:", error);
      handleAPIError(error);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return; // Only fetch if authenticated
    fetchInventory();
    fetchSales();
    // Fetch all sales for the current month
    const monthStart = getMonthStartDateString();
    const today = getTodayDateStringIST();
    salesAPI.getAll({ from: monthStart, to: today }).then((res) => {
      setMonthlySales(res.sales || []);
    });
    // Always use last 7 days ending today for weeklySales
    const weekRangeIST = getLast7DaysRangeIST();
    salesAPI
      .getAll({ from: weekRangeIST.from, to: weekRangeIST.to })
      .then((res) => {
        setWeeklySales(res.sales || []);
      });
  }, [isAuthenticated]);

  // Weekly Data: last 7 days (always ending today in IST)
  const weeklyData = getLast7DaysRangeArrayIST().map((date) => {
    const daySales = weeklySales.filter((sale) => {
      const saleDate = new Date(sale.sale_date).toISOString().slice(0, 10);
      return saleDate === date;
    });
    return {
      day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    };
  });

  // Calculate monthly revenue
  const monthRevenue = monthlySales.reduce(
    (sum, sale) => sum + Number(sale.revenue),
    0
  );

  // Today's date in yyyy-mm-dd (IST)
  const today = getTodayDateStringIST();
  // Today's revenue
  const todaysSales = salesDetails.filter((sale) => sale.sale_date === today);
  const todayRevenue = {
    amount: todaysSales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    percentage: 0, // You can add logic for percentage change if needed
    trend: "up",
  };
  // Stock Alerts: products with stock <= minStock (if minStock exists, else <= 5)
  const stockAlerts = inventory
    .filter((item) => Number(item.stock) <= (item.minStock || 5))
    .map((item) => {
      const minStock = item.minStock || 5;
      const percentage = (Number(item.stock) / minStock) * 100;
      let priority = "low";
      if (percentage <= 50) priority = "high";
      else if (percentage <= 75) priority = "medium";
      return {
        id: item.id,
        product: item.name,
        category: item.category,
        currentStock: item.stock,
        minStock: minStock,
        unit: item.unit,
        priority,
      };
    });
  // Top Selling Products (Current Month, >0 sold, with unit)
  const monthlyProductSalesMap = {};
  monthlySales.forEach((sale) => {
    if (!monthlyProductSalesMap[sale.pet_food_id]) {
      monthlyProductSalesMap[sale.pet_food_id] = { sales: 0, revenue: 0 };
    }
    monthlyProductSalesMap[sale.pet_food_id].sales += Number(
      sale.quantity_sold
    );
    monthlyProductSalesMap[sale.pet_food_id].revenue += Number(sale.revenue);
  });
  const topSellingProducts = inventory
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      sales: monthlyProductSalesMap[item.id]?.sales || 0,
      revenue: monthlyProductSalesMap[item.id]?.revenue || 0,
      unit: item.unit,
      image: "",
    }))
    .filter((p) => p.sales > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  // Low Stock Items (with correct fields for LowStockTable)
  const lowStockItems = inventory
    .filter((item) => Number(item.stock) <= (item.minStock || 5))
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      currentStock: item.stock,
      minStock: item.minStock || 5,
      price: item.price,
      unit: item.unit,
    }));

  // Monthly Data: each day of current month
  const monthStart = getMonthStartDateString();
  const daysInMonth = [];
  {
    let d = new Date(monthStart);
    const end = new Date(today);
    while (d <= end) {
      daysInMonth.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
  }
  const monthlyData = daysInMonth.map((date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const daySales = monthlySales.filter((sale) => {
      const saleDate = new Date(sale.sale_date).toISOString().slice(0, 10);
      return saleDate === dateStr;
    });
    return {
      day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    };
  });

  // Last 30 Days Data
  function getLastNDaysRangeArray(n) {
    const days = [];
    const today = getTodayDateStringIST();
    const todayDate = new Date(today);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }
  const last30DaysData = getLastNDaysRangeArray(30).map((date) => {
    const daySales = salesDetails.filter((sale) => {
      const saleDate = new Date(sale.sale_date).toISOString().slice(0, 10);
      return saleDate === date;
    });
    return {
      day: new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    };
  });

  // Fetch sales data for the chart independently
  useEffect(() => {
    let from, to;
    if (chartRange === "week") {
      const range = getLast7DaysRangeIST();
      from = range.from;
      to = range.to;
    } else {
      // last 30 days
      const today = getTodayDateStringIST();
      const d = new Date();
      d.setDate(d.getDate() - 29);
      from = d.toISOString().slice(0, 10);
      to = today;
    }
    salesAPI.getAll({ from, to }).then((res) => {
      setChartSales(res.sales || []);
    });
  }, [chartRange]);

  // Chart Data: last 7 or 30 days (always ending today in IST)
  const chartData = getLastNDaysRangeArray(chartRange === "week" ? 7 : 30).map(
    (date) => {
      const daySales = chartSales.filter((sale) => {
        const saleDate = new Date(sale.sale_date).toISOString().slice(0, 10);
        return saleDate === date;
      });
      return {
        day: new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        sales: daySales.length,
        revenue: daySales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
      };
    }
  );

  // Listen for system theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleOpenSidebar = (mode) => {
    setSidebarMode(mode);
    setSidebarOpen(true);
  };
  const handleCloseSidebar = () => setSidebarOpen(false);

  // Handler for successful login
  const handleLoginSuccess = (name, role) => {
    setIsAuthenticated(true);
    if (name) {
      setUserName(name);
      localStorage.setItem("userName", name);
    }
    if (role) {
      localStorage.setItem("userRole", role);
    }
  };

  // Handler for logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  // Attach handler for Store Manager dropdown
  useEffect(() => {
    window.onStoreManagerAction = (mode) => {
      setStoreSidebarMode(mode);
      setStoreSidebarOpen(true);
    };
    return () => {
      window.onStoreManagerAction = undefined;
    };
  }, []);

  // Early return conditions (must be after hooks)
  if (!isAuthenticated) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} />
      </>
    );
  }

  // Debug log for render
  console.log("Render state:", { isAuthenticated, checkingAuth, authError });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSidebar={handleOpenSidebar}
        onLogout={handleLogout}
      />
      <StoreManagerSidebar
        open={storeSidebarOpen}
        mode={storeSidebarMode}
        onClose={() => setStoreSidebarOpen(false)}
        isDarkMode={isDarkMode}
      />
      {/* Inventory Sidebar */}
      <InventorySidebar
        open={sidebarOpen}
        mode={sidebarMode}
        onClose={handleCloseSidebar}
        inventory={inventory}
        setInventory={setInventory}
        isDarkMode={isDarkMode}
        addInventory={addInventory}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "Inventory" ? (
          <InventoryManager
            isDarkMode={isDarkMode}
            inventory={inventory}
            setInventory={setInventory}
            onOpenSidebar={handleOpenSidebar}
            addInventory={addInventory}
            updateInventory={updateInventory}
            deleteInventory={deleteInventory}
            toInputDateString={toInputDateString}
          />
        ) : activeTab === "Sales" ? (
          <SalesDetails
            isDarkMode={isDarkMode}
            inventory={inventory}
            setInventory={setInventory}
            salesDetails={salesDetails}
            setSalesDetails={setSalesDetails}
            addSales={addSales}
            updateSales={updateSales}
            deleteSales={deleteSales}
            fetchSales={fetchSales}
          />
        ) : activeTab === "Reports" ? (
          <Reports
            isDarkMode={isDarkMode}
            inventory={inventory}
            salesDetails={salesDetails}
          />
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome, {userName || "back"}!{" "}
                <span role="img" aria-label="wave">
                  👋
                </span>
              </h2>
              <p
                className={`mt-1 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Here's what's happening with your pet shop today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Today's Revenue"
                value={`₹${todayRevenue.amount}`}
                percentage={todayRevenue.percentage}
                trend={todayRevenue.trend}
                icon={IndianRupee}
                color="success"
                isDarkMode={isDarkMode}
              />
              <StatCard
                title="This Month's Revenue"
                value={`₹${monthRevenue.toLocaleString()}`}
                percentage={0}
                trend="up"
                icon={IndianRupee}
                color="primary"
                isDarkMode={isDarkMode}
                subtitle={`From ${getMonthStartDateString()} to ${getTodayDateStringIST()}`}
              />
              <StatCard
                title="Stock Alerts"
                value={stockAlerts.length}
                percentage={0}
                trend="up"
                icon={Package}
                color="warning"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Main Content Grid */}
            <div className="mb-8">
              <WeeklyChart
                data={chartData}
                isDarkMode={isDarkMode}
                type="line"
                range={chartRange}
                onRangeChange={setChartRange}
              />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Top Selling Products */}
              <div className="w-full">
                <TopProductsCard
                  products={topSellingProducts}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Low Stock Items */}
              <div className="w-full">
                <LowStockTable items={lowStockItems} isDarkMode={isDarkMode} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
