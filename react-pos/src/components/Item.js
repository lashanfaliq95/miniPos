import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import axios from "axios";
import Close from "@material-ui/icons/Close";
import { InputAdornment } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import {
  ListGroupItem,
  Row,
  Col,
  Badge,
  Button,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";
import { URL } from "../resources/variables";
import { connect } from "react-redux";
import {
  deleteOrderItemPUT,
  updateOrderItemQtyPUT
} from "../actions/item-action";
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      qtyonstock: this.props.item.item.qtyonstock,
      orderamount: this.props.item.orderamount,
      totalPrice: this.props.item.item.price * this.props.item.orderamount,
      items: this.props.items,
      orderId: this.props.orderId
    };
  }

  //check if the list contains the given item id
  containsItem = (itemid, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
      if (itemid === list[i].item._id) {
        return i;
      }
    }
    return -1;
  };

  //update the item state when props update
  componentDidUpdate(prevProps) {
    if (this.props.item.item._id !== prevProps.item.item._id) {
      this.setState({
        id: this.props.item.item._id,
        name: this.props.item.item.name,
        price: this.props.item.item.price,
        qtyonstock: this.props.item.item.qtyonstock,
        orderamount: this.props.item.orderamount,
        totalPrice: this.props.item.item.price * this.props.item.orderamount
      });
    } else if (
      prevProps.orderItems !== this.props.orderItems &&
      prevProps.allItems === this.props.allItems
    ) {
      this.setState({
        qtyonstock: this.props.item.item.qtyonstock,
        orderamount: this.props.item.orderamount,
        totalPrice: this.props.item.item.price * this.props.item.orderamount
      });
    }
  }

  //to display on hover
  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };
  styles = theme => ({
    fab: {
      margin: theme.spacing.unit
    },
    extendedIcon: {
      marginRight: theme.spacing.unit
    }
  });

  //update item quantity
  updateItem = (event, number) => {
    const newNum = event.target.value - this.state.orderamount;
    this.updateItems(newNum);
  };

  updateItems = num => {
    this.props.updateItemQty(num, this.state.orderId, this.state.id);
  };

  deleteItem = () => {
    this.props.deleteItem(this.state.orderId, this.state.id);
  };

  render() {
    var linkStyle;
    if (this.state.hover) {
      linkStyle = {
        backgroundColor: "#ddd",
        margin: 15,
        padding: 20,
        cursor: "pointer"
      };
    } else {
      linkStyle = {
        backgroundColor: "#eee",
        margin: 15,
        padding: 20,
        cursor: "pointer"
      };
    }

    return (
      <tr>
        {/* <MuiThemeProvider>
          <ListGroupItem
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            style={linkStyle}
          >
            <Row>
              <Col>
                <h3> {this.state.name}</h3>
                <br />
                <p>Unit Price:{this.state.price}</p>
              </Col>
              <Col>
                <p>
                  On order :{" "}
                  <Badge color="success">{this.state.orderamount}</Badge>
                </p>
                <p>
                  On stock :{" "}
                  <Badge color="warning"> {this.state.qtyonstock}</Badge>
                </p>
              </Col>
              <Col>
                <TextField
                  type="number"
                  name={this.state.name}
                  id={this.state.name}
                  value={this.state.orderamount}
                  min={0}
                  max={this.state.orderamount + this.state.qtyonstock}
                  variant="outlined"
                  onChange={(event, newValue) =>
                    this.updateItem(event, newValue)
                  }
                  inputStyle={{ backgroundColor: "#F6F5F5" }}
                />
                <Badge color="info">
                  <p>Price : {this.state.totalPrice}</p>
                </Badge>
              </Col>

              <Col className="d-flex align-items-center">
                <Fab
                  aria-label="Delete"
                  className={this.fab}
                  name="delBtn"
                  id="delItemBtn"
                  onClick={this.deleteItem}
                >
                  <DeleteIcon />
                </Fab>
              </Col>
            </Row>
          </ListGroupItem>
        </MuiThemeProvider> */}

        <th scope="row">{this.state.name}</th>
        <td>{this.state.price}</td>
        <td> {this.state.qtyonstock}</td>
        <td>
          <InputGroup>
            <Input
              name={this.state.name}
              placeholder="Amount"
              min={0}
              value={this.state.orderamount}
              max={this.state.orderamount + this.state.qtyonstock}
              onChange={(event, newValue) => this.updateItem(event, newValue)}
              type="number"
              step="1"
            />
          </InputGroup>
        </td>
        <td>Rs.{this.state.totalPrice}</td>
        <td>
          <Button close onClick={this.deleteItem} />
        </td>
      </tr>
    );
  }
}

const mapActionsToProps = {
  deleteItem: deleteOrderItemPUT,
  updateItemQty: updateOrderItemQtyPUT
};
const mapStateToProps = (state, props) => ({
  allItems: state.item.allItems,
  orderItems: state.item.orderItems,
  item: props.item,
  items: props.items,
  orderId: props.orderId
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Item)
);
