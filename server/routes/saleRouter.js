const express = require("express");
const {
  addNewSale,
  modifySale,
  getSales,
  deleteSales,
} = require("../controllers/saleController");

const router = express.Router();
router.get("/", getSales);
router.post("/", addNewSale);
router.patch("/", modifySale);
router.delete("/", deleteSales);
module.exports = router;
