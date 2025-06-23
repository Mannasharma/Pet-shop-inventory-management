const Inventory = require("../models/Inventory")

// Add new product.

async function addNewItem(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "No item given " });
  }
  
  try {
    const newItem = await Inventory.create(req.body);
    res.status(201).json({ message: "Item added successfully"});
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Get items.

async function getItems(req,res) {
  
  try{const items = await Inventory.find({})
  res.json(items)}
  catch(error){
    res.status(500).json({error:"something went wrong."})
  }
  
}

// update stock 

async function bulkUpdateItems(req, res) {
  const updates = req.body; // expecting an array of objects

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "No update data provided or invalid format" });
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
    res.status(500).json({ error: error.message || "Something went wrong during bulk update" });
  }
}

module.exports = {
  addNewItem,
  getItems,
  bulkUpdateItems
};
