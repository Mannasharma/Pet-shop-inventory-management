const express = require("express")
const {addNewItem, getItems, bulkUpdateItems} = require("../controllers/inventoryController")

const router = express.Router()

router.get("/",getItems)
router.post("/",addNewItem)
router.patch("/",bulkUpdateItems)

module.exports = router