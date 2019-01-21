import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
var axios = require("axios");

import ItemList from "./ItemList";

export default class AddOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      addedItems: [],
      seletedItem: {},
      seletedItemQty: 0,
      total: 0,
      toDashboard: false,
      error: "",
      selectedItemId: ""
    };

    this.findTotal = this.findTotal.bind(this);
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/getItems",
      headers: { Authorization: `Bearer ${localStorage.authToken}` }
    })
      .then(response => {
        this.setState({
          items: response.data,
          selectedItemId: response.data[0]._id
        });
      })
      .catch(err => console.log(err));
  }

  handleItemSelect(e) {
    let id = e.target.value;
    this.setState({
      seletedItem: this.state.items.filter(item => item._id == id)[0]
    });
  }

  handleQtyChange(e) {
    this.setState({
      seletedItemQty: e.target.value
    });
  }

  addItem() {
    if (parseInt(this.state.seletedItemQty) > 0) {
      let currentItems = this.state.addedItems;
      let addingItem = {
        item: this.state.seletedItem,
        qty: this.state.seletedItemQty
      };
      if (Object.keys(addingItem.item).length == 0) {
        addingItem.item = this.state.items.filter(
          item => item._id == this.state.selectedItemId
        )[0];
      }
      //if adding item exists in current items: increase
      //else add new
      let alreadyExists = false;
      for (let i = 0; i < currentItems.length; i++) {
        if (currentItems[i].item._id == addingItem.item._id) {
          alreadyExists = true;
          currentItems[i].qty =
            parseInt(currentItems[i].qty) + parseInt(addingItem.qty);
          this.setState(
            {
              addedItems: currentItems,
              error: ""
            },
            () => this.findTotal()
          );
          break;
        }
      }
      if (!alreadyExists) {
        currentItems.push(addingItem);
        this.setState(
          {
            addedItems: currentItems,
            error: ""
          },
          () => this.findTotal()
        );
      }
    } else {
      this.setState({ error: "Quantity is not valid" });
    }
  }

  submitOrder() {
    self = this;
    axios("/addOrder", {
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.authToken}`
      },
      data: {
        items: this.state.addedItems,
        total: this.state.total,
        timestamp: new Date().toString().split("GMT")[0]
      }
    })
      .then(function(response) {
        console.log(response);
        self.setState({
          toDashboard: true
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  findTotal() {
    let total = 0;
    for (let i = 0; i < this.state.addedItems.length; i++) {
      total +=
        parseInt(this.state.addedItems[i].qty) *
        parseInt(this.state.addedItems[i].item.price);
    }
    this.setState({
      total
    });
  }

  goBack() {
    let confirmation = confirm(
      "Your order is not saved!\n Are you sure you want to leave?"
    );

    if (confirmation) {
      this.setState({
        toDashboard: true
      });
    }
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="container" style={{ marginTop: 50 }}>
        {this.state.error ? (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        ) : null}
        <div className="container">
          <h1>
            Create New Order{" "}
            {/* <Link
              to="/dashboard"
              style={{ marginLeft: 640 }}
              className="btn btn-primary"
            >
              Back
            </Link> */}
            <button
              onClick={this.goBack.bind(this)}
              className="btn btn-primary"
              style={{ marginLeft: 640 }}
            >
              Back
            </button>
          </h1>
          <hr />

          <strong>Select Item:</strong>
          <select
            onChange={this.handleItemSelect.bind(this)}
            className="form-control"
            id="itemSelect"
            value={this.state.selectedItemId}
          >
            {this.state.items.map((item, index) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <strong>Quantity:</strong>
          <input
            className="form-control"
            type="number"
            placeholder="Enter Quantity"
            onChange={this.handleQtyChange.bind(this)}
            onClick={() => this.setState({ error: "" })}
          />
          <button
            className="btn btn-success"
            style={{ marginTop: 20, marginBottom: 20 }}
            onClick={this.addItem.bind(this)}
          >
            Add Item
          </button>

          <button
            disabled={this.state.addedItems.length == 0}
            className="btn btn-success"
            style={{ marginTop: 20, marginBottom: 20, marginLeft: 10 }}
            onClick={this.submitOrder.bind(this)}
          >
            Submit Order
          </button>
          <br />
          <span>
            <strong>Total:</strong>
            {this.state.total}
          </span>

          {this.state.addedItems.length > 0 ? (
            <ItemList items={this.state.addedItems} />
          ) : null}
        </div>
      </div>
    );
  }
}
