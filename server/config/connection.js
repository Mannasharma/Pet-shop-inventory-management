const mongoose = require("mongoose");

async function connectMongoDB(url) {
  return mongoose
    .connect(url)
    .then(console.log("DB connected"))
    .catch((error) => console.log("something is wrong", error));
}

module.exports = { connectMongoDB };
