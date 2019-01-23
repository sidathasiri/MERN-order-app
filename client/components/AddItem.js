import React, { Component } from "react";
import ItemService from "../Services/ItemService";

/**
 * Component corresponding to add new item to order
 * Accepts a function as a prop to append the new item to order
 */
export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      seletedItem: {},
      seletedItemQty: 0,
      selectedItemId: "",
      error: ""
    };
  }

  componentDidMount() {
    ItemService.getItems()
      .then(items => {
        this.setState({
          items: items,
          selectedItemId: items[0]._id,
          seletedItem: items[0]
        });
      })
      .catch(err => this.setState({ error: err }));
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
   * @description adds the selected item to the order using the function provided in props
   */
  addItem() {
    if (parseInt(this.state.seletedItemQty) > 0) {
      let newItem = {
        item: this.state.seletedItem,
        qty: this.state.seletedItemQty
      };
      //check if the newItem is not empty and set item to the item object using its id
      if (Object.keys(newItem.item).length == 0) {
        newItem.item = this.state.items.filter(
          item => item._id == this.state.selectedItemId
        )[0];
      }
      this.props.addNewItem(newItem); //add item to order using the provided function
      this.setState({
        error: ""
      });
    } else {
      this.setState({
        error: "Quantity is not valid"
      });
    }
  }

  render() {
    return (
      <div className="container">
        {this.state.error ? (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        ) : null}
        <div className="container">
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
        </div>
      </div>
    );
  }
}
