const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to Database");
};
module.exports = dbConnect;
