import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { login } from "../actions/auth";
import { Link } from "react-router-dom";
import { SubmissionError } from "redux-form";
import { NewUserForm } from "./forms/NewUserForm";

class NewUser extends Component {
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
      .post("http://localhost:8000/login/create_user", user)
      .then(res => {
        this.props.history.push("/user");
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
        <h1
          style={{ textAlign: "center", color: "blue", paddingRight: "30px" }}
        >
          Create New User
        </h1>
        <NewUserForm onSubmit={this.onSubmit} />
        <Link to="/user" style={{ color: "blue", marginLeft: "645px" }}>
          Back to User List
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
)(withRouter(NewUser));
