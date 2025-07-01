const User = require("../models/User")
const bcrypt = require("bcrypt")
const { setUser } =require("../services/tokenAuth")

async function handleUserSignup(req, res) {
  const { username, role, password } = req.body;

  try {
    const saltRounds = 10; // 10 is a good default
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      username,
      role,
      password: hashedPassword
    });

    return res.json({ message: "Signup successful." });
  } catch (error) {
    return res.status(500).json({ error: "Signup failed." });
  }
}

async function handleUserLogin(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ error: "Invalid Username or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ error: "Invalid Username or Password" });
    }

    const token = setUser(user); // e.g., create JWT
    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "strict"
    });

    return res.json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: "Login failed." });
  }
}
async function deleteUser(req, res) {
  const username  = req.body; // username should be an array

  if (!Array.isArray(username)) {
    return res.status(400).json({ error: "username must be an array of strings" });
  }

  try {
    const result = await User.deleteMany({ username: { $in: username } });
    res.json({
      message: `${result.deletedCount} user(s) deleted`
    });
  } catch (error) {
    return res.status(500).json({ error: "Process failed" });
  }
}


module.exports={
handleUserSignup,
handleUserLogin,
deleteUser 
}