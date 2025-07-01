import React, { useState } from 'react';
import { Edit2, Trash2, Info, ShoppingCart, Plus, Save, X as XIcon, Search as SearchIcon } from 'lucide-react';
import BatchSalesSidebar from './BatchSalesSidebar';

const getDefaultDescription = (item) =>
  `Brand ${item.brand}, ${item.category} product, expires on ${item.expiry}`;

const InventoryManager = ({ isDarkMode = false, inventory, setInventory, onOpenSidebar }) => {
  const [showDescId, setShowDescId] = useState(null);
  const [showSalesId, setShowSalesId] = useState(null);
  const [salesQty, setSalesQty] = useState(1);
  // Inline edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [batchSalesOpen, setBatchSalesOpen] = useState(false);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setInventory((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Sales logic
  const handleSales = (item) => {
    setShowSalesId(item.id);
    setSalesQty(1);
  };
  const handleSalesSubmit = (item) => {
    if (salesQty > 0 && salesQty <= Number(item.stock)) {
      setInventory((prev) => prev.map((i) => i.id === item.id ? { ...i, stock: Number(i.stock) - salesQty } : i));
      setShowSalesId(null);
    }
  };

  // Inline edit handlers
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditForm({ ...item });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setInventory((prev) => prev.map((item) => item.id === editId ? { ...editForm, id: editId } : item));
    setEditId(null);
    setEditForm({});
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  // Description tooltip
  const renderDescTooltip = (item) => (
    <div className={`absolute z-40 mt-2 min-w-[180px] max-w-xs px-5 py-4 rounded-xl shadow-xl border text-sm transition-all duration-200 ${
      isDarkMode
        ? 'bg-gray-800 border-gray-700 text-gray-100'
        : 'bg-white border-gray-200 text-gray-900'
    }`} style={{ left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
      <div className="font-semibold text-base mb-1">Description</div>
      <div className="text-gray-400 text-xs mb-2">Product details</div>
      <div className={isDarkMode ? 'text-gray-200' : 'text-gray-700'} style={{overflow: 'visible', whiteSpace: 'pre-line'}}>
        {item.description || getDefaultDescription(item)}
      </div>
    </div>
  );

  // Show all products in inventory (including manually added)
  const filteredInventory = inventory.filter(item => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      String(item.price).toLowerCase().includes(q) ||
      String(item.stock).toLowerCase().includes(q) ||
      item.unit.toLowerCase().includes(q) ||
      item.expiry.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`relative rounded-xl shadow-sm border p-6 transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory</h3>
        <form className="flex items-center gap-2" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by any field..."
            className={`px-4 py-2 rounded-lg border transition-colors duration-300 w-full max-w-xs ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
            aria-label="Search"
          >
            <SearchIcon size={20} />
          </button>
        </form>
      </div>
      {/* Product List Table */}
      <div className="overflow-x-auto">
        {/* Delete confirmation popup */}
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`rounded-xl shadow-lg p-8 w-full max-w-xs text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="mb-4 text-lg font-semibold">Are you sure you want to delete this product?</div>
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={confirmDelete} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-danger-500 text-white hover:bg-danger-600'}`}>Confirm</button>
                <button onClick={cancelDelete} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Product Name</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Brand</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Price (₹)</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Stock Qty</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Unit</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Expiry Date</th>
              <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}>
            {filteredInventory.map((item) => (
              <tr key={item.id} className={`transition-all duration-300 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                {editId === item.id ? (
                  <>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><input name="name" value={editForm.name} onChange={handleEditChange} className={`rounded px-2 py-1 w-28 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="brand" value={editForm.brand} onChange={handleEditChange} className={`rounded px-2 py-1 w-20 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="category" value={editForm.category} onChange={handleEditChange} className={`rounded px-2 py-1 w-20 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="price" value={editForm.price} onChange={handleEditChange} type="number" min="0" className={`rounded px-2 py-1 w-16 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="stock" value={editForm.stock} onChange={handleEditChange} type="number" min="0" className={`rounded px-2 py-1 w-14 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="unit" value={editForm.unit} onChange={handleEditChange} className={`rounded px-2 py-1 w-14 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}><input name="expiry" value={editForm.expiry} onChange={handleEditChange} type="date" className={`rounded px-2 py-1 w-28 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}/></td>
                    <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center relative">
                      <button onClick={handleEditSave} className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-green-400 hover:bg-gray-600' : 'text-success-600 hover:bg-success-100'}`} title="Save"><Save size={16} /></button>
                      <button onClick={handleEditCancel} className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-red-400 hover:bg-gray-600' : 'text-danger-500 hover:bg-danger-100'}`} title="Cancel"><XIcon size={16} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.brand}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{item.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-green-300' : 'text-success-600'}`}>₹{Number(item.price).toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{item.stock}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.unit}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-red-300' : 'text-danger-600'}`}>{item.expiry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center relative">
                      <button onClick={() => handleDelete(item.id)} className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-red-400 hover:bg-gray-600' : 'text-danger-500 hover:bg-danger-100'}`} title="Delete"><Trash2 size={16} /></button>
                      <button onClick={() => handleEdit(item)} className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-blue-400 hover:bg-gray-600' : 'text-primary-500 hover:bg-primary-100'}`} title="Edit"><Edit2 size={16} /></button>
                      <div className="relative group">
                        <button
                          onClick={() => setShowDescId(showDescId === item.id ? null : item.id)}
                          className={`p-2 rounded transition-all duration-200 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`}
                          
                        >
                          <Info size={16} />
                        </button>
                        {showDescId === item.id && renderDescTooltip(item)}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredInventory.length === 0 && (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <p>No inventory items found.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManager; 