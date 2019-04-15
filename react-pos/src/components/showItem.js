import React, { Component } from "react";
import { Row, ListGroupItem, Col, Badge } from "reactstrap";
import { connect } from "react-redux";
import { addOrderItemPUT } from "../actions/item-action";

class showItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      orderId: this.props.orderId
    };
  }

  //update the item state when props update
  componentDidUpdate(prevProps) {
    if (this.props.item.item._id !== prevProps.item.item._id) {
      this.setState({
        id: this.props.item.item._id,
        name: this.props.item.item.name,
        price: this.props.item.item.price
      });
    }
  }

  addItems = () => {
    this.props.addItem(this.state.orderId, this.state.id);
  };

  render() {
    let ListItem;
    if (this.props.item.added) {
      ListItem = (
        <ListGroupItem
          name={this.state.name}
          style={{
            backgroundColor: "#eee"
          }}
          disabled
          onClick={this.addItems}
         
        >
          <Row>
            <Col>
              <h3>{this.state.name} </h3>
            </Col>

            <Col >
            <p
                style={{
                  float: "right"
                }}
              >
                Rs.{this.state.price}
              </p>
            </Col>
          </Row>
        </ListGroupItem>
      );
    } else {
      ListItem = (
        <ListGroupItem
          name={this.state.name}
          style={{
            backgroundColor: "#eee"
          }}
          onClick={this.addItems}
        >
          <Row>
            <Col>
              <h3>{this.state.name} </h3>
            </Col>
            <Col>
              <p
                style={{
                  float: "right"
                }}
              >
                Rs.{this.state.price}
              </p>
            </Col>
          </Row>
        </ListGroupItem>
      );
    }

    return <div>{ListItem}</div>;
  }
}

const mapActionsToProps = {
  addItem: addOrderItemPUT
};
const mapStateToProps = (state, props) => ({
  item: props.item,
  orderId: props.orderId
});

export default connect(
  mapStateToProps,
  mapActionsToProps
)(showItems);
