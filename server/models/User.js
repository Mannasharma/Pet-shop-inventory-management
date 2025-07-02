const mongoose = require("mongoose");

// Define Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "NORMAL",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
