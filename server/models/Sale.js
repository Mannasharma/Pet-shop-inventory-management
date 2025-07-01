const mongoose = require("mongoose");

const salesSchema = mongoose.Schema(
  {
    pet_food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    productName:{
        type:String,
        required : true
    },
    brand:{
        type: String,
        required: true
    },

    category:{
        type:String,
        required : true
    },
    unitOfMeasurement:{
        type: String,
        required : true,
        enum: ["kg", "liters", "g", "ml", "pieces"]
    },
    quantity_sold: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },
    revenue: {
      type: Number,
      required: true,
      min: [0, "revenue cannot be negative"]
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