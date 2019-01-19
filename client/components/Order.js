import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
var axios = require("axios");
import AddItem from "./AddItem";
import { resolve, reject } from "q";

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {
        items: []
      },
      isItemsChanged: false,
      toDashboard: false,
      showAddItem: false
    };
  }

  getOrder(orderId) {
    axios({
      method: "get",
      url: `/getOrder/${orderId}`,
      headers: { Authorization: `Bearer ${localStorage.authToken}` }
    }).then(response => {
      console.log("fetched order");
      console.log(response.data);
      this.setState({
        order: response.data
      });
    });
  }

  componentDidMount() {
    const orderId = this.props.match.params.orderId;
    this.getOrder(orderId);
  }

  handleItemIncrease(item) {
    this.setState({
      isItemsChanged: true
    });
    let currentState = this.state.order;
    console.log(item);
    for (let i = 0; i < currentState.items.length; i++) {
      if (currentState.items[i].item._id == item.item._id) {
        currentState.items[i].qty = parseInt(currentState.items[i].qty) + 1;
      }
    }

    this.setState(
      {
        order: currentState
      },
      () => this.findTotal()
    );
  }

  handleItemDecrease(item) {
    this.setState({
      isItemsChanged: true
    });
    let currentState = this.state.order;
    for (let i = 0; i < currentState.items.length; i++) {
      if (currentState.items[i].item._id == item.item._id) {
        if (parseInt(currentState.items[i].qty) > 0) {
          currentState.items[i].qty = parseInt(currentState.items[i].qty) - 1;
          if (currentState.items[i].qty == 0) {
            this.removeItem(currentState.items[i].item._id);
          }
        }
      }
    }
    this.setState(
      {
        order: currentState
      },
      () => {
        this.findTotal();
      }
    );
  }

  removeItem(itemId) {
    let currentOrder = this.state.order;
    let newItems = [];
    for (let i of currentOrder.items) {
      if (i.item._id != itemId) {
        newItems.push(i);
      }
    }

    currentOrder.items = newItems;

    this.setState(
      {
        order: currentOrder,
        isItemsChanged: true
      },
      () => {
        this.findTotal();
      }
    );
  }

  deleteOrder(orderId) {
    console.log(orderId);
    return new Promise((resolve, reject) => {
      axios
        .delete("/deleteOrder/" + orderId, {
          headers: { Authorization: `Bearer ${localStorage.authToken}` }
        })
        .then(response => {
          if (response.status == 200) {
            console.log("deleted succesfully");
            resolve(true);
          } else {
            reject(false);
            alert("Error occurred in delete");
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  findTotal() {
    let total = 0;
    for (let i of this.state.order.items) {
      total += parseInt(i.qty) * parseInt(i.item.price);
    }
    let currentOrder = this.state.order;
    currentOrder.price = total;
    this.setState({
      order: currentOrder
    });
  }

  updateOrder() {
    self = this;
    if (this.state.order.items.length != 0) {
      this.findTotal();
      console.log("inside update");
      console.log(this.state);
      axios("/updateOrder", {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`
        },
        data: {
          order: this.state.order
        }
      })
        .then(function(response) {
          console.log(response);
          if (response.status == 200) {
            self.setState({
              toDashboard: true
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.deleteOrder(this.state.order._id).then(success => {
        if (success) {
          self.setState({
            toDashboard: true
          });
        }
      });
    }
  }

  addItemButtonHandler() {
    this.setState({
      showAddItem: !this.state.showAddItem
    });
  }

  addNewItem(newItem) {
    //if item is already existing: increase
    // else: append new one

    let currentItems = this.state.order.items;
    console.log(currentItems);
    let alreadyExisting = false;
    for (let i = 0; i < currentItems.length; i++) {
      if (currentItems[i].item._id == newItem.item._id) {
        alreadyExisting = true;
        currentItems[i].qty =
          parseInt(currentItems[i].qty) + parseInt(newItem.qty);
        break;
      }
    }

    if (!alreadyExisting) {
      currentItems.push(newItem);
    }

    let curretOrder = this.state.order;
    curretOrder.items = currentItems;
    this.setState(
      {
        order: curretOrder
      },
      () => {
        this.findTotal();
        this.setState({
          isItemsChanged: true
        });
      }
    );
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="container">
        <Link
          className="btn btn-primary"
          style={{ marginTop: 20, marginBottom: 20, marginLeft: 1040 }}
          to={"/dashboard"}
        >
          Back
        </Link>
        {this.state.showAddItem ? (
          <div className="container">
            <AddItem addNewItem={this.addNewItem.bind(this)} />
          </div>
        ) : null}
        <div className="jumbotron">
          <div className="row" style={{ paddingLeft: 820 }}>
            <button
              className="btn btn-warning"
              style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
              onClick={this.addItemButtonHandler.bind(this)}
            >
              {this.state.showAddItem ? "Close Add Item" : "Add Item"}
            </button>
            {this.state.isItemsChanged ? (
              <button
                onClick={this.updateOrder.bind(this)}
                className="btn btn-success"
                style={{ height: 40, marginTop: 20, marginBottom: 20 }}
              >
                Update
              </button>
            ) : null}
          </div>
          <h1>Order ID: {this.state.order._id}</h1>
          <h3>Total Price: {this.state.order.price}</h3>
          <p>Placed on: {this.state.order.timestamp}</p>
          <hr />
          <div style={{ display: "flex", flexDirection: "row" }}>
            {this.state.order.items.map(item => {
              return (
                <div
                  key={item.item._id}
                  className="card"
                  style={{ width: 250, height: "auto", marginRight: 30 }}
                >
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={this.removeItem.bind(this, item.item._id)}
                  >
                    X
                  </button>
                  <img
                    className="card-img-top"
                    src={item.item.imagePath}
                    alt="Card image cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <strong>Name:</strong>
                      {item.item.name}
                    </h5>
                    <h5 className="card-title">
                      <strong>Quantity: {item.qty}</strong>
                    </h5>
                    <h5 className="card-title">
                      <strong> Item Price:</strong>
                      {item.item.price}
                    </h5>
                    <hr />
                    <button
                      onClick={this.handleItemIncrease.bind(this, item)}
                      style={{ marginRight: 10 }}
                      className="btn btn-success"
                    >
                      +
                    </button>
                    <button
                      onClick={this.handleItemDecrease.bind(this, item)}
                      className="btn btn-danger"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
