import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { login } from "../actions/auth";
import { changeType } from "../actions/changeType";
import { Link } from "react-router-dom";
import { SubmissionError } from "redux-form";
import NewTaskForm from "./forms/NewTaskForm";
import moment from "moment";

class NewTask extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = task => {
    task.due_date = moment(task.due_date).format("YYYY-MM-DD hh:mm:ss");
    task.assignee = this.props.location.state.assignee;
    console.log(task);
    return axios
      .post("http://localhost:8000/task/newTask", task)
      .then(res => {
        this.props.history.push("/task");
      })
      .catch(err => {
        //console.log(err.response);
        throw new SubmissionError({
          due_date: err.response.data.due_date
        });
      });
  };

  render() {
    return (
      <div>
        <h1
          style={{ textAlign: "center", color: "blue", paddingRight: "30px" }}
        >
          New Task
        </h1>
        <NewTaskForm onSubmit={this.onSubmit} />
        <Link to="/task" style={{ color: "blue", marginLeft: "645px" }}>
          Back to Task List
        </Link>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  isAuth: state.isAuthenticated,
  user: state.auth.user,
  type: state.type.type,
  cookies: ownProps.cookies
});
export default connect(
  mapStateToProps,
  { login, changeType }
)(withRouter(NewTask));
