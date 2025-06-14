const mongoose = require("mongoose");

const salesSchema = mongoose.Schema(
  {
    pet_food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    quantity_sold: {
      type: Number,
      required: true,
    },
    revenue: {
      type: Number,
      required: true,
    },
    sale_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", salesSchema);
module.exports = Sale