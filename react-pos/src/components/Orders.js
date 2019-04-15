import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AppBar, List } from "material-ui";
import axios from "axios";
import Order from "./Order";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withRouter } from "react-router-dom";
import { Tab, Tabs, IconButton, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { Popover, PopoverHeader } from "reactstrap";
import { URL } from "../resources/variables";
import { getOrders } from "../actions/order-actions";
import { connect } from "react-redux";
import { logoutUserPOST, resetStore } from "../actions/user-actions";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNum: 0,
      popoverOpen: false
    };
  }

  //to open the popover to logout
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user.authenticate !== this.props.user.authenticate) {
      this.props.resetStore();
      this.props.history.push("/login");
    }
  }

  LogoutUser = () => {
    this.props.onLogoutUser();
  };

  //fucntion to change tabs
  handleChange = (event, value) => {
    this.setState({ tabNum: value });
  };

  componentDidMount() {
    this.props.onGetOrders();
  }

  render() {
    const value = this.state.tabNum;

    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Orders">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Open Orders" />
              <Tab label="Closed Orders" />
            </Tabs>
            <IconButton color="inherit" aria-label="Logout" id="Popover1">
              <AccountCircle />
            </IconButton>
            <Popover
              placement="bottom"
              isOpen={this.state.popoverOpen}
              target="Popover1"
              toggle={this.toggle}
            >
              <PopoverHeader onClick={this.LogoutUser}>Logout</PopoverHeader>
            </Popover>
          </AppBar>

          {value === 0 && (
            <TabContainer>
              <List>
                {this.props.order
                  .filter(order => order.status === "OPEN")
                  .map((order, i) => (
                    <Order key={i} order={order} />
                  ))}
              </List>
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <List>
                {this.props.order
                  .filter(order => order.status === "CLOSE")
                  .map((order, i) => (
                    <Order key={i} order={order} />
                  ))}
              </List>
            </TabContainer>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
const mapActionsToProps = {
  onGetOrders: getOrders,
  onLogoutUser: logoutUserPOST,
  resetStore: resetStore
};
const mapStateToProps = state => ({
  user: state.user,
  order: state.order
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Orders)
);
