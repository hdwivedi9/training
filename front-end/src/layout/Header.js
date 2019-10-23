import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div style={{ backgroundColor: "#1f1c1c", color: "white" }}>
        <h1 style={{ padding: "10px", textAlign: "center", margin: "0" }}>
          Vmock Task Management
        </h1>
      </div>
    );
  }
}

export default Header;
