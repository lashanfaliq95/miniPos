import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails"
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/(login|)"
            render={props => (
              <React.Fragment>
                <Login  />
              </React.Fragment>
            )}
          />
          <Route
            exact
            path="/orders"
            render={props => (
              <React.Fragment>
                <Orders  />
              </React.Fragment>
            )}
          />
              <Route
            exact
            path="/orderDetails/:id"
            render={props => (
              <React.Fragment>
                <OrderDetails id={props}  />
              </React.Fragment>
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
