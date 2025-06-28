const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

async function getReport(req,res){
const{from,to} =req.query

    if (!from || !to) {
    return res.status(400).json({ error: "Please provide 'from' and 'to' dates." });
  }
try{

    const fromDate = new Date(from)
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999);


    const sales = await Sale.find({sale_date:{$gte:fromDate, $lte:toDate}})
    console.log(sales)
    res.status(200).json({ message: "Check console for output" });
}
catch(error){
console.error("Error fetching sales:", error);
  res.status(500).json({ error: "Something went wrong" });
}
}

module.exports ={
    getReport
}

