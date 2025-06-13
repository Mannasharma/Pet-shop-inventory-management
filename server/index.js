const express = require("express")
const {connectMongoDB} = require("./config/connection")



const app = express()

connectMongoDB("mongodb://127.0.0.1:27017/petShop")


app.get("/",(req,res)=>{
    res.send("server started")
})






app.listen(4000,()=> console.log("server started at localhost 4000"))