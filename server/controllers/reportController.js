const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

async function getReport(req,res){
// const{from,to} =req.query
const{from,to} =["2025-05-10","2025-06-30"]
    if (!from || !to) {
    return res.status(400).json({ error: "Please provide 'from' and 'to' dates." });
  }
try{

    const fromDate = new Date(from)
    const toDate = new Date(to)

    const sales = await Sale.find({date:{$gte:fromDate, $lte:toDate}})
console.log(sales)
}
catch(error){

}
}

module.exports ={
    getReport
}

