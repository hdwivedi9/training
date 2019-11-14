import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { changeType } from "../actions/changeType";
import MaterialTable from "material-table";
import MTableEditField from "../utils/MTableEditField";
import MTableFilterRow from "../utils/MTableFilterRow";
import moment from "moment";

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      loading: true
    };
    this.onSubmit();
  }

  onSubmit = (resolve = null) => {
    axios.get("http://localhost:8000/task/taskList").then(res => {
      this.setState(
        {
          tasks: res.data.data
        },
        () => {
          if (resolve !== null) resolve();
          if (this.state.loading) this.setState({ loading: false });
        }
      );
    });
  };

  onUpdate = (task, newData, oldData, resolve, reject) => {
    let flag = 0;
    if (task.title || task.description || task.due_date) {
      axios
        .post("http://localhost:8000/task/updateTask", task)
        .then(res => {
          this.onSubmit(resolve);
        })
        .catch(err => {
          reject();
        });
      flag = 1;
    }
    if (newData.status !== oldData.status) {
      axios
        .post("http://localhost:8000/task/taskStatus", {
          id: newData.id,
          status: newData.status
        })
        .then(res => {
          this.onSubmit(resolve);
        })
        .catch(err => {
          reject();
        });
      flag = 1;
    }
    if (!flag) {
      resolve();
    }
  };

  onDelete = (oldData, resolve, reject) => {
    axios
      .post("http://localhost:8000/task/deleteTask", { id: oldData.id })
      .then(res => {
        this.onSubmit(resolve);
      })
      .catch(err => {
        reject();
      });
  };

  render() {
    var userID = this.props.user.sub;
    const columns = [
      {
        title: "ID",
        field: "id",
        type: "numeric",
        hidden: true,
        editable: false,
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        }
      },
      {
        title: "Title",
        field: "title",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => {
          return userID === props.rowData.cid ? (
            <MTableEditField {...props} />
          ) : (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      },
      {
        title: "Description",
        field: "description",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => {
          return userID === props.rowData.cid ? (
            <MTableEditField {...props} />
          ) : (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      },
      {
        title: "Creator",
        field: "creator",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => {
          return (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      },
      {
        title: "Assignee",
        field: "assignee",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => {
          return (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      },
      {
        title: "Status",
        field: "status",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center",
          width: "15%"
        },
        lookup: {
          assigned: "assigned",
          "in-progress": "in-progress",
          completed: "completed"
        },
        editComponent: props => {
          return userID === props.rowData.aid ? (
            <MTableEditField {...props} />
          ) : (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      },
      {
        title: "Due Date",
        field: "due_date",
        type: "datetime",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center",
          width: "220px"
        },
        render: rowData => moment(rowData.due_date).format("MMMM Do, h:mm a"),
        customFilterAndSearch: (term, rowData) =>
          term > new Date(rowData.due_date),
        editComponent: props => {
          return userID === props.rowData.cid ? (
            <MTableEditField {...props} />
          ) : (
            <div style={{ color: "#565b62", textAlign: "center" }}>
              {props.value}
            </div>
          );
        }
      }
    ];

    return (
      <MaterialTable
        title="Task Listing"
        style={{ background: "#efe4e0" }}
        columns={columns}
        data={this.state.tasks}
        isLoading={this.state.loading}
        style={{ background: "#3e434b", color: "#9da5ea" }}
        components={{
          FilterRow: props => {
            //console.log(props);
            return <MTableFilterRow {...props} />;
          }
        }}
        actions={[
          {
            icon: "add_box",
            iconProps: { style: { color: "#fff" } },
            tooltip: "New Task",
            isFreeAction: true,
            onClick: event => {
              if (this.props.user.role === "admin") {
                this.props.changeType("select");
                this.props.history.push("/user");
              } else
                this.props.history.push({
                  pathname: "/task/new",
                  state: { assignee: userID }
                });
            }
          }
        ]}
        editable={{
          isEditable: rowData =>
            userID === rowData.cid || userID === rowData.aid,
          isDeletable: rowData => userID === rowData.cid,
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const task = {
                id: newData.id,
                title: newData.title !== oldData.title ? newData.title : null,
                description:
                  newData.description !== oldData.description
                    ? newData.description
                    : null,
                due_date:
                  newData.due_date !== oldData.due_date
                    ? moment(newData.due_date).format("YYYY-MM-DD hh:mm:ss")
                    : null
              };
              this.onUpdate(task, newData, oldData, resolve, reject);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              this.onDelete(oldData, resolve, reject);
            })
        }}
        localization={{
          body: {
            editTooltip: "Edit",
            deleteTooltip: "Delete",
            editRow: { deleteText: "Delete this task?", saveTooltip: "Delete" },
            emptyDataSourceMessage: "No Tasks Assigned"
          },
          header: { actions: "Action" }
        }}
        options={{
          rowStyle: rowData => ({
            background: rowData.tableData.id % 2 ? "#343a40" : "#3e444a",
            border: "2px solid #454d55"
          }),
          headerStyle: {
            background: "#343a40",
            color: "orange",
            border: "2px solid #454d55",
            // background:'#efe4e0',
            // color:'orange',
            textAlign: "center"
          },
          filterCellStyle: {
            background: "#3e444ae3",
            border: "2px solid #454d55e3",
            textAlign: "center"
          },
          actionsCellStyle: {
            color: "white",
            width: "120px",
            paddingLeft: "20px"
          },
          searchFieldStyle: {
            color: "#ffffff8a"
          },
          sorting: false,
          filtering: true,
          grouping: false,
          toolbar: true,
          pageSize: 5,
          paginationType: "stepped",
          actionsColumnIndex: -1
        }}
      />
    );
  }
}
const mapStateToProps = state => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  { changeType }
)(Task);
