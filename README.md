# Pet Shop Inventory Management System

A full-stack web application for managing pet shop inventory, sales, and analytics with real-time data synchronization.

## 🚀 Features

- **Dashboard**: Real-time analytics with revenue tracking, stock alerts, and performance metrics
- **Inventory Management**: CRUD operations for products with bulk import/export
- **Sales Management**: Record individual and batch sales with automatic stock updates
- **Reports & Analytics**: Comprehensive reporting with date filtering and export capabilities
- **Modern UI**: Responsive design with dark/light theme toggle
- **Real-time Data**: Live updates across all components

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
petshop-inventory-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── utils/          # Data transformers
│   │   └── data/           # Mock data
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── config/            # Database configuration
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the server directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/petshop
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🔌 API Integration

### Recent Changes (Data Persistence Fix)

The system has been updated to use real API calls instead of localStorage:

#### ✅ What's Fixed:

- **Inventory Management**: All CRUD operations now use backend API
- **Sales Management**: Sales recording and updates use backend API
- **Data Synchronization**: Real-time data updates across components
- **Error Handling**: Proper error handling for API failures

#### 🔧 Key Components Updated:

1. **API Service Layer** (`client/src/services/api.js`)

   - Centralized API communication
   - Error handling and response processing
   - Support for all CRUD operations

2. **Data Transformers** (`client/src/utils/dataTransformers.js`)

   - Transform data between frontend and backend formats
   - Handle schema differences
   - Date formatting utilities

3. **App.js**

   - Replaced localStorage functions with API calls
   - Added proper error handling
   - Real-time data fetching

4. **Components Updated**:
   - `InventoryManager.js` - Uses API for inventory operations
   - `SalesDetails.js` - Uses API for sales operations
   - `BatchSalesSidebar.js` - Uses API for batch sales

### API Endpoints

#### Inventory

- `GET /inventory` - Get all inventory items
- `POST /inventory` - Add new inventory item(s)
- `PATCH /inventory` - Update inventory items (bulk)
- `DELETE /inventory` - Delete inventory item

#### Sales

- `GET /sales` - Get sales with optional filters
- `POST /sales` - Add new sale(s)
- `PATCH /sales` - Update sale(s)
- `DELETE /sales` - Delete sale(s)

#### Reports

- `POST /report` - Get reports data

## 🗄️ Database Schema

### Inventory Collection

```javascript
{
  productName: String (required),
  description: String,
  brand: String (required),
  category: String (required),
  price: Number (required),
  unitOfMeasurement: String (enum: kg, liters, g, ml, packs),
  stockQuantity: Number (required),
  expireDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection

```javascript
{
  pet_food_id: ObjectId (ref: Inventory),
  productName: String,
  brand: String,
  category: String,
  unitOfMeasurement: String,
  quantity_sold: Number,
  revenue: Number,
  sale_date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection

```javascript
{
  username: String (unique),
  role: String (NORMAL/ADMIN),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Usage

### Dashboard

- View real-time revenue metrics
- Monitor stock alerts
- Analyze weekly sales trends
- Track top-selling products

### Inventory Management

- Add single or multiple products
- Update product details
- Monitor stock levels
- Set expiry date tracking

### Sales Management

- Record individual sales
- Process batch sales
- View sales history
- Filter sales by date/product

### Reports

- Generate sales reports
- Export data
- Analyze performance metrics

## 🔒 Authentication & Security

- JWT-based authentication
- Role-based access control (NORMAL/ADMIN)
- Password hashing with bcrypt
- CORS configuration for security

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **API Connection Error**

   - Ensure backend server is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

3. **Data Not Loading**
   - Check browser console for errors
   - Verify API responses
   - Check network tab for failed requests

### Development Tips

- Use browser dev tools to monitor API calls
- Check server logs for backend errors
- Use MongoDB Compass for database inspection
- Enable React DevTools for component debugging

## 📝 Future Enhancements

- [ ] User authentication UI
- [ ] Advanced reporting features
- [ ] Email notifications for low stock
- [ ] Barcode scanning integration
- [ ] Mobile app development
- [ ] Multi-store support
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This system is now fully integrated with the backend API, providing real-time data persistence and proper error handling. The localStorage dependency has been completely removed, ensuring data consistency and reliability.
