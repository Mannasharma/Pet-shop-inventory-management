import React, { useState, useEffect } from "react";
import {
  Download,
  Search as SearchIcon,
  X as CancelIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { salesAPI } from "../services/api";

const Reports = ({ isDarkMode, inventory, salesDetails }) => {
  // Helper to get product info by id from current inventory, fallback to sale object
  const getProductById = (id) => inventory.find((i) => i.id === id);
  const getProductName = (sale) => {
    const item = getProductById(sale.pet_food_id);
    return item ? item.name : sale.productName || "Unknown";
  };
  const getProductCategory = (sale) => {
    const item = getProductById(sale.pet_food_id);
    return item ? item.category : sale.category || "";
  };
  const getProductPrice = (sale) => {
    const item = getProductById(sale.pet_food_id);
    return item ? String(item.price) : sale.price || "";
  };
  const getProductBrand = (sale) => {
    const item = getProductById(sale.pet_food_id);
    return item ? item.brand : sale.brand || "";
  };
  const getProductUnit = (sale) => {
    const item = getProductById(sale.pet_food_id);
    return item ? item.unit : sale.unitOfMeasurement || "";
  };

  // Search/filter state
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Filtering logic
  const handleSearch = async (e) => {
    e && e.preventDefault();
    setHasSearched(true);
    try {
      const filters = {};
      if (searchText) filters.search = searchText;
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;
      const res = await salesAPI.getAll(filters);
      setFilteredSales(res.sales || []);
    } catch (err) {
      setFilteredSales([]);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Product Name",
      "Brand",
      "Category",
      "Unit",
      "Quantity Sold",
      "Revenue (₹)",
      "Sale Date",
    ];
    const rows = filteredSales.map((sale) => [
      getProductName(sale),
      getProductBrand(sale),
      getProductCategory(sale),
      getProductUnit(sale),
      sale.quantity_sold,
      sale.revenue,
      sale.sale_date ? `${sale.sale_date}` : "",
    ]);
    // Add total revenue row
    const totalRevenue = filteredSales.reduce(
      (sum, sale) => sum + Number(sale.revenue),
      0
    );
    rows.push(["", "", "", "", "", "Total Revenue", totalRevenue]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().slice(0, 10);
  };

  // Remove auto-search on mount or salesDetails change
  // useEffect(() => {
  //   handleSearch();
  //   // eslint-disable-next-line
  // }, [searchText, fromDate, toDate, salesDetails]);

  return (
    <div
      className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
          : "bg-white border-gray-200 shadow-gray-200/50"
      }`}
    >
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3
          className={`text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          All Sales Report
        </h3>
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-center justify-center flex-1 sm:mx-6"
        >
          <input
            type="text"
            placeholder="Search by name, category, or price..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${
              isDarkMode
                ? "text-gray-100 placeholder-gray-400 bg-gray-900"
                : "text-gray-900 placeholder-gray-500 bg-white"
            }`}
          />
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${
                isDarkMode
                  ? "text-gray-100 placeholder-gray-400 bg-gray-900"
                  : "text-gray-900 placeholder-gray-500 bg-white"
              }`}
              style={{ minWidth: 130 }}
            />
            <CalendarIcon
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-auto cursor-pointer"
              onClick={() =>
                document.getElementById("report-from-date").focus()
              }
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${
                isDarkMode
                  ? "text-gray-100 placeholder-gray-400 bg-gray-900"
                  : "text-gray-900 placeholder-gray-500 bg-white"
              }`}
              style={{ minWidth: 130 }}
            />
            <CalendarIcon
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-auto cursor-pointer"
              onClick={() => document.getElementById("report-to-date").focus()}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold text-sm flex items-center justify-center"
            aria-label="Search"
          >
            <SearchIcon size={20} />
          </button>
          {(searchText || fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setFromDate("");
                setToDate("");
              }}
              className="ml-1 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
              aria-label="Clear search fields"
            >
              <CancelIcon size={16} />
            </button>
          )}
        </form>
        <button
          type="button"
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-semibold text-sm whitespace-nowrap flex items-center justify-center"
          aria-label="Export"
        >
          <Download size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Product Name
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Brand
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Category
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Unit
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Quantity Sold
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Revenue (₹)
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                }`}
              >
                Sale Date
              </th>
            </tr>
          </thead>
          <tbody
            className={`${
              isDarkMode
                ? "bg-gray-800 divide-gray-700"
                : "bg-white divide-gray-200"
            }`}
          >
            {!hasSearched ? (
              <tr>
                <td
                  colSpan={7}
                  className={`py-16 text-center animate-fade-in align-middle ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No sales to display. Please perform a search.
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className={`py-16 text-center animate-fade-in align-middle ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No sales found for your search.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale, idx) => (
                <tr key={idx}>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getProductName(sale)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    {getProductBrand(sale)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-yellow-200" : "text-yellow-700"
                    }`}
                  >
                    {getProductCategory(sale)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {getProductUnit(sale)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      isDarkMode ? "text-yellow-300" : "text-yellow-700"
                    }`}
                  >
                    {sale.quantity_sold}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      isDarkMode ? "text-green-400" : "text-success-600"
                    }`}
                  >
                    ₹{Number(sale.revenue).toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formatDate(sale.sale_date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Total Revenue Summary */}
      {hasSearched && filteredSales.length > 0 && (
        <div className="mt-6 flex justify-end">
          <div
            className={`px-6 text-right font-semibold text-lg ${
              isDarkMode ? "text-green-400" : "text-success-600"
            }`}
            style={{ minWidth: 200 }}
          >
            Total Revenue: ₹
            {filteredSales
              .reduce((sum, sale) => sum + Number(sale.revenue), 0)
              .toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
