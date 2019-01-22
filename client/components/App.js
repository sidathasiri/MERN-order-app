import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../css/App.css";
import Login from "./Login";
import Navbar from "./Navbar";
import Register from "./Register";
import Auth from "../Services/AuthService";

class App extends Component {
  render() {
    let imgUrl = "../images/background.jpeg";
    return (
      <div
        style={{
          backgroundImage: "url(" + imgUrl + ")",
          backgroundSize: "cover",
          overflow: "hidden",
          height: 1000,
          width: "auto",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div
          className="container"
          style={{ color: "white", marginLeft: 750, marginTop: 300 }}
        >
          <div className="row" style={{ marginLeft: 30 }}>
            <h1 style={{ fontSize: 70 }}>Welcome</h1>
          </div>
          <div
            style={{
              marginLeft: -20,
              fontSize: 60,
              fontFamily: "Dancing Script"
            }}
            className="row"
          >
            <small>Place your order today!</small>
          </div>
          <div className="row" style={{ marginTop: 20, marginLeft: 70 }}>
            {Auth.isAuthorized() ? (
              <Link
                className="btn btn-primary btn-lg"
                style={{ marginRight: 10 }}
                to="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <div>
                <Link
                  className="btn btn-primary btn-lg"
                  style={{ marginRight: 10 }}
                  to="/login"
                >
                  Login
                </Link>
                <Link className="btn btn-primary btn-lg" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
