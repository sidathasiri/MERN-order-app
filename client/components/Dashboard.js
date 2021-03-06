import React, { Component } from "react";
import { Link } from "react-router-dom";
import OrderService from "../Services/OrderService";

/**
 * Component corresponding to the user dashboard displaying his/her open orders
 */
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      error: ""
    };
  }

  /**
   * fetches the open orders placed by user via OrderService
   */
  getOrders() {
    OrderService.getOrders()
      .then(orders => {
        this.setState({
          orders
        });
      })
      .catch(err => {
        this.setState({
          error: err
        });
      });
  }

  /**
   * @param {String} orderId
   * @description deletes the order identified by the param orderId via OrderService
   */
  deleteOrder(orderId) {
    OrderService.deleteOrder(orderId, this.state.orders)
      .then(success => {
        if (success) {
          let newArr = [];
          //appends the items to the new array without the deleted item
          for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i]._id != orderId) {
              newArr.push(this.state.orders[i]);
            }
          }
          this.setState({
            orders: newArr //updates the items to new array
          });
        } else {
          this.setState({ error: "Error occurred in delete" });
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    return (
      <div className="container">
        {this.state.error ? (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        ) : null}
        <Link
          className="btn btn-primary"
          style={{ marginTop: 20, marginBottom: 20, marginLeft: 1000 }}
          to={"/addOrder"}
        >
          Add Order
        </Link>
        {this.state.orders.length == 0 ? (
          <h1
            style={{
              color: "#7d8184",
              fontFamily: "Dancing Script",
              display: "flex",
              justifyContent: "center",
              marginTop: 50,
              fontSize: 80
            }}
          >
            <i>You have no orders yet!</i>
          </h1>
        ) : null}
        {this.state.orders.map(order => {
          return (
            <div
              key={order._id}
              className="card"
              style={{
                borderRadius: 20,
                borderColor: "#adaba9",
                marginBottom: 20,
                boxShadow: "5px 5px 5px grey"
              }}
            >
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
                      style={{
                        height: 100,
                        width: "auto",
                        border: "1px solid grey",
                        borderRadius: 15,
                        marginRight: 10
                      }}
                      src={item.item.imagePath}
                      alt="Card image cap"
                    />
                  );
                })}
                <hr />
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
