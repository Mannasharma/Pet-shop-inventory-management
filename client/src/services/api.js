const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Inventory API functions
export const inventoryAPI = {
  // Get all inventory items
  getAll: async () => {
    return apiRequest("/inventory");
  },

  // Add new inventory item(s)
  add: async (items) => {
    return apiRequest("/inventory", {
      method: "POST",
      body: JSON.stringify(items),
    });
  },

  // Update inventory items (bulk)
  update: async (updates) => {
    return apiRequest("/inventory", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Delete inventory item
  delete: async (productId) => {
    return apiRequest("/inventory", {
      method: "DELETE",
      body: JSON.stringify({ productId }),
    });
  },
};

// Sales API functions
export const salesAPI = {
  // Get sales with optional filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = queryParams.toString()
      ? `/sales?${queryParams.toString()}`
      : "/sales";
    return apiRequest(url, {
      method: "GET",
    });
  },

  // Add new sale(s)
  add: async (sales) => {
    return apiRequest("/sales", {
      method: "POST",
      body: JSON.stringify(sales),
    });
  },

  // Update sale(s)
  update: async (sales) => {
    return apiRequest("/sales", {
      method: "PATCH",
      body: JSON.stringify(sales),
    });
  },

  // Delete sale(s)
  delete: async (saleIds) => {
    return apiRequest("/sales", {
      method: "DELETE",
      body: JSON.stringify(saleIds),
    });
  },
};

// Reports API functions
export const reportsAPI = {
  // Get reports data
  getReports: async (filters = {}) => {
    return apiRequest("/report", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  },
};

// Error handling utility
export const handleAPIError = (error, fallbackData = []) => {
  console.error("API Error:", error);
  // You can add toast notifications here
  return fallbackData;
};
