import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AppBar } from "material-ui";
import { SettingsBackupRestore, AccountCircle } from "@material-ui/icons";
import Item from "./Item";
import ShowItem from "./showItem";
import { withRouter } from "react-router-dom";
import { Toolbar, IconButton } from "@material-ui/core";
import {
  ListGroup,
  Badge,
  Popover,
  PopoverHeader,
  Container,
  Table
} from "reactstrap";
import {
  getOrderItems,
  deleteOrderItems,
  deleteAllItems
} from "../actions/item-action";
import { logoutUserPOST, resetStore } from "../actions/user-actions";

import { connect } from "react-redux";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      items: [],
      itemToAdd: "",
      totalPrice: 0,
      allItems: [],
      popoverOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.authenticate !== this.props.user.authenticate) {
      this.props.resetStore();
      this.props.history.push("/login");
    }
  }

  logoutUser = () => {
    this.props.onLogoutUser();
  };
  //to open the popover to logout
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  //when the component mounts load the items
  async componentDidMount() {
    this.props.getItems(this.state.id);
  }

  render() {
    let tableBody, totalPrice;
    if (this.props.orderItems.length === 0) {
      tableBody = (
        <tr>
          <td>No Items On Order</td>
        </tr>
      );
      totalPrice = "";
    } else {
      tableBody = this.props.orderItems.map((item, i) => (
        <Item key={i} orderId={this.state.id} item={item} />
      ));
      totalPrice = 
        <Badge
          color="primary"
          style={{
            float: "right"
          }}
        
        >
          {" "}
          <h1>Total Price : Rs.{this.props.totalPrice} </h1>
        </Badge>
      
    }
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Order View">
            <Toolbar />

            <IconButton
              color="inherit"
              aria-label="Logout"
              onClick={() => {
                this.props.deleteOrderItems();
                this.props.deleteAllItems();
                this.props.history.push("../orders");
              }}
            >
              <SettingsBackupRestore />
            </IconButton>

            <IconButton color="inherit" aria-label="Logout" id="Popover1">
              <AccountCircle />
            </IconButton>
            <Popover
              placement="bottom"
              isOpen={this.state.popoverOpen}
              target="Popover1"
              toggle={this.toggle}
            >
              <PopoverHeader onClick={this.logoutUser}>Logout</PopoverHeader>
            </Popover>
          </AppBar>
          <Container
            style={{
              position: "absolute",
              width: "70%"
            }}
          >
            <div >
              <h1 style={{
                textAlign:"center",
                padding:10,
               
              }}>Order Items</h1>

              <Table hover>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit Price</th>
                    <th>Amount On Stock</th>
                    <th>Amount On Order</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{tableBody}</tbody>
              </Table>
          {totalPrice}
            </div>
          </Container>
          <Container
            style={{
              position: "absolute",
              width: "30%",
              marginLeft: "65%",
              padding: 20
            }}
          >
            <h1 style={{
                textAlign:"center"
              }}>Item List</h1>

            <ListGroup
              style={{
                overflowY: "scroll",
                maxHeight: 800
              }}
            >
              {this.props.allItems.map((item, i) => (
                <ShowItem key={i} item={item} orderId={this.state.id} />
              ))}
            </ListGroup>
          </Container>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapActionsToProps = {
  getItems: getOrderItems,
  deleteOrderItems: deleteOrderItems,
  deleteAllItems: deleteAllItems,
  onLogoutUser: logoutUserPOST,
  resetStore: resetStore
};
const mapStateToProps = (state, props) => ({
  user: state.user,
  order: state.order,
  allItems: state.item.allItems,
  orderItems: state.item.orderItems,
  totalPrice: state.item.orderPrice,
  id: props.id.match.params.id
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(OrderDetails)
);
