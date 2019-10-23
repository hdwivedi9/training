import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "../actions/auth";
import { Link } from "react-router-dom";
import { SubmissionError } from "redux-form";
import { LoginForm } from "./forms/LoginForm";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => console.log(this.state));
  };

  onSubmit = user => {
    return this.props
      .login(user, this.props.cookies)
      .then(res => {
        this.props.history.push("/task");
      })
      .catch(err => {
        //console.log(err.response);
        throw new SubmissionError({
          email: err.response.data.email,
          _error: err.response.data.message
        });
      });
  };

  render() {
    return (
      <div>
        <h1
          style={{ textAlign: "center", color: "blue", paddingRight: "30px" }}
        >
          Welcome Back!
        </h1>
        <LoginForm onSubmit={this.onSubmit} />
        <Link
          to="/forget"
          style={{
            color: "blue",
            margin: "0 660px 25px 640px",
            display: "block"
          }}
        >
          Forgot Password?
        </Link>
        <Link to="/register" style={{ color: "blue", marginLeft: "615px" }}>
          New User? Register Here!
        </Link>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  isAuth: state.isAuthenticated,
  cookies: ownProps.cookies
});
export default connect(
  mapStateToProps,
  { login }
)(withRouter(Login));
