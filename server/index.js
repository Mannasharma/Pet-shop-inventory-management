const express = require("express")
const {connectMongoDB} = require("./config/connection")
const inventoryRouter = require("./routes/inventoryRouter")
const saleRouter = require("./routes/saleRouter")


const app = express()

connectMongoDB("mongodb://127.0.0.1:27017/petShop")

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello from server.")
})
app.use("/inventory",inventoryRouter)
app.use("/sales",saleRouter)





app.listen(4000,()=> console.log("server started at localhost 4000"))