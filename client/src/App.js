import React, { useState } from 'react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import StockAlertCard from './components/StockAlertCard';
import WeeklyChart from './components/WeeklyChart';
import TopProductsCard from './components/TopProductsCard';
import LowStockTable from './components/LowStockTable';
import InventoryManager from './components/InventoryManager';
import InventorySidebar from './components/InventorySidebar';
import SalesDetails from './components/SalesDetails';
import Reports from './components/Reports';
import { 
  ShoppingCart, 
  DollarSign, 
  Package
} from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState('single'); // 'single' or 'multi'
  const [inventory, setInventory] = useState([]);
  const [salesDetails, setSalesDetails] = useState([]);

  // --- Dashboard Dynamic Data ---
  // Today's date in yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10);
  // Today's revenue
  const todaysSales = salesDetails.filter(sale => sale.sale_date === today);
  const todayRevenue = {
    amount: todaysSales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    percentage: 0, // You can add logic for percentage change if needed
    trend: 'up',
  };
  // Last 30 days revenue
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };
  const last30Days = getLast30Days();
  const last30DaysRevenue = salesDetails
    .filter(sale => last30Days.includes(sale.sale_date))
    .reduce((sum, sale) => sum + Number(sale.revenue), 0);
  const fromDate30 = last30Days[0];
  const toDate30 = last30Days[last30Days.length - 1];
  // Stock Alerts: products with stock <= minStock (if minStock exists, else <= 5)
  const stockAlerts = inventory.filter(item => Number(item.stock) <= (item.minStock || 5));
  // Weekly Data: last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };
  const weeklyData = getLast7Days().map(date => {
    const daySales = salesDetails.filter(sale => sale.sale_date === date);
    return {
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + Number(sale.revenue), 0),
    };
  });
  // Top Selling Products
  const productSalesMap = {};
  salesDetails.forEach(sale => {
    if (!productSalesMap[sale.pet_food_id]) {
      productSalesMap[sale.pet_food_id] = { sales: 0, revenue: 0 };
    }
    productSalesMap[sale.pet_food_id].sales += Number(sale.quantity_sold);
    productSalesMap[sale.pet_food_id].revenue += Number(sale.revenue);
  });
  const topSellingProducts = inventory
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      sales: productSalesMap[item.id]?.sales || 0,
      revenue: productSalesMap[item.id]?.revenue || 0,
      image: '',
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  // Low Stock Items
  const lowStockItems = inventory.filter(item => Number(item.stock) <= (item.minStock || 5));

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleOpenSidebar = (mode) => {
    setSidebarMode(mode);
    setSidebarOpen(true);
  };
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        onThemeToggle={toggleTheme} 
        isDarkMode={isDarkMode} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenSidebar={handleOpenSidebar}
      />
      {/* Inventory Sidebar */}
      <InventorySidebar 
        open={sidebarOpen}
        mode={sidebarMode}
        onClose={handleCloseSidebar}
        inventory={inventory}
        setInventory={setInventory}
        isDarkMode={isDarkMode}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'Inventory' ? (
          <InventoryManager 
            isDarkMode={isDarkMode} 
            inventory={inventory}
            setInventory={setInventory}
            onOpenSidebar={handleOpenSidebar}
          />
        ) : activeTab === 'Sales' ? (
          <SalesDetails isDarkMode={isDarkMode} inventory={inventory} setInventory={setInventory} salesDetails={salesDetails} setSalesDetails={setSalesDetails} />
        ) : activeTab === 'Reports' ? (
          <Reports isDarkMode={isDarkMode} inventory={inventory} salesDetails={salesDetails} />
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back! 👋
              </h2>
              <p className={`mt-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
                icon={DollarSign}
                color="success"
                isDarkMode={isDarkMode}
              />
              <StatCard
                title="Last 30 Days Revenue"
                value={`₹${last30DaysRevenue.toLocaleString()}`}
                percentage={0}
                trend="up"
                icon={DollarSign}
                color="primary"
                isDarkMode={isDarkMode}
                subtitle={`From ${fromDate30} to ${toDate30}`}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Weekly Chart */}
              <div className="lg:col-span-2">
                <WeeklyChart data={weeklyData} isDarkMode={isDarkMode} />
              </div>

              {/* Stock Alerts */}
              <div>
                <StockAlertCard alerts={stockAlerts} isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Selling Products */}
              <div>
                <TopProductsCard products={topSellingProducts} isDarkMode={isDarkMode} />
              </div>

              {/* Low Stock Items */}
              <div>
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