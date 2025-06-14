const Inventory =require("../models/inventory")


async function addNewItem(req,res){
    if(!req.body){
        return res.status(400).json({error: "No item given "})
    }
    await Inventory.create({
        productName: req.body.productName,
        brand:req.body.brand,
        category:req.body.category,
        price:req.body.price,
        stockQuantity:req.body.stockQuantity,
        unitOfMeasurement:req.body.unitOfMeasurement,
        expireDate:req.body.expireDate
    })
    res.send("new iteam added successfully")

}

module.exports= {
    addNewItem,
}