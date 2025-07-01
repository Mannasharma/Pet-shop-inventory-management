const express = require("express")
const { handleUserSignup,handleUserLogin, deleteUser, getUsers } = require("../controllers/user")

const router = express.Router()

router.post("/signup",handleUserSignup)
router.post("/login",handleUserLogin)
router.get("/", getUsers)
router.delete("/",deleteUser)

module.exports = router