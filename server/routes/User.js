const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  deleteUser,
  getUsers,
  logout,
  getCurrentUser,
} = require("../controllers/user");
const { checkAuth, ristrictTo } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", ristrictTo(["ADMIN"]), handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/", ristrictTo(["ADMIN"]), getUsers);
router.delete("/", ristrictTo(["ADMIN"]), deleteUser);
router.post("/logout", logout);
router.get("/me", checkAuth, getCurrentUser);

module.exports = router;
