import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { inventoryItems } from '../data/mockData';

const unitOptions = ['kg', 'g', 'l', 'ml', 'pieces'];

const emptySale = {
  pet_food_id: '',
  quantity_sold: '',
  revenue: '',
  sale_date: new Date().toISOString().slice(0, 10),
  product_search: '',
  expiry: '',
  unit: '',
};

const BatchSalesSidebar = ({ open, onClose, inventory, setInventory, isDarkMode, salesDetails, setSalesDetails }) => {
  const [form, setForm] = useState({ ...emptySale });
  const [batch, setBatch] = useState([]);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const searchRef = useRef();
  const isInventoryEmpty = inventory.length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'product_search') setActiveDropdown(true);
  };

  const handleSelectProduct = (item) => {
    setForm((prev) => ({ ...prev, pet_food_id: item.id, product_search: item.name, expiry: item.expiry, unit: item.unit }));
    setActiveDropdown(false);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    setError('');
    if (!form.pet_food_id || !form.quantity_sold || !form.revenue || !form.sale_date) {
      setError('All fields are required.');
      return;
    }
    const inv = inventory.find(i => i.id === Number(form.pet_food_id));
    if (!inv) {
      setError('Invalid product selected.');
      return;
    }
    if (Number(form.quantity_sold) > Number(inv.stock)) {
      setError('Cannot sell more than available stock.');
      return;
    }
    if (editingIdx !== null) {
      setBatch(prev => prev.map((row, i) => i === editingIdx ? { ...form } : row));
      setEditingIdx(null);
    } else {
      setBatch(prev => [...prev, { ...form }]);
    }
    setForm({ ...emptySale });
  };

  const handleEdit = (idx) => {
    setForm({ ...batch[idx] });
    setEditingIdx(idx);
  };

  const handleDelete = (idx) => {
    setBatch(prev => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) {
      setForm({ ...emptySale });
      setEditingIdx(null);
    }
  };

  const handleSubmitAll = () => {
    // Validate all
    for (const row of batch) {
      if (!row.pet_food_id || !row.quantity_sold || !row.revenue || !row.sale_date) {
        setError('All fields are required.');
        return;
      }
      const inv = inventory.find(i => i.id === Number(row.pet_food_id));
      if (!inv) {
        setError('Invalid product selected.');
        return;
      }
      if (Number(row.quantity_sold) > Number(inv.stock)) {
        setError('Cannot sell more than available stock.');
        return;
      }
    }
    // Update inventory
    setInventory(prev => prev.map(item => {
      const sale = batch.find(row => Number(row.pet_food_id) === item.id);
      if (sale) {
        return { ...item, stock: Number(item.stock) - Number(sale.quantity_sold) };
      }
      return item;
    }));
    // Update salesDetails using setSalesDetails
    setSalesDetails(prev => [
      ...prev,
      ...batch.map(row => ({
        pet_food_id: Number(row.pet_food_id),
        quantity_sold: Number(row.quantity_sold),
        revenue: Number(row.revenue),
        sale_date: row.sale_date,
      }))
    ]);
    setBatch([]);
    setForm({ ...emptySale });
    setEditingIdx(null);
    onClose();
  };

  // Filter products for autocomplete
  const getFilteredProducts = (search) => {
    const q = search.toLowerCase();
    return inventory.filter(item => item.name.toLowerCase().includes(q));
  };

  return (
    <div className={`fixed inset-0 z-40 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ background: open ? 'rgba(0,0,0,0.25)' : 'transparent' }}>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md shadow-2xl transition-transform duration-300 z-50 ${open ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-l-2xl`}
        style={{ boxShadow: open ? 'rgba(0,0,0,0.2) 0px 0px 40px' : 'none' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-inherit backdrop-blur-md rounded-t-2xl">
          <h2 className="text-xl font-bold">Add Multiple Products</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors shadow-md">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] flex flex-col gap-4">
          {/* Carded Form */}
          <form onSubmit={handleAddOrUpdate} className={`w-full rounded-xl shadow-lg p-5 mb-4 ${isDarkMode ? 'bg-gray-800/90' : 'bg-gray-100'}`}>
            <div className="flex flex-col gap-3">
              <input
                id="product_search"
                name="product_search"
                value={form.product_search}
                onChange={handleChange}
                placeholder="Product Name"
                autoComplete="off"
                className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                onFocus={() => setActiveDropdown(true)}
                ref={searchRef}
                disabled={isInventoryEmpty}
              />
              {activeDropdown && getFilteredProducts(form.product_search || '').length > 0 && (
                <div className={`absolute z-50 mt-1 w-full rounded-lg shadow-lg max-h-56 overflow-auto ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-gray-200 border border-gray-300 text-gray-900'}`}>
                  {getFilteredProducts(form.product_search || '').map(item => (
                    <div
                      key={item.id}
                      className={`px-6 py-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
                      onClick={() => handleSelectProduct(item)}
                    >
                      {item.name} (Stock: {item.stock})
                    </div>
                  ))}
                </div>
              )}
              <input
                id="quantity_sold"
                name="quantity_sold"
                value={form.quantity_sold}
                onChange={handleChange}
                placeholder="Stock Qty"
                type="number"
                min="1"
                className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                disabled={isInventoryEmpty}
              />
              <input
                id="revenue"
                name="revenue"
                value={form.revenue}
                onChange={handleChange}
                placeholder="Price (₹)"
                type="number"
                min="0"
                className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                disabled={isInventoryEmpty}
              />
              <input
                id="sale_date"
                name="sale_date"
                value={form.sale_date}
                onChange={handleChange}
                type="date"
                className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                disabled={isInventoryEmpty}
              />
              <div className="flex gap-2">
                <input
                  id="unit"
                  name="unit"
                  value={form.unit}
                  readOnly
                  disabled
                  className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 bg-gray-200 text-gray-500 cursor-not-allowed ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-200 border-gray-300 text-gray-500'}`}
                  placeholder="Unit"
                />
                <input
                  id="expiry"
                  name="expiry"
                  value={form.expiry}
                  type="date"
                  readOnly
                  disabled
                  className={`rounded-lg px-4 py-3 text-base border w-full transition-colors duration-300 bg-gray-200 text-gray-500 cursor-not-allowed ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-200 border-gray-300 text-gray-500'}`}
                  placeholder="Expiry Date"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2" disabled={isInventoryEmpty}>
                  {editingIdx !== null ? <Edit2 size={18}/> : <Plus size={18}/>} {editingIdx !== null ? 'Update' : 'Add'}
                </button>
                {batch.length > 0 && (
                  <button type="button" onClick={handleSubmitAll} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2" disabled={isInventoryEmpty}>
                    Submit All ({batch.length})
                  </button>
                )}
              </div>
              {error && <div className="text-red-500 text-base mt-2">{error}</div>}
            </div>
            {isInventoryEmpty && (
              <div className={`mt-4 text-center text-base font-semibold rounded p-3 ${isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700'}`}>Please add at least 1 product in the inventory.</div>
            )}
          </form>
          {/* Divider */}
          <hr className="my-2 border-gray-700" />
          {/* Batch List */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Products to Add</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {batch.map((item, idx) => {
                const inv = inventory.find(i => i.id === Number(item.pet_food_id));
                return (
                  <div key={idx} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 flex flex-col shadow hover:shadow-lg transition`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{inv ? inv.name : item.product_search}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(idx)} className="text-blue-400 hover:text-blue-600 p-2 rounded-full" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(idx)} className="text-red-400 hover:text-red-600 p-2 rounded-full" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      {inv ? inv.brand : ''} | {inv ? inv.category : ''} | ₹{item.revenue} | {item.quantity_sold} {inv ? inv.unit : ''} | Exp: {item.expiry || inv?.expiry || '-'}
                    </div>
                    {inv && (item.expiry || inv.expiry) && (
                      <div className="text-xs mt-1 font-medium text-black">
                        Brand {inv.brand}, 1 product, expires on {(item.expiry || inv.expiry)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchSalesSidebar; 