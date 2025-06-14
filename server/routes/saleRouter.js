const express = require("express")
const {addNewSale} = require("../controllers/addNewSale")

const router = express.Router()

router.post("/",addNewSale)

module.exports = router