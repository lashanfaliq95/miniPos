//During the test the env variable is set to test
process.env.NODE_ENV = "test";

const Orders = require("../models/orders");
const Users = require("../models/users");
const Items = require("../models/items");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
//dont remove will cause issues with res.should
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe("Orders", () => {
  //create a agent to keep session state
  var authenticatedUser = chai.request.agent(server);
  const userCredentials = {
    username: "admin",
    password: "admin"
  };

  let tempUser, tempItem;
  before(async () => {
    const user = new Users({
      username: "test",
      password: "test"
    });
    const item = new Items({
      name: "burger",
      price: 300,
      qtyonstock: 100
    });
    const item1 = new Items({
      name: "submarine",
      price: 400,
      qtyonstock: 150
    });
    //create an user and get session
    await authenticatedUser
      .post("/users/createuser")
      .send(userCredentials)
      .then(async () => {
        await authenticatedUser
          .post("/users/authenticate")
          .send(userCredentials);
      });

    tempUser = await user.save();
    tempItem = await item.save();
    tempItemOne = await item1.save();
  });

  after(done => {
    //logout the session and remove the user
    authenticatedUser.post("/users/logout").end((err, res) => {
      if (!err) console.log("logged out");
    });

    Users.remove({}, err => {
      done();
    });
  });

  beforeEach(done => {
    //Before each test we empty the database
    Orders.remove({}, err => {
      done();
    });
  });

  /*
   * Test the create order
   */
  describe("/POST create order", () => {
    it("it should create an order", done => {
      const order = {
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id
      };
      authenticatedUser
        .post("/orders/createorder")
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("items");
          res.body.should.have.property("status").eql("OPEN");
          res.body.should.have.property("createdby");
          done();
        });
    });

    it("it should return an error", done => {
      const order = {
        items: [{ item: tempItem._id, orderamount: 0 }]
      };
      authenticatedUser
        .post("/orders/createorder")
        .send(order)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("/GET an order", () => {
    it("it should get an order", done => {
      const order = new Orders({
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id
      });

      order.save((err, order) => {
        authenticatedUser
          .get("/orders/getorder/" + order._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("items");
            res.body.should.have.property("status").eql("OPEN");
            res.body.should.have.property("createdby");
            done();
          });
      });
    });

    it("it should give an error when getting a order using a id which is not a valid object ID ", done => {
      //An id should be 12 digits to  be a valid objectid
      const falseId = "1234";
      authenticatedUser.get("/orders/getorder/" + falseId).end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("please enter a correct order ID");
        done();
      });
    });

    it("it should give an error when getting a order using a falseid which is a valid objectID", done => {
      const falseId = "123456789123";
      authenticatedUser.get("/orders/getorder/" + falseId).end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("order not found with id " + falseId);
        done();
      });
    });
    it("it should give an error when an Id is not provided", done => {
      authenticatedUser.get("/orders/getorder/").end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

  describe("/GET all orders", () => {
    it("it should get all orders", done => {
      authenticatedUser.get("/orders/getallorders").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array").eql([]);
        done();
      });
    });

    it("it should get all orders", done => {
      const order1 = new Orders({
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id
      });
      const order2 = new Orders({
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id
      });
      order1.save((err, order1) => {
        order2.save((err, order2) => {
          authenticatedUser.get("/orders/getallorders").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
        });
      });
    });

    
  });

  describe("/UPDATE an order", () => {
    it("it should update an order", done => {
      const order = new Orders({
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id,
        status: "OPEN"
      });

      order.save().then(order => {
        authenticatedUser
          .put("/orders/updateorder/" + order._id)
          .send({ status: "CLOSE" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("status").eql("CLOSE");
            done();
          });
      });
    });
  });

  describe("/UPDATE an item on an order", () => {
    it("it should update an item on an order", done => {
      const order = new Orders({
        items: [{ item: tempItem._id, orderamount: 0 }],
        createdby: tempUser._id
      });

      order.save().then(order => {
        authenticatedUser
          .put("/orders/updateorderitems/" + order._id + "/" + tempItem._id)
          .send({ value: 5 })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("orderamount").eql(5);
            done();
          });
      });
    });
  });

  describe("/UPDATE an item on an order", () => {
    it("it should update an item on an order", done => {
      const order = new Orders({
        items: [{ item: tempItem._id, orderamount: 50 }],
        createdby: tempUser._id
      });

      order.save().then(order => {
        authenticatedUser
          .put("/orders/removeorderitems/" + order._id + "/" + tempItem._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            //intial 100 plus the 50 in the order minus the 5 from the earlier test
            res.body.should.have.property("qtyonstock").eql(145);
            done();
          });
      });
    });
  });

  describe("/UPDATE an item on an order", () => {
    it("it should update an item on an order", done => {
      const order = new Orders({
        items: [{ item: tempItem._id, orderamount: 50 }],
        createdby: tempUser._id
      });

      order.save().then(order => {
        authenticatedUser
          .put("/orders/addorderitems/" + order._id + "/" + tempItemOne._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
});
