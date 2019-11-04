import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { withRouter } from "react-router-dom";
// import isEmpty from "../validation/is-empty";
// import isAdmin from "../validation/isAdmin";
// import "../components/Navbar.css";

class Navbar extends Component {
  onLogout(e) {
    e.preventDefault();
    this.props.logout(this.props.cookies, this.props.history);
  }
  render() {
    const { isAuth } = this.props;
    //console.log(this.props.isAuth);
    const loginLinks = (
      <ul className="navbar-nav ml-auto" style={{ paddingLeft: "250px" }}>
        <ul className="nav-item ml-auto" style={{ display: "inline-block" }}>
          <Link
            className="nav-link"
            to="/login"
            style={{ color: "#383232", fontWeight: "bold" }}
          >
            Log In
          </Link>
        </ul>
        <ul className="nav-item ml-auto" style={{ display: "inline-block" }}>
          <Link
            className="nav-link"
            to="/register"
            style={{ color: "#383232", fontWeight: "bold" }}
          >
            Sign Up
          </Link>
        </ul>
      </ul>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto" style={{ paddingLeft: "125px" }}>
        <ul className="nav-item" style={{ display: "inline-block" }}>
          <Link
            className="nav-link"
            to="/task"
            style={{ color: "#383232", fontWeight: "bold" }}
          >
            Task List
          </Link>
        </ul>

        <ul className="nav-item" style={{ display: "inline-block" }}>
          <Link
            className="nav-link"
            to="/user"
            style={{ color: "#383232", fontWeight: "bold" }}
          >
            User List
          </Link>
        </ul>
        <ul
          className="nav-item"
          onClick={this.onLogout.bind(this)}
          style={{ display: "inline-block" }}
        >
          <div className="p-2" style={{ color: "#f54b4b", cursor: "pointer" }}>Logout</div>
        </ul>
      </ul>
    );
    return (
      <nav
        className="navbar navbar-expand-xl navbar-red"
        style={{ color: "#ad2222", background: "#9aa1ab" }}
      >
        <Link
          className="navbar-brand"
          to="/article"
          style={{
            color: "#f78b8b",
            fontWeight: "bold",
            paddingLeft: "35px",
            paddingRight: "800px"
          }}
        >
          Articles
        </Link>
        <div
          className="collapse navbar-collapse ml-auto"
          id="navbarSupportedContent"
          style={{ display: "inline-block" }}
        >
          {isAuth ? authLinks : loginLinks}
        </div>
      </nav>
    );
  }
}
const mapStateToProps = state => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
});

export default Navbar = connect(
  mapStateToProps,
  { logout }
)(withRouter(Navbar));
