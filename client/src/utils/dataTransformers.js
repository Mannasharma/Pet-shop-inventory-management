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
    description: item.description || "",
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
    description: item.description || "",
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
    _id: sale.id || sale._id,
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
    description: frontendItem.description || "",
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
