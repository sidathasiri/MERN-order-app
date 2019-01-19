import React, { Component } from "react";

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
  }
  render() {
    console.log(this.state.items);
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        {this.state.items.map(item => {
          return (
            <div
              key={item.item._id}
              className="card"
              style={{ width: 250, height: "auto", marginRight: 30 }}
            >
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
                  <strong>Quantity:</strong>
                  {item.qty}
                </h5>
                <h5 className="card-title">
                  <strong> Item Price:</strong>
                  {item.item.price}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
