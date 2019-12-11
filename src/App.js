import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import browserHistory from './helpers/history';

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={props => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={props => <Register {...props} />}
            />
            />
            <Route
              path="/"
              name="Home"
              render={props => <DefaultLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}

export default App;
