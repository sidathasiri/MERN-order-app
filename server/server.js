var express = require("express");
var router = require("./routes/routes.js");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client"));
app.use(express.static(path.join(__dirname, "../client")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

mongoose.connect(
  "mongodb://sidathasiri:sidath1994@ds143181.mlab.com:43181/order_app",
  { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to database!");
});

app.use("/", router);

var port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
