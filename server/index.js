require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

const numCPUs = os.cpus().length;
const port = process.env.PORT || 5000;

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

  // Middleware
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production" ? false : "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(checkAuth);

  // API Routes
  app.use("/user", userRouter);
  app.use("/inventory", ristrictTo(["NORMAL", "ADMIN"]), inventoryRouter);
  app.use("/sales", ristrictTo(["NORMAL", "ADMIN"]), saleRouter);
  app.use("/report", ristrictTo(["ADMIN"]), reportRouter);

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "build")));
  
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Worker ${process.pid} started on port ${port}`);
  });
}
