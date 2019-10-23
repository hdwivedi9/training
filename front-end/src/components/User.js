import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { changeType } from "../actions/changeType";
import MaterialTable from "material-table";
import MTableEditField from "../utils/MTableEditField";
import MTableFilterRow from "../utils/MTableFilterRow";
import moment from "moment";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true
    };
    this.onSubmit();
  }

  componentWillUnmount() {
    if (this.props.type !== "") this.props.changeType("");
    //console.log('unmounting...')
  }

  onSubmit = (resolve = null) => {
    //console.log(1);
    axios.get("http://localhost:8000/login/get_user").then(res => {
      this.setState(
        {
          users: res.data.data
        },
        () => {
          if (resolve !== null) resolve();
          if (this.state.loading) this.setState({ loading: false });
        }
      );
    });
  };

  onUpdate = (newData, oldData, resolve, reject, conf = false) => {
    //console.log(resolve);
    let flag = 0;
    if (newData.role !== oldData.role || conf) {
      axios
        .post("http://localhost:8000/login/role_change", {
          id: newData.id,
          role: newData.role
        })
        .then(res => {
          this.onSubmit(resolve);
          if (conf)
            setTimeout(() => {
              this.props.logout(this.props.cookies, this.props.history);
            }, 500);
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
      .post("http://localhost:8000/login/delete", { id: oldData.id })
      .then(res => {
        this.onSubmit(resolve);
      })
      .catch(err => {
        reject();
      });
  };

  render() {
    //console.log(1);
    let user = this.props.user;
    let userID = this.props.user.sub;
    let { type } = this.props;

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
        title: "Name",
        field: "name",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => (
          <div style={{ color: "#565b62", textAlign: "center" }}>
            {props.value}
          </div>
        )
      },
      {
        title: "Email",
        field: "email",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => (
          <div style={{ color: "#565b62", textAlign: "center" }}>
            {props.value}
          </div>
        )
      },
      {
        title: "Role",
        field: "role",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center",
          width: "15%"
        },
        lookup: { admin: "admin", normal: "normal" },
        editComponent: props => <MTableEditField {...props} />
      },
      {
        title: "Created By",
        field: "created_by",
        cellStyle: {
          color: "white",
          border: "2px solid #454d55",
          textAlign: "center"
        },
        editComponent: props => (
          <div style={{ color: "#565b62", textAlign: "center" }}>
            {props.value}
          </div>
        )
      }
      //{ title: 'created_at', field: 'created_at', filtering:false, cellStyle: {color: 'white', border:'2px solid #454d55', textAlign:'center'}, editComponent: (props) => {return <div style={{color:'#565b62', textAlign:'center'}}>{props.value}</div>}},
      //{ title: 'updated_at', field: 'updated_at', filtering:false, cellStyle: {color: 'white', border:'2px solid #454d55', textAlign:'center'}, editComponent: (props) => {return (userID===props.rowData.cid)?<MTableEditField {...props}/>:<div style={{color:'#565b62', textAlign:'center'}}>{props.value}</div>}},
    ];

    return (
      <MaterialTable
        title="User Listing"
        style={{ background: "#efe4e0" }}
        columns={columns}
        data={this.state.users}
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
            tooltip: "Add User",
            hidden: type !== "" || user.role !== "admin",
            isFreeAction: true,
            onClick: event => this.props.history.push("/user/new")
          },
          {
            icon: "done",
            tooltip: "Select",
            hidden: type !== "select",
            onClick: (event, rowData) =>
              this.props.history.push({
                pathname: "/task/new",
                state: { assignee: rowData.id }
              })
          }
        ]}
        editable={
          user.role === "admin" && type === ""
            ? {
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    if (user.sub === newData.id) {
                      let conf = true;
                      if (
                        window.confirm(
                          "Are you sure you want to change your own role?\n You will be logged out!"
                        )
                      )
                        this.onUpdate(newData, oldData, resolve, reject, conf);
                      else reject();
                    } else this.onUpdate(newData, oldData, resolve, reject);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    this.onDelete(oldData, resolve, reject);
                  })
              }
            : {}
        }
        localization={{
          body: {
            editTooltip: "Edit",
            deleteTooltip: "Remove",
            editRow: { deleteText: "Remove this user?", saveTooltip: "Remove" },
            emptyDataSourceMessage: "No users here"
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
            paddingLeft: type !== "select" ? "20px" : "40px"
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
const mapStateToProps = (state, ownProps) => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user,
  type: state.type.type,
  cookies: ownProps.cookies
});
export default connect(
  mapStateToProps,
  { logout, changeType }
)(User);
