import React, { Component } from "react";
import Auth from "../Auth";
import validator from "validator";
import { Redirect } from "react-router-dom";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: [],
      loginSuccess: false
    };
  }

  handleChange() {
    this.setState({
      email: this.refs.email.value,
      password: this.refs.password.value
    });
  }

  handleSubmit(event) {
    if (this.isFormValid()) {
      Auth.register(this.state.email, this.state.password)
        .then(result => {
          this.setState({
            loginSuccess: true
          });
        })
        .catch(err => {
          let errors = this.state.errors;
          errors.push(err);
          this.setState({
            errors
          });
        });
    }
  }

  isFormValid() {
    let errors = [];
    if (!validator.isEmail(this.state.email)) {
      errors.push("Email is not valid");
    } else if (this.state.password.length == 0) {
      errors.push("Password cannot be empty");
    } else if (this.state.password.length < 4) {
      errors.push("Password is too short");
    }

    this.setState({ errors });
    return errors.length == 0;
  }

  render() {
    if (this.state.loginSuccess || Auth.isAuthorized()) {
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
            <div
              className="col-md-6"
              style={{
                border: "1px solid #babbbc",
                padding: 50,
                borderRadius: 15,
                boxShadow: "10px 10px 5px grey"
              }}
            >
              <h1>Register</h1>
              <form>
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    ref="email"
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
                    password={this.state.password}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSubmit.bind(this)}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
