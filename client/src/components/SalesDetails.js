import React, { useState } from 'react';
import { inventoryItems } from '../data/mockData';
import BatchSalesSidebar from './BatchSalesSidebar';
import { Edit2, Trash2, Search as SearchIcon, X as CancelIcon, Calendar as CalendarIcon, Save } from 'lucide-react';

const SalesDetails = ({ isDarkMode, inventory, setInventory, salesDetails, setSalesDetails }) => {
  const [batchSalesOpen, setBatchSalesOpen] = useState(false);
  const [clickedSale, setClickedSale] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredSales, setFilteredSales] = useState(salesDetails);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editForm, setEditForm] = useState({ quantity_sold: '', revenue: '', sale_date: '' });
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteSale, setDeleteSale] = useState(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const fromDateInputRef = React.useRef();
  const toDateInputRef = React.useRef();
  const [hasSearched, setHasSearched] = useState(false);

  // Helper to get product info by id from current inventory
  const getProductById = (id) => inventory.find(i => i.id === id);
  const getProductName = (id) => {
    const item = getProductById(id);
    return item ? item.name : 'Unknown';
  };
  const getProductCategory = (id) => {
    const item = getProductById(id);
    return item ? item.category : '';
  };
  const getProductPrice = (id) => {
    const item = getProductById(id);
    return item ? String(item.price) : '';
  };
  const getProductBrand = (id) => {
    const item = getProductById(id);
    return item ? item.brand : '';
  };
  const getProductUnit = (id) => {
    const item = getProductById(id);
    return item ? item.unit : '';
  };

  // Filter sales based on search and date range
  const handleSearch = (e) => {
    e && e.preventDefault();
    setHasSearched(true);
    let filtered = salesDetails.filter(sale => {
      const name = getProductName(sale.pet_food_id).toLowerCase();
      const category = getProductCategory(sale.pet_food_id).toLowerCase();
      const price = getProductPrice(sale.pet_food_id);
      const search = searchText.toLowerCase();
      const matchesText =
        name.includes(search) ||
        category.includes(search) ||
        price.includes(search);
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && sale.sale_date >= fromDate;
      if (toDate) matchesDate = matchesDate && sale.sale_date <= toDate;
      return matchesText && matchesDate;
    });
    setFilteredSales(filtered);
  };

  React.useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, [searchText, fromDate, toDate, salesDetails]);

  // Show toast on successful batch sale
  const handleBatchSalesClose = () => {
    setBatchSalesOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Sale details alert (for now)
  const handleRowClick = (sale) => {
    // setClickedSale(sale);
    // No alert or popup
  };

  const handleDeleteSale = () => {
    if (deleteIdx === null || !deleteSale) return;
    // Restore inventory stock
    const invIdx = inventory.findIndex(i => i.id === deleteSale.pet_food_id);
    if (invIdx !== -1) {
      setInventory(prev => prev.map((item, i) => i === invIdx ? { ...item, stock: Number(item.stock) + Number(deleteSale.quantity_sold) } : item));
    }
    // Remove sale from salesDetails
    setSalesDetails(prev => prev.filter((_, i) => i !== deleteIdx));
    setDeleteIdx(null);
    setDeleteSale(null);
  };

  const handleCancelDelete = () => {
    setDeleteIdx(null);
    setDeleteSale(null);
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sales Details</h3>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center justify-center flex-1 sm:mx-6">
          <input
            type="text"
            placeholder="Search by name, category, or price..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className={`rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${isDarkMode ? 'text-gray-100 placeholder-gray-400 bg-gray-900' : 'text-gray-900 placeholder-gray-500 bg-white'}`}
          />
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${isDarkMode ? 'text-gray-100 placeholder-gray-400 bg-gray-900' : 'text-gray-900 placeholder-gray-500 bg-white'}`}
              style={{ minWidth: 130 }}
            />
            <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-auto cursor-pointer" onClick={() => document.getElementById('sales-from-date').focus()} />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className={`rounded-lg px-4 py-2 pr-10 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${isDarkMode ? 'text-gray-100 placeholder-gray-400 bg-gray-900' : 'text-gray-900 placeholder-gray-500 bg-white'}`}
              style={{ minWidth: 130 }}
            />
            <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-auto cursor-pointer" onClick={() => document.getElementById('sales-to-date').focus()} />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold text-sm flex items-center justify-center" aria-label="Search">
            <SearchIcon size={20} />
          </button>
          {(searchText || fromDate || toDate) && (
            <button
              type="button"
              onClick={() => { setSearchText(''); setFromDate(''); setToDate(''); setHasSearched(false); }}
              className="ml-1 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
              aria-label="Clear search fields"
            >
              <CancelIcon size={16} />
            </button>
          )}
        </form>
        <button
          onClick={() => setBatchSalesOpen(true)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${isDarkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-success-500 text-white hover:bg-success-600'}`}
          aria-label="Batch Sales"
        >
          Batch Sales
        </button>
      </div>
      <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Product Name</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Brand</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Unit</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Quantity Sold</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Revenue (₹)</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Sale Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Action</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}>
            {!hasSearched ? (
              <tr>
                <td colSpan={8} className={`py-16 text-center animate-fade-in align-middle ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No sales to display. Please perform a search.</td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan={8} className={`py-16 text-center animate-fade-in align-middle ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No sales found for your search.</td>
              </tr>
            ) : (
              filteredSales.map((sale, idx) => {
                const isEditing = editingIdx === idx;
                const invIdx = inventory.findIndex(i => i.id === sale.pet_food_id);
                const inv = inventory[invIdx];
                return isEditing ? (
                  <tr key={idx} className={isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {getProductName(sale.pet_food_id)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      {getProductBrand(sale.pet_food_id)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      {getProductCategory(sale.pet_food_id)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      {getProductUnit(sale.pet_food_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input type="number" min="1" value={editForm.quantity_sold} onChange={e => setEditForm(f => ({ ...f, quantity_sold: e.target.value }))} className={`w-20 rounded px-2 py-1 border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input type="number" min="0" value={editForm.revenue} onChange={e => setEditForm(f => ({ ...f, revenue: e.target.value }))} className={`w-24 rounded px-2 py-1 border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input type="date" value={editForm.sale_date} onChange={e => setEditForm(f => ({ ...f, sale_date: e.target.value }))} className={`rounded px-2 py-1 border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center relative">
                      <button className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-green-400 hover:bg-gray-600' : 'text-success-600 hover:bg-success-100'}`} title="Save" onClick={e => {
                        e.preventDefault();
                        // Calculate inventory adjustment
                        const oldQty = Number(sale.quantity_sold);
                        const newQty = Number(editForm.quantity_sold);
                        const diff = newQty - oldQty;
                        // Update salesDetails
                        setSalesDetails(prev => prev.map((s, i) => i === idx ? { ...s, ...editForm, quantity_sold: newQty, revenue: editForm.revenue, sale_date: editForm.sale_date } : s));
                        // Update inventory
                        if (invIdx !== -1) {
                          setInventory(prev => prev.map((item, i) => i === invIdx ? { ...item, stock: item.stock - diff } : item));
                        }
                        setEditingIdx(null);
                      }}>
                        <Save size={16} />
                      </button>
                      <button className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-red-400 hover:bg-gray-600' : 'text-danger-500 hover:bg-danger-100'}`} title="Cancel" onClick={e => { e.preventDefault(); setEditingIdx(null); }}>
                        <CancelIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={idx}
                    className={`transition-all duration-200 cursor-pointer ${isDarkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-50'} focus-within:ring-2 focus-within:ring-green-400`}
                    tabIndex={0}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getProductName(sale.pet_food_id)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{getProductBrand(sale.pet_food_id)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{getProductCategory(sale.pet_food_id)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{getProductUnit(sale.pet_food_id)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{sale.quantity_sold}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-green-300' : 'text-success-600'}`}>₹{Number(sale.revenue).toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sale.sale_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      <button
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                        onClick={e => {
                          e.preventDefault();
                          setEditingIdx(idx);
                          setEditForm({ quantity_sold: sale.quantity_sold, revenue: sale.revenue, sale_date: sale.sale_date });
                        }}
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                        onClick={e => {
                          e.preventDefault();
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
      <BatchSalesSidebar
        open={batchSalesOpen}
        onClose={handleBatchSalesClose}
        inventory={inventory}
        setInventory={setInventory}
        isDarkMode={isDarkMode}
        salesDetails={salesDetails}
        setSalesDetails={setSalesDetails}
      />
      {/* Toast for success */}
      {showToast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-300 ${isDarkMode ? 'bg-green-800 text-white' : 'bg-green-100 text-green-900'}`}
          style={{animation: 'fade-in .5s'}}>
          Batch sales recorded successfully!
        </div>
      )}
      {/* Delete confirmation popup */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`rounded-xl shadow-lg p-8 w-full max-w-xs text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="mb-4 text-lg font-semibold">Are you sure you want to delete this sale?</div>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleDeleteSale} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-danger-500 text-white hover:bg-danger-600'}`}>Confirm</button>
              <button onClick={handleCancelDelete} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>Cancel</button>
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