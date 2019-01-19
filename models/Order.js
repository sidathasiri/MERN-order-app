const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Item = require("./Item");
const User = require("./User");

const orderSchema = new Schema({
  id: Number,
  user: String,
  items: [],
  price: Number,
  timestamp: String
});

module.exports = mongoose.model("Order", orderSchema);
