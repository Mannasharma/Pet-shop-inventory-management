const express = require("express")
const {addNewItem, getItems, bulkUpdateItems, deleteProduct} = require("../controllers/inventoryController")

const router = express.Router()

router.get("/",getItems)
router.post("/",addNewItem)
router.patch("/",bulkUpdateItems)
router.delete("/",deleteProduct)

module.exports = router