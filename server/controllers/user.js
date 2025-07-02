const User = require("../models/User");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/tokenAuth");

async function handleUserSignup(req, res) {
  const { username, name, role, password } = req.body;

  try {
    const saltRounds = 10; // 10 is a good default
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userRole = (role || "").toUpperCase();
    await User.create({
      username,
      name,
      role: userRole,
      password: hashedPassword,
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
      sameSite: "lax",
      path: "/",
      secure: false,
      httpOnly: false,
    });

    return res.json({
      message: "Login successful",
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed." });
  }
}

async function deleteUser(req, res) {
  const username = req.body; // username should be an array

  if (!Array.isArray(username)) {
    return res
      .status(400)
      .json({ error: "username must be an array of strings" });
  }

  try {
    const result = await User.deleteMany({ username: { $in: username } });
    res.json({
      message: `${result.deletedCount} user(s) deleted`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Process failed" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({}, "username role"); // Only select username and role
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

function logout(req, res) {
  res.clearCookie("uid", { sameSite: "lax", path: "/", secure: false });
  res.json({ message: "Logged out" });
}

function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({
    username: req.user.username,
    name: req.user.name,
    role: req.user.role,
  });
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  deleteUser,
  getUsers,
  logout,
  getCurrentUser,
};
