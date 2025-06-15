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

// async function updateItem(req, res) {
//   if (!Array.isArray(req.body) || re) {
//     return res.status(400).json({ error: "No item given " });
//   }
  
//   try {
//     const Entries = req.body
//     const itemId = Entries.map((entry) => entry._id.toString())
//     const existingItem = await Inventory.find({_id:{$in:itemId}});
//     res.status(201).json({ message: "Item added successfully"});
//   } catch (error) {
//     console.error("Error adding item:", error);
//     res.status(500).json({ error: error.message || "Something went wrong" });
//   }
// }

module.exports = {
  addNewItem,
  updateItem,
  getItems
};
