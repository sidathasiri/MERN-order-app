const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const itemSchema = new Schema({
  id: Number,
  name: String,
  price: Number,
  imagePath: String
});

module.exports = mongoose.model("Item", itemSchema);
