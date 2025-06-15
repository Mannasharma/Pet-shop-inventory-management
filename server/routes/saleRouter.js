const express = require("express")
const {addNewSale,modifySale,getSales} = require("../controllers/saleController")

const router = express.Router()
router.get("/",getSales)
router.post("/",addNewSale)
router.patch("/",modifySale)
module.exports = router