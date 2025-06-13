const mongoose = require("mongoose")

async function connectMongoDB(url){
    return mongoose.connect(url).then(console.log("DB connected"))
}

module.exports = {connectMongoDB}