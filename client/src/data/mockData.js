// Mock data for the pet shop dashboard

export const todaySales = {
  count: 47,
  percentage: 12.5,
  trend: 'up'
};

export const todayRevenue = {
  amount: 284750,
  percentage: 8.3,
  trend: 'up'
};

export const stockAlerts = [
  {
    id: 1,
    product: 'Premium Dog Food',
    currentStock: 5,
    minStock: 10,
    category: 'Food',
    priority: 'high'
  },
  {
    id: 2,
    product: 'Cat Litter',
    currentStock: 8,
    minStock: 15,
    category: 'Hygiene',
    priority: 'medium'
  },
  {
    id: 3,
    product: 'Bird Seeds',
    currentStock: 3,
    minStock: 12,
    category: 'Food',
    priority: 'high'
  },
  {
    id: 4,
    product: 'Fish Food',
    currentStock: 6,
    minStock: 8,
    category: 'Food',
    priority: 'low'
  }
];

export const weeklyData = [
  { day: 'Mon', sales: 45, revenue: 210000 },
  { day: 'Tue', sales: 52, revenue: 240000 },
  { day: 'Wed', sales: 38, revenue: 180000 },
  { day: 'Thu', sales: 61, revenue: 290000 },
  { day: 'Fri', sales: 55, revenue: 260000 },
  { day: 'Sat', sales: 78, revenue: 370000 },
  { day: 'Sun', sales: 47, revenue: 284750 }
];

export const topSellingProducts = [
  {
    id: 1,
    name: 'Premium Dog Food',
    category: 'Food',
    sales: 156,
    revenue: 234000,
    image: '🐕'
  },
  {
    id: 2,
    name: 'Cat Litter',
    category: 'Hygiene',
    sales: 142,
    revenue: 213000,
    image: '🐱'
  },
  {
    id: 3,
    name: 'Bird Seeds',
    category: 'Food',
    sales: 98,
    revenue: 147000,
    image: '🦜'
  },
  {
    id: 4,
    name: 'Fish Food',
    category: 'Food',
    sales: 87,
    revenue: 87000,
    image: '🐠'
  },
  {
    id: 5,
    name: 'Pet Toys',
    category: 'Accessories',
    sales: 76,
    revenue: 114000,
    image: '🎾'
  }
];

export const lowStockItems = [
  {
    id: 1,
    name: 'Premium Dog Food',
    category: 'Food',
    currentStock: 5,
    minStock: 10,
    price: 1500.00,
    supplier: 'PetCo Supplies'
  },
  {
    id: 2,
    name: 'Cat Litter',
    category: 'Hygiene',
    currentStock: 8,
    minStock: 15,
    price: 1250.00,
    supplier: 'CleanPet Inc'
  },
  {
    id: 3,
    name: 'Bird Seeds',
    category: 'Food',
    currentStock: 3,
    minStock: 12,
    price: 875.00,
    supplier: 'Avian Foods'
  },
  {
    id: 4,
    name: 'Fish Food',
    category: 'Food',
    currentStock: 6,
    minStock: 8,
    price: 525.00,
    supplier: 'AquaLife'
  },
  {
    id: 5,
    name: 'Hamster Bedding',
    category: 'Hygiene',
    currentStock: 4,
    minStock: 10,
    price: 750.00,
    supplier: 'SmallPet Care'
  },
  {
    id: 6,
    name: 'Rabbit Pellets',
    category: 'Food',
    currentStock: 7,
    minStock: 12,
    price: 900.00,
    supplier: 'Bunny Basics'
  }
];

export const recentTransactions = [
  {
    id: 1,
    customer: 'John Smith',
    items: ['Premium Dog Food', 'Pet Toys'],
    total: 4500.00,
    time: '2:30 PM',
    status: 'completed'
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    items: ['Cat Litter', 'Fish Food'],
    total: 3250.00,
    time: '2:15 PM',
    status: 'completed'
  },
  {
    id: 3,
    customer: 'Mike Wilson',
    items: ['Bird Seeds'],
    total: 875.00,
    time: '2:00 PM',
    status: 'completed'
  },
  {
    id: 4,
    customer: 'Lisa Brown',
    items: ['Premium Dog Food', 'Cat Litter', 'Pet Toys'],
    total: 6750.00,
    time: '1:45 PM',
    status: 'completed'
  }
];

export const inventoryItems = [
  {
    id: 1,
    name: 'Premium Dog Food',
    brand: 'PetCo',
    category: 'Food',
    price: 1500.00,
    stock: 25,
    unit: 'kg',
    expiry: '2025-06-30'
  },
  {
    id: 2,
    name: 'Cat Litter',
    brand: 'CleanPet',
    category: 'Hygiene',
    price: 1250.00,
    stock: 40,
    unit: 'kg',
    expiry: '2026-01-15'
  },
  {
    id: 3,
    name: 'Bird Seeds',
    brand: 'Avian Foods',
    category: 'Food',
    price: 875.00,
    stock: 60,
    unit: 'kg',
    expiry: '2025-12-01'
  },
  {
    id: 4,
    name: 'Fish Food',
    brand: 'AquaLife',
    category: 'Food',
    price: 525.00,
    stock: 30,
    unit: 'g',
    expiry: '2025-09-10'
  },
  {
    id: 5,
    name: 'Hamster Bedding',
    brand: 'SmallPet Care',
    category: 'Hygiene',
    price: 750.00,
    stock: 15,
    unit: 'pack',
    expiry: '2026-03-20'
  },
  {
    id: 6,
    name: 'Rabbit Pellets',
    brand: 'Bunny Basics',
    category: 'Food',
    price: 900.00,
    stock: 22,
    unit: 'kg',
    expiry: '2025-11-05'
  },
  {
    id: 7,
    name: 'Pet Shampoo',
    brand: 'PetCo',
    category: 'Hygiene',
    price: 350.00,
    stock: 18,
    unit: 'bottle',
    expiry: '2026-07-01'
  }
];

export const salesDetails = [
  // Example entry
  // { pet_food_id: 1, quantity_sold: 2, revenue: 3000, sale_date: '2024-06-01' }
]; 