const express = require("express")
const {addNewItem, getItems} = require("../controllers/inventoryController")

const router = express.Router()

router.get("/",getItems)
router.post("/",addNewItem)

module.exports = router