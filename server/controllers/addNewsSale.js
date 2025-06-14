const Sale = require("../models/Sale")
const Inventory = require("../models/Inventory")

async function addNewSale(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "No item given " });
  }
  await Sale.create({
    pet_food_id: req.body.pet_food_id,
    quantity_sold: req.body.quantity_sold,
    total_revenue: req.body.total_revenue,
    sale_date: req.body.sale_date,
  });
  res.send("new Sale added successfully");
}

module.exports = {
  addNewSale,
};
