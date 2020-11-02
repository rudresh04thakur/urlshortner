import React, { Component } from 'react';
import './root.scss'
import {Link, BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Home from '../home';
import Stats from '../stats';
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as rootActions from "../../store/root/actions";
export default class root extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {};
  // }
  render() {
    return <Router>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">URL Shortner By Gopal</Link>
          </div>
          <ul className="nav navbar-nav">
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'stats'}>Analytics</Link></li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path='/stats'>
          <Stats></Stats>
        </Route>
        <Route path='/'>
          <Home></Home>
        </Route>
      </Switch>
    </Router>;
  }
}
