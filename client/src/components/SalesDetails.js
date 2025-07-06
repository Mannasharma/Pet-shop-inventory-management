import React, { useState, useEffect, useRef } from "react";
import BatchSalesSidebar from "./BatchSalesSidebar";
import {
  Edit2,
  Trash2,
  Search as SearchIcon,
  X as CancelIcon,
  Calendar as CalendarIcon,
  Save,
  ShoppingCart,
} from "lucide-react";
import { useRefresh } from "../context/RefreshContext";
import { salesAPI } from "../services/api";

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
  const [selectedSales, setSelectedSales] = useState([]);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const fromDateInputRef = useRef();
  const toDateInputRef = useRef();
  const { triggerRefresh } = useRefresh();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

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

  // Helper to format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().slice(0, 10);
  };

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
    if (!searchText && !fromDate && !toDate) {
      // All fields empty: show today's sales
      await fetchSales();
    } else if (searchText) {
      // Search all fields and filter by date if set
      const filters = { search: searchText };
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;
      await fetchSales(filters);
    } else if (fromDate || toDate) {
      // Only date filter
      const filters = {};
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;
      await fetchSales(filters);
    }
    setLoading(false);
  };

  // Clear search
  const handleClearSearch = async () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
    setLoading(true);
    await fetchSales(); // show today's sales
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

  // Helper: toggle selection
  const toggleSaleSelection = (id) => {
    setSelectedSales((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const selectAll = () => {
    if (selectedSales.length === filteredSales.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(filteredSales.map((sale) => sale.id));
    }
  };

  // Batch delete handler
  const handleBatchDelete = async () => {
    if (selectedSales.length === 0) return;
    try {
      await deleteSales(selectedSales);
      setSelectedSales([]);
      setShowBatchDeleteModal(false);
    } catch (error) {
      // handle error
    }
  };

  // Example: after a successful add, update, or delete
  const handleAddSales = async (sales) => {
    await addSales(sales);
    triggerRefresh();
  };
  const handleUpdateSales = async (sales) => {
    await updateSales(sales);
    triggerRefresh();
  };
  const handleDeleteSales = async (ids) => {
    await deleteSales(ids);
    triggerRefresh();
  };

  // Handler for deleting all sales
  const handleDeleteAllSales = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL sales? This cannot be undone."
      )
    )
      return;
    setDeletingAll(true);
    try {
      await salesAPI.deleteAll();
      await fetchSales();
      alert("All sales deleted successfully.");
    } catch (error) {
      alert("Failed to delete all sales.");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div
      className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
          : "bg-white border-gray-200 shadow-gray-200/50"
      }`}
    >
      {/* Unified Controls Row */}
      <div className="w-full flex flex-col mb-6">
        {/* Left-aligned search button or centered form */}
        {!showSearchForm ? (
          <div className="flex justify-start w-full">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
              style={{ minWidth: 48, minHeight: 48 }}
              aria-label="Show Search Form"
              onClick={() => setShowSearchForm(true)}
            >
              <SearchIcon size={24} />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              handleSearch(e);
            }}
            className="flex flex-wrap gap-3 items-center justify-center"
            style={{ maxWidth: 800 }}
          >
            <input
              type="text"
              placeholder="Search by product name, category, brand, unit..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-w-[180px] ${
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
                className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-w-[130px] ${
                  isDarkMode
                    ? "text-gray-100 placeholder-gray-400 bg-gray-900"
                    : "text-gray-900 placeholder-gray-500 bg-white"
                }`}
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
                className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-w-[130px] ${
                  isDarkMode
                    ? "text-gray-100 placeholder-gray-400 bg-gray-900"
                    : "text-gray-900 placeholder-gray-500 bg-white"
                }`}
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
            <button
              type="button"
              onClick={() => setShowSearchForm(false)}
              className="ml-1 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
              aria-label="Close search fields"
            >
              <CancelIcon size={16} />
            </button>
          </form>
        )}
        {/* Operation Buttons - right aligned */}
        <div className="flex flex-wrap gap-2 items-center justify-end w-full mt-3 pr-2">
          {!deleteMode ? (
            <>
              <button
                type="button"
                onClick={() => setBatchSalesOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Batch Sales"
              >
                <ShoppingCart size={24} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteMode(true)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Delete"
              >
                <Trash2 size={24} />
              </button>
              <button
                type="button"
                onClick={handleDeleteAllSales}
                className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Delete All Sales"
                disabled={deletingAll}
                style={{ marginRight: 8 }}
              >
                <Trash2 size={24} /> Delete All Sales
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBatchDelete}
                className={`rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center ${
                  selectedSales.length === 0 || deletingAll
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400"
                }`}
                aria-label="Delete Selected Sales"
                disabled={selectedSales.length === 0 || deletingAll}
              >
                <Trash2 size={20} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteMode(false)}
                className="border border-gray-400 text-white rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Cancel Delete Mode"
              >
                <CancelIcon size={20} />
              </button>
              <button
                type="button"
                onClick={() => setBatchSalesOpen(true)}
                className="border border-green-500 text-green-400 rounded-lg px-6 py-3 font-semibold text-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Batch Sales"
              >
                <ShoppingCart size={20} />
              </button>
            </>
          )}
        </div>
      </div>
      {/* Heading above table */}
      <h3
        className={`text-lg font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Sales Details
      </h3>
      {loading ? (
        <div className="py-16 text-center text-lg text-gray-400">
          Loading sales...
        </div>
      ) : (
        <div className="overflow-x-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                {deleteMode && (
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedSales.length === filteredSales.length &&
                        filteredSales.length > 0
                      }
                      onChange={selectAll}
                      aria-label="Select all sales"
                    />
                  </th>
                )}
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
                  Quantity Sold
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
                    colSpan={deleteMode ? 9 : 8}
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
                        {getProductUnit(sale)}
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
                      {deleteMode && (
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedSales.includes(sale.id)}
                            onChange={() => toggleSaleSelection(sale.id)}
                            aria-label={`Select sale ${getProductName(sale)}`}
                          />
                        </td>
                      )}
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
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
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          isDarkMode ? "text-yellow-300" : "text-yellow-700"
                        }`}
                      >
                        {sale.quantity_sold}
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
      {/* Batch Delete confirmation popup */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className={`rounded-xl shadow-lg p-8 w-full max-w-xs text-center ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to delete {selectedSales.length} selected
              sale(s)?
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleBatchDelete}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkMode
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-danger-500 text-white hover:bg-danger-600"
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBatchDeleteModal(false)}
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
