const Inventory = require("../models/Inventory");

async function addNewItem(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "No item given " });
  }
  await Inventory.create(req.body);
  res.send("new iteam added successfully");
}

module.exports = {
  addNewItem,
};
