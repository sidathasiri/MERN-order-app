const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);
