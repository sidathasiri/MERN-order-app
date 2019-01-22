import React, { Component } from "react";
import { Link } from "react-router-dom";
import Auth from "../Services/AuthService";

export default class Navbar extends Component {
  logout() {
    Auth.logout();
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
          <Link className="navbar-brand" to="/">
            Home<span className="sr-only">(current)</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              {Auth.isAuthorized() ? null : (
                <li className="nav-item active">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
              {Auth.isAuthorized() ? null : (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register<span className="sr-only">(current)</span>
                  </Link>
                </li>
              )}
              {Auth.isAuthorized() ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard<span className="sr-only">(current)</span>
                  </Link>
                </li>
              ) : null}
              {Auth.isAuthorized() ? (
                <li className="nav-item" onClick={this.logout.bind(this)}>
                  <Link className="nav-link" to="/login">
                    Logout<span className="sr-only">(current)</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
