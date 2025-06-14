const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

async function addNewSale(req, res) {
  const entries = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    for (let item of entries) {
      const existingSale = await Sale.findOne({
        pet_food_id: item.pet_food_id,
        sale_date: item.sale_date,
      });
      if (existingSale) {
        (existingSale.quantity_sold += item.quantity_sold),
          (existingSale.revenue += item.revenue);
        await existingSale.save();
      }
      else{
        await Sale.create(item)
      }
    }

    res.status(200).json({ massage: "sale added" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  addNewSale,
};
