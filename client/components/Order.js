import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
var axios = require("axios");
import AddItem from "./AddItem";
import OrderService from "../Services/OrderService";

/**
 * Component corresponding to the display details of an order. Accepts the orderId as a param via react router
 */
export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {
        items: []
      },
      showAddItem: false,
      error: ""
    };
  }

  /**
   * @description Loads the order data using orderId via the OrderService
   */
  componentDidMount() {
    const orderId = this.props.match.params.orderId;
    OrderService.getOrderById(orderId)
      .then(order => {
        this.setState({
          order
        });
      })
      .catch(err => this.UNSAFE_componentWillMount.setState({ error: err }));
  }

  /**
   * @param {Object} item
   * @description increases the quantity of item provided via param
   */
  handleItemIncrease(item) {
    let currentState = this.state.order;
    //iterate through the current items and increate the quantity of item provided
    for (let i = 0; i < currentState.items.length; i++) {
      if (currentState.items[i].item._id == item.item._id) {
        currentState.items[i].qty = parseInt(currentState.items[i].qty) + 1;
      }
    }

    this.setState(
      {
        order: currentState
      },
      () => {
        this.findTotal(); //calculate the new total after increasing the quantity
        this.updateOrder(); //immediatly update the db
      }
    );
  }

  /**
   * @param {Object} item
   * @description descreases the quantity of item provided via param
   */
  handleItemDecrease(item) {
    let currentState = this.state.order;
    //iterates through the current items and decrease the quantity of corresponding item
    for (let i = 0; i < currentState.items.length; i++) {
      if (currentState.items[i].item._id == item.item._id) {
        if (parseInt(currentState.items[i].qty) > 0) {
          //only decreases if the current quantity is positive
          currentState.items[i].qty = parseInt(currentState.items[i].qty) - 1;
          //removes the item if the new quantity is zero
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
        this.findTotal(); //calculate the new total after increasing the quantity
        this.updateOrder(); //immediatly update the db
      }
    );
  }

  /**
   * @param {String} itemId
   * @description removes the item corresponding to the id provided via param
   */
  removeItem(itemId) {
    let currentOrder = this.state.order;
    let newItems = [];
    //iterate through current items and append to new array without the removing item
    for (let i of currentOrder.items) {
      if (i.item._id != itemId) {
        newItems.push(i);
      }
    }

    currentOrder.items = newItems;

    this.setState(
      {
        order: currentOrder
      },
      () => {
        this.findTotal(); //calculate the new total after increasing the quantity
        this.updateOrder(); //immediatly update the db
      }
    );
  }

  /**
   * @param {String} orderId
   * @description deletes an order corresponds to the id provided in params via the OrderService
   */
  deleteOrder(orderId) {
    OrderService.deleteOrder(orderId)
      .then(success => {
        if (success) {
          console.log("delete succesful");
        } else {
          this.setState({ error: "Error occurred in delete" });
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  /**
   * @description calculates the total price of items in order
   */
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

  /**
   * @description updates the order when a modification has happend
   */
  updateOrder() {
    //if there are items in order: update the order. Otherwise: delete the order
    if (this.state.order.items.length != 0) {
      this.findTotal();
      // axios("/updateOrder", {
      //   method: "put",
      //   headers: {
      //     Authorization: `Bearer ${localStorage.authToken}`
      //   },
      //   data: {
      //     order: this.state.order
      //   }
      // })
      //   .then(function(response) {
      //     if (response.status == 200) {
      //       console.log("update succesful");
      //     }
      //   })
      //   .catch(function(error) {
      //     this.setState({ error });
      //   });

      console.log("now updatingggggggg");
      OrderService.updateOrder(this.state.order)
        .then(success => {
          if (success == true) {
            console.log("Update successfull");
          }
        })
        .catch(err => this.setState({ error: err }));
    } else {
      this.deleteOrder(this.state.order._id);
    }
  }

  /**
   * @description toggling the add item section in order
   */
  addItemButtonHandler() {
    this.setState({
      showAddItem: !this.state.showAddItem
    });
  }

  /**
   * @param {Object} newItem
   * @description Adds the new item to order. If item is existing one: increase the count. Otherwise: add as a new item
   */
  addNewItem(newItem) {
    //if item is already existing: increase
    // else: append new one

    let currentItems = this.state.order.items;
    let alreadyExisting = false;
    for (let i = 0; i < currentItems.length; i++) {
      //if existing item, increase the count
      if (currentItems[i].item._id == newItem.item._id) {
        alreadyExisting = true;
        currentItems[i].qty =
          parseInt(currentItems[i].qty) + parseInt(newItem.qty);
        break;
      }
    }

    //if not existing, add as a new item
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
        this.findTotal(); //calculates the total price of current order
        this.updateOrder(); //updates the db immediately
      }
    );
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="container">
        {this.state.error ? (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        ) : null}
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
