const { getUser } = require("../services/tokenAuth");

function checkAuth(req, res, next) {
  const tokenCookie = req.cookies?.uid;
  req.user = null;
  if (!tokenCookie) {
    return next();
  }

  const token = tokenCookie;
  try {
    const user = getUser(token);
    req.user = user;
  } catch (e) {
    console.log("JWT error:", e);
  }

  return next();
}

function ristrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "no user found" });
    }
    if (!roles.includes(req.user.role)) {
      console.log("User unauthorized:", req.user);
      return res.status(403).json({ error: "User unauthorized" });
    }
    return next();
  };
}
module.exports = {
  checkAuth,
  ristrictTo,
};
