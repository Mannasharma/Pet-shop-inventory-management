const Inventory = require("../models/Inventory");

// Add new product.

async function addNewItem(req, res) {
  if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
    return res.status(400).json({ error: "No item(s) given" });
  }

  try {
    let result;
    if (Array.isArray(req.body)) {
      result = await Inventory.insertMany(req.body);
      res
        .status(201)
        .json({ message: "Items added successfully", count: result.length });
    } else {
      result = await Inventory.create(req.body);
      res.status(201).json({ message: "Item added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Get items.

async function getItems(req, res) {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "something went wrong." });
  }
}

// update stock

async function bulkUpdateItems(req, res) {
  const updates = req.body; // expecting an array of objects

  if (!Array.isArray(updates) || updates.length === 0) {
    return res
      .status(400)
      .json({ error: "No update data provided or invalid format" });
  }

  try {
    const updateResults = await Promise.all(
      updates.map(async (item) => {
        if (!item._id) {
          throw new Error("Each item must include an '_id'");
        }

        return await Inventory.findByIdAndUpdate(item._id, item, {
          new: true,
          runValidators: true,
        });
      })
    );

    res.status(200).json({
      message: "Items updated successfully",
      updatedItems: updateResults,
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({
      error: error.message || "Something went wrong during bulk update",
    });
  }
}

async function deleteProduct(req, res) {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  try {
    const result = await Inventory.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong.", details: error.message });
  }
}

module.exports = {
  addNewItem,
  getItems,
  bulkUpdateItems,
  deleteProduct,
};
