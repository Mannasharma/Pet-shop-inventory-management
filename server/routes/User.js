const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  deleteUser,
  getUsers,
  logout,
  getCurrentUser,
} = require("../controllers/user");
const { checkAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/", getUsers);
router.delete("/", deleteUser);
router.post("/logout", logout);
router.get("/me", checkAuth, getCurrentUser);

module.exports = router;
