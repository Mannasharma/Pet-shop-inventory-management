// Transform backend inventory data to frontend format
export const transformInventoryFromBackend = (backendItems) => {
  if (!Array.isArray(backendItems)) {
    console.warn(
      "Expected array in transformInventoryFromBackend, got:",
      backendItems
    );
    return [];
  }
  return backendItems.map((item) => ({
    id: item._id,
    name: item.productName,
    brand: item.brand,
    category: item.category,
    price: item.price,
    stock: item.stockQuantity,
    unit: item.unitOfMeasurement,
    expiry: item.expireDate
      ? new Date(item.expireDate).toISOString().slice(0, 10)
      : "",
    minStock: 5, // Default minimum stock
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
};

// Transform frontend inventory data to backend format
export const transformInventoryToBackend = (frontendItems) => {
  const itemsArray = Array.isArray(frontendItems)
    ? frontendItems
    : [frontendItems];

  return itemsArray.map((item) => ({
    productName: item.name,
    brand: item.brand,
    category: item.category,
    price: Number(item.price),
    stockQuantity: Number(item.stock),
    unitOfMeasurement: item.unit,
    expireDate: item.expiry ? new Date(item.expiry) : new Date(),
  }));
};

// Transform backend sales data to frontend format
export const transformSalesFromBackend = (backendSales) => {
  return backendSales.map((sale) => ({
    id: sale._id,
    pet_food_id: sale.pet_food_id,
    productName: sale.productName,
    brand: sale.brand,
    category: sale.category,
    unitOfMeasurement: sale.unitOfMeasurement,
    quantity_sold: sale.quantity_sold,
    revenue: sale.revenue,
    sale_date: sale.sale_date
      ? new Date(sale.sale_date).toISOString().slice(0, 10)
      : "",
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  }));
};

// Transform frontend sales data to backend format
export const transformSalesToBackend = (frontendSales) => {
  const salesArray = Array.isArray(frontendSales)
    ? frontendSales
    : [frontendSales];

  return salesArray.map((sale) => ({
    // Always send _id for backend updates (use id if present)
    _id: sale._id || sale.id,
    pet_food_id: sale.pet_food_id,
    productName: sale.productName,
    brand: sale.brand,
    category: sale.category,
    unitOfMeasurement: sale.unitOfMeasurement,
    quantity_sold: Number(sale.quantity_sold),
    revenue: Number(sale.revenue),
    sale_date: sale.sale_date ? new Date(sale.sale_date) : new Date(),
  }));
};

// Transform inventory update data for backend
export const transformInventoryUpdateToBackend = (frontendItem) => {
  return {
    _id: frontendItem.productId,
    productName: frontendItem.name,
    brand: frontendItem.brand,
    category: frontendItem.category,
    price: Number(frontendItem.price),
    stockQuantity: Number(frontendItem.stock),
    unitOfMeasurement: frontendItem.unit,
    expireDate: frontendItem.expiry
      ? new Date(frontendItem.expiry)
      : new Date(),
  };
};

// Helper function to convert any date string to yyyy-MM-dd
export const toInputDateString = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Returns YYYY-MM-DD for current date in IST (India Standard Time)
export function getTodayDateStringIST() {
  const now = new Date();
  // Convert to IST by adding 5.5 hours (19800000 ms)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const istDateString = istNow.toISOString().slice(0, 10);
  console.log(
    "IST Date:",
    istDateString,
    "Local Date:",
    now.toISOString().slice(0, 10)
  );
  return istDateString;
}

// Returns last 7 days range ending today in IST
export function getLast7DaysRangeIST() {
  const today = getTodayDateStringIST();
  const from = new Date(today);
  from.setDate(from.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: today,
  };
}

// Returns array of last 7 days ending today in IST
export function getLast7DaysRangeArrayIST() {
  const today = getTodayDateStringIST();
  const days = [];
  const from = new Date(today);
  from.setDate(from.getDate() - 6);

  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
