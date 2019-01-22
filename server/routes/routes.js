var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var passwordHash = require("password-hash");

var User = require("../../models/User");
var Item = require("../../models/Item");
var Order = require("../../models/Order");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
      res.send({
        error: "Server Error! Try again later"
      });
    } else {
      if (user) {
        console.log("User already exists!");
        res.send({
          error: "User already exists!"
        });
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = passwordHash.generate(password);
        newUser.save((err, user) => {
          if (err) {
            console.log(err);
            res.send({
              error: "Server Error! Try again later"
            });
          } else {
            console.log(`User saved`);
            jwt.sign({ email: newUser.email }, "secret", function(err, token) {
              if (err) {
                console.log(err);
                res.send({ error: "Server Error! Try again later" });
              } else {
                console.log(token);
                res.send({ token });
              }
            });
          }
        });
      }
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
      res.send({ error: "Server Error! Try again later" });
    } else {
      if (user) {
        console.log(user);
        if (passwordHash.verify(password, user.password)) {
          jwt.sign({ email: user.email }, "secret", function(err, token) {
            if (err) {
              console.log(err);
              res.send({ error: "Server Error! Try again later" });
            } else {
              console.log(token);
              res.send({ token });
            }
          });
        } else {
          console.log("wrong username or password");
          res.send({ error: "Wrong email or password!" });
        }
      } else {
        console.log("wrong username or password");
        res.send({ error: "Wrong email or password!" });
      }
    }
  });
});

router.get("/getOrders", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      Order.find({ user: user.email }, (err, orders) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.send(orders);
        }
      });
    }
  });
});

router.get("/getOrder/:id", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      Order.findOne({ _id: req.params.id }, (err, order) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.send(order);
        }
      });
    }
  });
});

router.get("/getItem/:id", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      Item.findOne({ _id: req.params.id }, (err, item) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.send(item);
        }
      });
    }
  });
});

router.get("/getItems", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      Item.find({}, (err, items) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.send(items);
        }
      });
    }
  });
});

router.post("/addOrder", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      const order = req.body;
      const newOrder = {
        user: user.email,
        items: order.items,
        price: order.total,
        timestamp: order.timestamp
      };
      const addingOrder = new Order(newOrder);
      addingOrder.save((err, order) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.send(order);
        }
      });
    }
  });
});

router.delete("/deleteOrder/:orderId", checkToken, (req, res, next) => {
  const id = req.params.orderId;
  jwt.verify(req.token, "secret", (err, user) => {
    if (err) {
      console.log("Access denied! " + err);
      next(err);
    } else {
      Order.deleteOne({ _id: id }, err => {
        if (err) {
          res.send(err);
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

router.put("/updateOrder", checkToken, (req, res) => {
  let newOrder = req.body.order;
  Order.findOne({ _id: newOrder._id }, (err, order) => {
    order.items = newOrder.items;
    order.price = newOrder.price;
    order.save((err, updatedOrder) => {
      if (err) res.send(err);
      else {
        res.sendStatus(200);
      }
    });
  });
});

function checkToken(req, res, next) {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    throw new Error("Acess denied! Please login again");
  }
}

module.exports = router;
