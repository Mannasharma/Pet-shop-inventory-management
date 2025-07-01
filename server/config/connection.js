const mongoose = require("mongoose");

async function connectMongoDB(url) {
  try {
    await mongoose.connect(url);
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1); // optional: stop app if DB fails
  }
}

module.exports = { connectMongoDB };
