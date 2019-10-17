import React from "react";
import "./App.css";
import {Game, SignIn} from "./page"
import {connect} from "react-redux";
import { Route, Redirect, Switch } from "react-router";
import { HashRouter } from "react-router-dom"

function Inner(props) {
  const {login} = props;
  return (
      <HashRouter>
          <Switch>
              <Route path="/game" component={Game}/>
              <Route path="/login" component={SignIn}/>
              {!login &&
              <Redirect to="/login"/>
              }
              {login &&
              <Redirect to="/game"/>
              }
          </Switch>
      </HashRouter>
  );
}
const App = connect(
    state => ({login: state.info.login})
)(Inner);
export default App;
