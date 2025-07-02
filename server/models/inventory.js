const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    unitOfMeasurement: {
      type: String,
      required: true,
      enum: ["kg", "l", "g", "ml", "pieces"],
    },

    stockQuantity: {
      type: Number,
      required: true,
    },

    expireDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// inventorySchema.virtual('totalValue').get(function () {
//     return this.price * this.stockQuantity;
// })

inventorySchema.set("toObject", { virtuals: true });
inventorySchema.set("toJSON", { virtuals: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
