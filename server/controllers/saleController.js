const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

// Add new sale
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
            productName: item.productName,
            brand: item.brand,
            category: item.category,
            unitOfMeasurement: item.unitOfMeasurement,
          },
        },
        upsert: true,
      },
    }));

    await Sale.bulkWrite(bulkOps);

    const updateInventory = entries.map((item) => ({
      updateOne: {
        filter: { _id: item.pet_food_id },
        update: { $inc: { stockQuantity: -item.quantity_sold } },
      },
    }));

    await Inventory.bulkWrite(updateInventory);

    res.status(200).json({ message: "Sales processed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// Modify sale
async function modifySale(req, res) {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "No data provided." });
    }

    const Entries = req.body;
    const saleIds = Entries.map((entry) => entry._id.toString());
    const existingEntries = await Sale.find({ _id: { $in: saleIds } });

    if (existingEntries.length !== saleIds.length) {
      const foundIds = new Set(existingEntries.map((e) => e._id.toString()));
      const missingIds = saleIds.filter((id) => !foundIds.has(id));
      return res.status(404).json({ error: "Some sale entries not found.", missingIds });
    }

    const saleMap = new Map();
    existingEntries.forEach((entry) => {
      saleMap.set(entry._id.toString(), entry);
    });

    const changes = Entries.map((newEntry) => {
      const oldEntry = saleMap.get(newEntry._id.toString());
      const stockDiffer = newEntry.quantity_sold - oldEntry.quantity_sold;

      return {
        saleId: newEntry._id,
        pet_food_id: oldEntry.pet_food_id,
        stockDiffer,
        updatedFields: {
          quantity_sold: newEntry.quantity_sold,
          revenue: newEntry.revenue,
          productName: newEntry.productName,
          brand: newEntry.brand,
          category: newEntry.category,
          unitOfMeasurement: newEntry.unitOfMeasurement,
        },
      };
    });

    const updateSales = changes.map((change) => ({
      updateOne: {
        filter: { _id: change.saleId },
        update: { $set: change.updatedFields },
      },
    }));

    await Sale.bulkWrite(updateSales);

    const updateInventory = changes.map((change) => ({
      updateOne: {
        filter: { _id: change.pet_food_id },
        update: { $inc: { stockQuantity: -change.stockDiffer } },
      },
    }));

    await Inventory.bulkWrite(updateInventory);

    res.json({ message: "Sales updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// Get sales
async function getSales(req, res) {
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
    } else {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      query.sale_date = { $gte: startOfDay, $lte: endOfDay };
    }

    const sales = await Sale.find(query).sort({ sale_date: -1 });
    res.json({ sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}



// Delete sales
async function deleteSales(req, res) {
  try {
    const saleIds = req.body;

    if (!Array.isArray(saleIds) || saleIds.length === 0) {
      return res.status(400).json({ error: "No items selected." });
    }

    // Step 1: Fetch sales data
    const salesToDelete = await Sale.find({ _id: { $in: saleIds } });

    if (salesToDelete.length === 0) {
      return res.status(404).json({ error: "No sales found with the provided IDs." });
    }

    // Step 2: Prepare inventory update
    const inventoryUpdateMap = new Map();

    for (const sale of salesToDelete) {
      const key = sale.pet_food_id.toString();
      const currentQty = inventoryUpdateMap.get(key) || 0;
      inventoryUpdateMap.set(key, currentQty + sale.quantity_sold);
    }

    const inventoryUpdates = Array.from(inventoryUpdateMap.entries()).map(
      ([pet_food_id, quantity]) => ({
        updateOne: {
          filter: { _id: pet_food_id },
          update: { $inc: { stockQuantity: quantity } },
        },
      })
    );

    // Step 3: Apply stock restore to inventory
    await Inventory.bulkWrite(inventoryUpdates);

    // Step 4: Delete sales
    const result = await Sale.deleteMany({ _id: { $in: saleIds } });

    res.status(200).json({
      message: "Sales deleted and inventory stock restored successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting sales:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}


// Delete all sales
async function deleteAllSales(req, res) {
  try {
    const result = await Sale.deleteMany({});
    res.status(200).json({
      message: "All sales deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all sales:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

module.exports = {
  addNewSale,
  modifySale,
  getSales,
  deleteSales,
  deleteAllSales,
};
