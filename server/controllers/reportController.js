const Sale = require("../models/Sale");
const Inventory = require("../models/inventory");

async function getReport(req, res) {
  const { id, from, to, brand, category, productName } = req.body;

  try {
    const query = {};

    // Filter by pet_food_id
    if (id) {
      query.pet_food_id = id;
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: new RegExp(brand, "i") }; // case-insensitive
    }

    // Filter by category
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    // Filter by product name
    if (productName) {
      query.product_Name = { $regex: new RegExp(productName, "i") };
    }

    // Date range filter or default to today's sales
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

