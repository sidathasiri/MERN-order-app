import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
      toDashboard: false
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
          items: response.data
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
    let currentItems = this.state.addedItems;
    let addingItem = {
      item: this.state.seletedItem,
      qty: this.state.seletedItemQty
    };
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
            addedItems: currentItems
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
          addedItems: currentItems
        },
        () => this.findTotal()
      );
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

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="container">
        <strong>Select Item:</strong>
        <select
          onChange={this.handleItemSelect.bind(this)}
          className="form-control"
          id="itemSelect"
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
    );
  }
}
