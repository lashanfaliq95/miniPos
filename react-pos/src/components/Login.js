import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Button, Form, FormGroup, Input } from "reactstrap";
import { connect } from "react-redux";
import Image from "../resources/login_background.jpg";
import { authenticateUserPOST } from "../actions/user-actions";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  onAuthenticateUser = (username, password) => {
    this.props.onAuthenticateUser(username, password);
  };
  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.props.history.push("/orders");
    }
  }
  authenticateUser = () => {
    this.onAuthenticateUser(this.state.username, this.state.password);
  };
  render() {
    console.log(this.props.user);
    return (
      <div
        style={{
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
          height: "100%",
          position: "absolute",
          width: "100%"
        }}
      >
        <Container
          style={{
            marginTop: 200
          }}
        >
          <Form
            className="bg-white m-5"
            title="Login"
            style={{
              padding: 10
            }}
          >
            <h1>Login</h1>
            <FormGroup>
              <Input
                name="username"
                id="username"
                placeholder="username"
                onChange={event =>
                  this.setState({ username: event.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="email"
                id="exampleEmail"
                placeholder="password"
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
            </FormGroup>
            <Button
              color="primary"
              size="lg"
              onClick={event => this.authenticateUser()}
              margin="15px"
            >
              Login
            </Button>
          </Form>
          <br />
        </Container>
      </div>
    );
  }
}

const mapActionsToProps = {
  onAuthenticateUser: authenticateUserPOST
};
const mapStateToProps = state => ({
  user: state.user
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Login)
);
