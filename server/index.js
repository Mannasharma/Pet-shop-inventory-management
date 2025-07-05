require("dotenv").config();
const express = require("express");
const { connectMongoDB } = require("./config/connection");
const inventoryRouter = require("./routes/inventoryRouter");
const saleRouter = require("./routes/saleRouter");
const userRouter = require("./routes/User");
const reportRouter = require("./routes/reportRouter");
const cookieParser = require("cookie-parser");
const { checkAuth, ristrictTo } = require("./middleware/auth");
const cluster = require("cluster");
const os = require("os");
const path = require("path");
const cors = require("cors");

const numCPUs = os.cpus().length;
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "https://pet-shop-inventory-management.onrender.com", // frontend URL
  "http://localhost:3000", // for local development
];

if (cluster.isMaster) {
  console.log(`🔧 Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart dead workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(` Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker processes share the same TCP connection

  // Connect to MongoDB
  connectMongoDB(process.env.MONGO_URI);

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(checkAuth);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  // API Routes
  app.use("/user", userRouter);
  app.use("/inventory", ristrictTo(["NORMAL", "ADMIN"]), inventoryRouter);
  app.use("/sales", ristrictTo(["NORMAL", "ADMIN"]), saleRouter);
  app.use("/report", ristrictTo(["ADMIN"]), reportRouter);

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Worker ${process.pid} started on port ${port}`);
  });
}
