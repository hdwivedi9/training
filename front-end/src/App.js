import React, {Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from "react-redux";
import {withCookies } from 'react-cookie';
import {Navbar, Header} from './layout';
import {Home, Login, Task, User, Register, NewUser, NewTask} from './components';
import {Helmet} from 'react-helmet';
import {getAuth} from "./actions/auth";
import './App.css';

class App extends Component {

  render() { 

    this.props.getAuth(this.props.cookies);

    return (
      <BrowserRouter>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <Helmet bodyAttributes={{style: 'background-color : #efe4e0'}}/>
        <Header />
        <Navbar cookies={this.props.cookies} />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={withCookies(Login)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/task" component={Task} />
        <Route exact path="/user" component={withCookies(User)} />
        <Route exact path="/user/new" component={NewUser} />
        <Route exact path="/task/new" component={NewTask} />
      </BrowserRouter>
    )};
}

export default connect(null, {getAuth})(withCookies(App));
