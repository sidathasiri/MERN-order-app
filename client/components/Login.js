import React, { Component } from "react";
import Auth from "../Auth";
import { Redirect } from "react-router-dom";
import validator from "validator";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      authenticated: false,
      errors: []
    };
  }

  handleChange() {
    this.setState({
      email: this.refs.email.value,
      password: this.refs.password.value
    });
  }

  isFormValid() {
    let errors = [];
    if (!validator.isEmail(this.state.email)) {
      errors.push("Email is not valid");
    }

    this.setState({ errors });
    return errors.length == 0;
  }

  handleLogin() {
    if (this.isFormValid()) {
      Auth.login(this.state.email, this.state.password)
        .then(isAuthenticated => {
          console.log(isAuthenticated);
          let currentState = this.state;
          currentState.authenticated = isAuthenticated;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
          let errors = this.state.errors;
          errors.push(err);
          this.setState(errors);
        });
    }
  }

  render() {
    if (this.state.authenticated || Auth.isAuthorized()) {
      return <Redirect to="/dashboard" />;
    } else {
      return (
        <div className="container">
          {this.state.errors.length > 0 ? (
            <div className="alert alert-danger" role="alert">
              <ul>
                {this.state.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
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
        </div>
      );
    }
  }
}
