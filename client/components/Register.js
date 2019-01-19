import React, { Component } from "react";
import Auth from "../Auth";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange() {
    this.setState({
      email: this.refs.email.value,
      password: this.refs.password.value
    });
  }

  handleSubmit(event) {
    Auth.register(this.state.email, this.state.password);
  }

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <div className="col-md-6">
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
    );
  }
}
