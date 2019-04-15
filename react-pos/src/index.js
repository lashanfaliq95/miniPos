import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import thunk from 'redux-thunk';
import { combineReducers, createStore , applyMiddleware ,compose } from "redux";
import { Provider } from "react-redux";
import {userReducer} from "./reducers/userReducer";
import itemReducer from "./reducers/itemReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    console.log('sadas')
    state = undefined
  }

  return allReducers(state, action)
}

const allReducers = combineReducers({
  user: userReducer,
  order: orderReducer,
  item: itemReducer
});

const allStoreEnhancers=compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

)

const store = createStore(
  rootReducer,
  allStoreEnhancers
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
