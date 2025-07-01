import React, { useState, useEffect, useRef } from "react";
import BatchSalesSidebar from "./BatchSalesSidebar";
import {
  Edit2,
  Trash2,
  Search as SearchIcon,
  X as CancelIcon,
  Calendar as CalendarIcon,
  Save,
} from "lucide-react";

const SalesDetails = ({
  isDarkMode,
  inventory,
  setInventory,
  salesDetails,
  setSalesDetails,
  addSales,
  updateSales,
  deleteSales,
  fetchSales, // We'll use this for backend sync
}) => {
  const [batchSalesOpen, setBatchSalesOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editForm, setEditForm] = useState({
    quantity_sold: "",
    revenue: "",
    sale_date: "",
  });
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteSale, setDeleteSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredSales, setFilteredSales] = useState([]);
  const fromDateInputRef = useRef();
  const toDateInputRef = useRef();

  // Helper to get product info by id from current inventory, fallback to sale fields
  const getProductById = (id) =>
    inventory.find((i) => String(i.id) === String(id));
  const getProductName = (sale) =>
    getProductById(sale.pet_food_id)?.name || sale.productName || "Unknown";
  const getProductCategory = (sale) =>
    getProductById(sale.pet_food_id)?.category || sale.category || "";
  const getProductBrand = (sale) =>
    getProductById(sale.pet_food_id)?.brand || sale.brand || "";
  const getProductUnit = (sale) =>
    getProductById(sale.pet_food_id)?.unit || sale.unitOfMeasurement || "";

  // Fetch all sales by default
  useEffect(() => {
    setLoading(true);
    fetchSales()
      .then(() => setHasSearched(false))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // Update filteredSales when salesDetails or search changes
  useEffect(() => {
    setFilteredSales(salesDetails);
  }, [salesDetails]);

  // Search handler
  const handleSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    if (searchText) {
      await fetchSales({ search: searchText }); // search all fields
    } else {
      await fetchSales(); // show today's sales
    }
    setLoading(false);
  };

  // Clear search
  const handleClearSearch = async () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
    setLoading(true);
    await fetchSales(); // fetch all sales
    setLoading(false);
    setHasSearched(false);
  };

  // Edit sale
  const handleEditSave = async (sale, idx) => {
    try {
      const updatedSale = {
        ...sale,
        ...editForm,
        quantity_sold: Number(editForm.quantity_sold),
        revenue: Number(editForm.revenue),
        sale_date: editForm.sale_date,
      };
      await updateSales([updatedSale]);
      setEditingIdx(null);
      // Re-apply current search or show today's sales
      await handleSearch();
    } catch (error) {
      // handle error
    }
  };

  // Delete sale
  const handleDeleteSale = async () => {
    if (deleteIdx === null || !deleteSale) return;
    try {
      await deleteSales([deleteSale.id]);
      setDeleteIdx(null);
      setDeleteSale(null);
    } catch (error) {
      // handle error
    }
  };

  // Batch sales close handler
  const handleBatchSalesClose = () => {
    setBatchSalesOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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
          Sales Details
        </h3>
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-center justify-center flex-1 sm:mx-6"
        >
          <input
            type="text"
            placeholder="Search by product name, category, brand, unit..."
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
              id="sales-from-date"
              ref={fromDateInputRef}
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
                fromDateInputRef.current && fromDateInputRef.current.focus()
              }
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input
              type="date"
              id="sales-to-date"
              ref={toDateInputRef}
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
              onClick={() =>
                toDateInputRef.current && toDateInputRef.current.focus()
              }
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
              onClick={handleClearSearch}
              className="ml-1 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
              aria-label="Clear search fields"
            >
              <CancelIcon size={16} />
            </button>
          )}
        </form>
        <button
          onClick={() => setBatchSalesOpen(true)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${
            isDarkMode
              ? "bg-green-700 text-white hover:bg-green-600"
              : "bg-success-500 text-white hover:bg-success-600"
          }`}
          aria-label="Batch Sales"
        >
          Batch Sales
        </button>
      </div>
      {loading ? (
        <div className="py-16 text-center text-lg text-gray-400">
          Loading sales...
        </div>
      ) : (
        <div className="overflow-x-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Product Name
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Brand
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Category
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Unit
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Quantity Sold
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Revenue (₹)
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Sale Date
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody
              className={
                isDarkMode
                  ? "bg-gray-800 divide-gray-700"
                  : "bg-white divide-gray-200"
              }
            >
              {filteredSales.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className={`py-16 text-center animate-fade-in align-middle ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No sales found for your search.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => {
                  const isEditing = editingIdx === idx;
                  return isEditing ? (
                    <tr
                      key={idx}
                      className={isDarkMode ? "bg-gray-700" : "bg-yellow-50"}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getProductName(sale)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        {getProductBrand(sale)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        {getProductCategory(sale)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        {getProductUnit(sale)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        <input
                          type="number"
                          min="1"
                          value={editForm.quantity_sold}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              quantity_sold: e.target.value,
                            }))
                          }
                          className={`w-20 rounded px-2 py-1 border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        />
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        <input
                          type="number"
                          min="0"
                          value={editForm.revenue}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              revenue: e.target.value,
                            }))
                          }
                          className={`w-24 rounded px-2 py-1 border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        />
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                        <input
                          type="date"
                          value={editForm.sale_date}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              sale_date: e.target.value,
                            }))
                          }
                          className={`rounded px-2 py-1 border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center relative">
                        <button
                          className={`p-2 rounded transition-all duration-200 ${
                            isDarkMode
                              ? "text-green-400 hover:bg-gray-600"
                              : "text-success-600 hover:bg-success-100"
                          }`}
                          title="Save"
                          onClick={() => handleEditSave(sale, idx)}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          className={`p-2 rounded transition-all duration-200 ${
                            isDarkMode
                              ? "text-red-400 hover:bg-gray-600"
                              : "text-danger-500 hover:bg-danger-100"
                          }`}
                          title="Cancel"
                          onClick={() => setEditingIdx(null)}
                        >
                          <CancelIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={idx}
                      className={`transition-all duration-200 cursor-pointer ${
                        isDarkMode
                          ? "hover:bg-green-900/30"
                          : "hover:bg-green-50"
                      } focus-within:ring-2 focus-within:ring-green-400`}
                      tabIndex={0}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getProductName(sale)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-yellow-200" : "text-yellow-700"
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
                          isDarkMode ? "text-yellow-200" : "text-yellow-700"
                        }`}
                      >
                        {getProductUnit(sale)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-yellow-200" : "text-yellow-700"
                        }`}
                      >
                        {sale.quantity_sold}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-green-300" : "text-success-600"
                        }`}
                      >
                        ₹{Number(sale.revenue).toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {sale.sale_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        <button
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                          onClick={() => {
                            setEditingIdx(idx);
                            setEditForm({
                              quantity_sold: sale.quantity_sold,
                              revenue: sale.revenue,
                              sale_date: sale.sale_date,
                            });
                          }}
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                          onClick={() => {
                            setDeleteIdx(idx);
                            setDeleteSale(sale);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      <BatchSalesSidebar
        open={batchSalesOpen}
        onClose={handleBatchSalesClose}
        inventory={inventory}
        setInventory={setInventory}
        isDarkMode={isDarkMode}
        salesDetails={salesDetails}
        setSalesDetails={setSalesDetails}
        addSales={addSales}
      />
      {/* Toast for success */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-300 ${
            isDarkMode
              ? "bg-green-800 text-white"
              : "bg-green-100 text-green-900"
          }`}
          style={{ animation: "fade-in .5s" }}
        >
          Batch sales recorded successfully!
        </div>
      )}
      {/* Delete confirmation popup */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className={`rounded-xl shadow-lg p-8 w-full max-w-xs text-center ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this sale?
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleDeleteSale}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkMode
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-danger-500 text-white hover:bg-danger-600"
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setDeleteIdx(null);
                  setDeleteSale(null);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s; }
      `}</style>
    </div>
  );
};

export default SalesDetails;
