import React, { Component } from "react";
var axios = require("axios");

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      seletedItem: {},
      seletedItemQty: 0
    };
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
    if (parseInt(this.state.seletedItemQty) > 0) {
      let newItem = {
        item: this.state.seletedItem,
        qty: this.state.seletedItemQty
      };
      this.props.addNewItem(newItem);
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
