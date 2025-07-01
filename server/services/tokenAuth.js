const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET
function setUser( user) {
  return  jwt.sign({
    id:user._id,
    username:user.username,
    role:user.role
  },secret,{ expiresIn: '1d' })
}

function getUser(token) {
    if (!token) {
        return null
    }
    return jwt.verify(token,secret)
}

module.exports ={
    setUser,
    getUser,
}