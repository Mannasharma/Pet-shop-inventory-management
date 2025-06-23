const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");


// Add new sale.
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

    const updateInventory = entries.map((item) => ({
      updateOne: {
        filter: {
          _id: item.pet_food_id,
        },
        update: {
          $inc: {
            stockQuantity: -item.quantity_sold,
          },
        },
      },
    }));

    await Inventory.bulkWrite(updateInventory);
    res.status(200).json({ message: "Sales processed." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

// modify sale

async function modifySale(req, res) {
  try {
    if(!Array.isArray(req.body) || req.body.length === 0){
      res.json({error:"no data provided."})
    }
    const Entries = req.body;
    const saleId = Entries.map((entry) => entry._id.toString());
    const existingEntries = await Sale.find({ _id: { $in: saleId } });
    //check for number of new and existing entry matched.
    if (existingEntries.length !== saleId.length) {
      const foundIds = new Set(existingEntries.map((e) => e._id.toString()));
      const missingIds = saleId.filter((id) => !foundIds.has(id));

      return res.status(404).json({
        error: "Some sale entries not found in the database.",
        missingIds,
      });
    }
    const saleMap = new Map();
    existingEntries.forEach((entry) => {
      saleMap.set(entry._id.toString(), entry);
    });
    const change = Entries.map((newEntry) => {
      const oldEntry = saleMap.get(newEntry._id.toString());
      const stockDiffer = newEntry.quantity_sold-oldEntry.quantity_sold;
      const revenueDiffer = newEntry.revenue-oldEntry.revenue ;
      return {
        saleId: newEntry._id,
        pet_food_id:oldEntry.pet_food_id,
        stockDiffer,
        revenueDiffer,
        newQuantity: newEntry.quantity_sold,
        newRevenue: newEntry.revenue,
      };
    });
    const options = change.map((change)=>({
      updateOne: {
        filter: { _id: change.saleId },
        update: {
          $set: {
            quantity_sold: change.newQuantity,
            revenue: change.newRevenue,
          },
        },
      },
    }));
    await Sale.bulkWrite(options);
    
    const updateInventory = change.map((change) => ({
      updateOne: {
        filter: {
          _id: change.pet_food_id,
        },
        update: {
          $inc: {
            stockQuantity: -change.stockDiffer,
          },
        },
      },
    }));
    await Inventory.bulkWrite(updateInventory)
    res.json({ message: "sales updated" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

// check sales.
async function getSales(req,res) {
  
  try{const Sales = await Sale.find({})
  res.json(Sales)}
  catch(error){
    res.status(500).json({error:"something went wrong."})
  }
  
}

// Delete sales

async function deleteSales(req,res) {
  try{const saleId = req.body

  if(!saleId.isArray(saleId) || saleId.length === 0){
      return res.json({error:"No sale selected."})
    }

   const result = await Sale.deleteMany({_id:{$in: saleId}})

   res.status(200).json({
      message: "Items deleted successfully",
      deletedCount: result.deletedCount})}
catch (error) {
    console.error("Error deleting items:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
  
}



module.exports = {
  addNewSale,
  modifySale,
  getSales,
  deleteSales
};
