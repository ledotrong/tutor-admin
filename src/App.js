import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  HashRouter,
  Switch
} from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import 'antd/dist/antd.css';
import './App.css';
const Root = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route  path="/home" component={Home} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </HashRouter>
  </Provider>
);
Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
