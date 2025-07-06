const express = require("express");
const {
  addNewSale,
  modifySale,
  getSales,
  deleteSales,
  deleteAllSales,
} = require("../controllers/saleController");

const router = express.Router();
router.get("/", getSales);
router.post("/", addNewSale);
router.patch("/", modifySale);
router.delete("/", deleteSales);
router.delete("/all", deleteAllSales);
module.exports = router;
