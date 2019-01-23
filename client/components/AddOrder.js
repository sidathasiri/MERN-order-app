import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import ItemList from "./ItemList";
import ItemService from "../Services/ItemService";
import OrderService from "../Services/OrderService";

/**
 * Component corresponding to the adding new order
 */
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
    ItemService.getItems().then(items => {
      this.setState({
        items: items,
        selectedItemId: items[0]._id
      });
    });
  }

  /**
   * @param {event} e
   * @description updates the state with the selected item id and item object when changing in dropdown
   */
  handleItemSelect(e) {
    let id = e.target.value;
    this.setState({
      seletedItem: this.state.items.filter(item => item._id == id)[0],
      selectedItemId: id
    });
  }

  /**
   * @param {event} e
   * @description updates the state when changing the quantity in the input field
   */
  handleQtyChange(e) {
    this.setState({
      seletedItemQty: e.target.value
    });
  }

  /**
   * @description Adds new item to the order
   */
  addItem() {
    //only add if the adding quantity of item is within the validated range
    if (parseInt(this.state.seletedItemQty) > 0) {
      let currentItems = this.state.addedItems;
      let addingItem = {
        item: this.state.seletedItem,
        qty: this.state.seletedItemQty
      };
      //check if the addingItem is not empty and set item to the item object using its id
      if (Object.keys(addingItem.item).length == 0) {
        addingItem.item = this.state.items.filter(
          item => item._id == this.state.selectedItemId
        )[0];
      }

      //if adding item is already existing in current items: increase its quantity
      let alreadyExists = false;
      for (let i = 0; i < currentItems.length; i++) {
        if (currentItems[i].item._id == addingItem.item._id) {
          alreadyExists = true;
          currentItems[i].qty =
            parseInt(currentItems[i].qty) + parseInt(addingItem.qty); //increasing existing count
          this.setState(
            {
              addedItems: currentItems,
              error: ""
            },
            () => this.findTotal() //calculate new total after updating state
          );
          break;
        }
      }
      //if adding item not is not existing in current items: add as a new item
      if (!alreadyExists) {
        currentItems.push(addingItem);
        this.setState(
          {
            addedItems: currentItems,
            error: ""
          },
          () => this.findTotal() //calculate new total after updating state
        );
      }
    } else {
      this.setState({ error: "Quantity is not valid" });
    }
  }

  /**
   * @description Submits the created ordered
   */
  submitOrder() {
    let order = {
      items: this.state.addedItems,
      total: this.state.total,
      timestamp: new Date().toString().split("GMT")[0]
    };
    //requests the OrderService to add the order to db
    OrderService.addOrder(order)
      .then(result => {
        if (result == true) {
          this.setState({
            toDashboard: true //if adding is succesful, update state to redirect to the dashboard
          });
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  /**
   * @description Calculate the total cost of the current order
   */
  findTotal() {
    let total = 0;

    //iterate through the items in order and calculate total price (total price = item_price * quantity)
    for (let i = 0; i < this.state.addedItems.length; i++) {
      total +=
        parseInt(this.state.addedItems[i].qty) *
        parseInt(this.state.addedItems[i].item.price);
    }
    this.setState({
      total
    });
  }

  /**
   * @description go back to the dashboard when user confirms
   */
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
