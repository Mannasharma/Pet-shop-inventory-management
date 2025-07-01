const {getUser}=require("../services/tokenAuth")

function checkAuth(req,res,next) {
    const tokenCookie = req.cookies?.uid
    req.user=null
    if (!tokenCookie) return next()
    

    const token = tokenCookie
    const user = getUser(token)
    req.user = user
    
    return next()

}

function ristrictTo(roles=[]) {
    return function (req,res, next){
        if(!req.user) return res.json({error:"no user found"})
        if(!roles.includes(req.user.role)) return res.json({error:"User unauthorized"})
            return next()
    }
    
}
module.exports={
    checkAuth,
    ristrictTo
}