import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { login } from "../actions/auth";
import { Link } from "react-router-dom";
import { SubmissionError } from "redux-form";
import { RegisterForm } from "./forms/RegisterForm";

class Register extends Component {
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
    return axios
      .post("http://localhost:8000/register", user)
      .then(res => {
        this.props.history.push("/login");
      })
      .catch(err => {
        //console.log(err.response);
        throw new SubmissionError({
          email: err.response.data.email
        });
      });
  };

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center", color: "blue" }}>
          Welcome to Vmock Task Management!
        </h1>
        <RegisterForm onSubmit={this.onSubmit} />
        <Link to="/login" style={{ color: "blue", marginLeft: "605px" }}>
          Already a member? Sign In!
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
)(withRouter(Register));
