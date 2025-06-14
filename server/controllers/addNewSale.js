const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

async function addNewSale(req, res) {
  const entries = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const bulkOps = entries.map((item) => ({
      updateOne: {
        filter: { pet_food_id: item.pet_food_id, sale_date: item.sale_date },
        update: {
          $inc: {
            quantity_sold: item.quantity_sold,
            revenue: item.revenue,
          },
          $setOnInsert: {
            pet_food_id: item.pet_food_id,
            sale_date: item.sale_date,
          },
        },
        upsert: true, // creates a new document if no match is found
      },
    }));

    await Sale.bulkWrite(bulkOps);

    const updateInventory = entries.map((item) =>({
      updateOne: {
        filter: {
          _id: item.pet_food_id
        },
        update: {
          $inc: {
            stockQuantity: -item.quantity_sold
          }
        }
      }}));

    await Inventory.bulkWrite(updateInventory)
    res.status(200).json({ message: "Sales processed." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  addNewSale,
};
