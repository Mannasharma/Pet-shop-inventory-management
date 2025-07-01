const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

async function getReport(req, res) {
  const { id, from, to } = req.body;

  if (!id && !from && !to) {
    return res.json({ message: "No filter provided.", sales: [] });
  }

  try {
    const query = {};

    if (id) query.pet_food_id = id;

    if (from || to) {
      query.sale_date = {};
      if (from) query.sale_date.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.sale_date.$lte = toDate;
      }
    }

    const sales = await Sale.find(query).sort({ sale_date: -1 });
    res.json({ sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
module.exports ={
    getReport
}

