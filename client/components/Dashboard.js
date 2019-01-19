import React, { Component } from "react";
import { Link } from "react-router-dom";
var axios = require("axios");

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: []
    };
  }

  getOrders() {
    axios({
      method: "get",
      url: "/getOrders",
      headers: { Authorization: `Bearer ${localStorage.authToken}` }
    })
      .then(response => {
        this.setState({
          orders: response.data
        });
      })
      .catch(err => console.log(err));
  }

  deleteOrder(orderId) {
    console.log(orderId);
    axios
      .delete("/deleteOrder/" + orderId, {
        headers: { Authorization: `Bearer ${localStorage.authToken}` }
      })
      .then(response => {
        if (response.status == 200) {
          let newArr = [];
          for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i]._id != orderId) {
              newArr.push(this.state.orders[i]);
            }
          }
          this.setState({
            orders: newArr
          });
        } else {
          alert("Error occurred in delete");
        }
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    return (
      <div className="container">
        <Link
          className="btn btn-primary"
          style={{ marginTop: 20, marginBottom: 20, marginLeft: 1000 }}
          to={"/addOrder"}
        >
          Add Order
        </Link>
        {this.state.orders.map(order => {
          return (
            <div key={order._id} style={{ marginBottom: 20 }} className="card">
              <div className="card-header">
                Order ID: {order._id}{" "}
                <button
                  style={{ marginLeft: 740 }}
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteOrder.bind(this, order._id)}
                >
                  X
                </button>
              </div>
              <div className="card-body">
                {order.items.map((item, index) => {
                  return (
                    <img
                      key={item.item._id}
                      style={{ height: 100, width: "auto" }}
                      src={item.item.imagePath}
                      alt="Card image cap"
                    />
                  );
                })}
                <h5 className="card-title">Items: {order.items.length}</h5>
                <p className="card-text">Price: {order.price}</p>
                <p className="card-text">Placed on: {order.timestamp}</p>
                <Link className="btn btn-primary" to={`/order/${order._id}`}>
                  More Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
