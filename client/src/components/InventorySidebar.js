import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

const unitOptions = ['kg', 'g', 'l', 'ml', 'pieces'];

const getDefaultDescription = (item) =>
  `Brand ${item.brand}, ${item.category} product, expires on ${item.expiry}`;

const emptyForm = {
  id: null,
  name: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  unit: unitOptions[0],
  expiry: '',
  description: ''
};

const InventorySidebar = ({ open, mode, onClose, inventory, setInventory, isDarkMode }) => {
  const [form, setForm] = useState(emptyForm);
  const [multiBatch, setMultiBatch] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm(emptyForm);
    setMultiBatch([]);
    setEditingIdx(null);
  }, [open, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  // Single add
  const handleSingleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      { key: 'name', label: 'Product Name' },
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock Qty' },
      { key: 'unit', label: 'Unit' },
      { key: 'expiry', label: 'Expiry Date' }
    ];
    const missing = requiredFields.filter(f => !form[f.key]);
    if (missing.length === 1) {
      setErrorMsg(`Please fill ${missing[0].label}`);
      return;
    } else if (missing.length > 1) {
      setErrorMsg('Please fill every field');
      return;
    }
    setInventory((prev) => [
      ...prev,
      { ...form, id: Date.now() }
    ]);
    setForm(emptyForm);
    setErrorMsg('');
    onClose();
  };

  // Multi add
  const handleMultiAdd = (e) => {
    e.preventDefault();
    const requiredFields = [
      { key: 'name', label: 'Product Name' },
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock Qty' },
      { key: 'unit', label: 'Unit' },
      { key: 'expiry', label: 'Expiry Date' }
    ];
    const missing = requiredFields.filter(f => !form[f.key]);
    if (missing.length === 1) {
      setErrorMsg(`Please fill ${missing[0].label}`);
      return;
    } else if (missing.length > 1) {
      setErrorMsg('Please fill every field');
      return;
    }
    if (editingIdx !== null) {
      setMultiBatch((prev) => prev.map((item, idx) => idx === editingIdx ? { ...form, id: item.id } : item));
      setEditingIdx(null);
    } else {
      setMultiBatch((prev) => [...prev, { ...form, id: Date.now() + Math.random() }]);
    }
    setForm(emptyForm);
    setErrorMsg('');
  };
  const handleMultiSubmit = () => {
    setInventory((prev) => [...prev, ...multiBatch]);
    setMultiBatch([]);
    setForm(emptyForm);
    onClose();
  };
  const handleEditBatch = (idx) => {
    setForm(multiBatch[idx]);
    setEditingIdx(idx);
  };
  const handleDeleteBatch = (idx) => {
    setMultiBatch((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) {
      setForm(emptyForm);
      setEditingIdx(null);
    }
  };

  return (
    <div className={`fixed inset-0 z-40 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ background: open ? 'rgba(0,0,0,0.25)' : 'transparent' }}>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md shadow-2xl transition-transform duration-300 z-50 ${open ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-white via-blue-50 to-white text-gray-900'}`}
        style={{ boxShadow: open ? 'rgba(0,0,0,0.2) 0px 0px 40px' : 'none' }}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-inherit backdrop-blur-md">
          <h2 className="text-lg font-bold">
            {mode === 'multi' ? 'Add Multiple Products' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors shadow-md">
            <X size={22} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {/* Form */}
          <form onSubmit={mode === 'multi' ? handleMultiAdd : handleSingleSubmit} className={`grid grid-cols-1 gap-4 mb-2 p-4 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'}`}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price (₹)" type="number" min="0" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Qty" type="number" min="0" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <select name="unit" value={form.unit} onChange={handleChange} className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="Expiry Date" type="date" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description (optional)" className={`rounded-lg px-4 py-2 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`} />
            <div className="flex gap-2 justify-end mt-2">
              {mode === 'multi' && (
                <button type="submit" className={`px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}>{editingIdx !== null ? <Edit2 size={16}/> : <Plus size={16}/>} {editingIdx !== null ? 'Update' : 'Add'}</button>
              )}
              {mode === 'single' && (
                <button type="submit" className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>Add Product</button>
              )}
              {mode === 'multi' && multiBatch.length > 0 && (
                <button type="button" onClick={handleMultiSubmit} className={`px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${isDarkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-success-100 text-success-700 hover:bg-success-200'}`}>Submit All ({multiBatch.length})</button>
              )}
            </div>
          </form>

          {errorMsg && (
            <div className={`mb-4 text-sm font-semibold rounded p-3 ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>{errorMsg}</div>
          )}

          {/* Divider */}
          {mode === 'multi' && multiBatch.length > 0 && <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />}

          {/* Multi-add list */}
          {mode === 'multi' && multiBatch.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Products to Add</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {multiBatch.map((item, idx) => (
                  <div key={item.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 flex flex-col shadow hover:shadow-lg transition`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditBatch(idx)} className="text-blue-400 hover:text-blue-600 p-2 rounded-full" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteBatch(idx)} className="text-red-400 hover:text-red-600 p-2 rounded-full" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{item.brand} | {item.category} | ₹{item.price} | {item.stock} {item.unit} | Exp: {item.expiry}</div>
                    {item.expiry && (
                      <div className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.description || getDefaultDescription(item)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventorySidebar; 