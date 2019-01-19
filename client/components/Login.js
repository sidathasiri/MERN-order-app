import React, { Component } from "react";
import Auth from "../Auth";
import { Redirect } from "react-router-dom";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      authenticated: false
    };
  }

  handleChange() {
    this.setState({
      email: this.refs.email.value,
      password: this.refs.password.value
    });
  }

  handleLogin() {
    Auth.login(this.state.email, this.state.password)
      .then(isAuthenticated => {
        console.log(isAuthenticated);
        let currentState = this.state;
        currentState.authenticated = isAuthenticated;
        this.setState(currentState);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.authenticated || Auth.isAuthorized()) {
      return <Redirect to="/dashboard" />;
    } else {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
        >
          <div className="col-md-6">
            <h1>Login</h1>
            <form>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  ref="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  ref="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <button
                type="button"
                onClick={this.handleLogin.bind(this)}
                className="btn btn-primary"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );
    }
  }
}
