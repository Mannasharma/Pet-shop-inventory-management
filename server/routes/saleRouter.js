const express = require("express")
const {addNewSale} = require("../controllers/addNewsSale")

const router = express.Router()

router.post("/",addNewSale)

module.exports = router