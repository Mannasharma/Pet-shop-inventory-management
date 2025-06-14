const express = require("express")
const {addNewItem} = require("../controllers/addNewItem")

const router = express.Router()

router.post("/",addNewItem)

module.exports = router