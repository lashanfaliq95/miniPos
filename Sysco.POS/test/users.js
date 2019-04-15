//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Users = require("../models/users");
const bcrypt = require("bcrypt");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Users", () => {
  beforeEach(done => {
    //Before each test we empty the database
    Users.remove({}, err => {
      done();
    });
  });
  /*
   * Test the create user
   */
  describe("/POST create user", () => {
    it("it should create an user", done => {
      const user = {
        username: "admin",
        password: "admin"
      };
      chai
        .request(server)
        .post("/users/createuser")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });

    it("it should return an error when a field is missing", done => {
      const user = {
        username: "admin"
      };
      chai
        .request(server)
        .post("/users/createuser")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });

    it("it should return an error when a field is empty", done => {
      const user = {
        username: "",
        password: ""
      };
      chai
        .request(server)
        .post("/users/createuser")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /*
   * Test the authenticate user
   */
  describe("/POST create user", () => {
    it("it should authenticate an user", done => {
      const obj = {
        username: "admin",
        password: "admin"
      };
      const user = new Users(obj);
      user.save((err, user) => {
        chai
          .request(server)
          .post("/users/authenticate")
          .send(obj)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it("it should return an unauthorized error", done => {
      const objReal = {
        username: "admin",
        password: "admin"
      };
      const objFalse = {
        username: "admin",
        password: "fake"
      };
      const user = new Users(objReal);
      user.save((err, user) => {
        chai
          .request(server)
          .post("/users/authenticate")
          .send(objFalse)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    it("it should return a not found error", done => {
      const objReal = {
        username: "admin",
        password: "admin"
      };
      const objFalse = {
        username: "fake",
        password: "fake"
      };
      const user = new Users(objReal);
      user.save((err, user) => {
        chai
          .request(server)
          .post("/users/authenticate")
          .send(objFalse)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have
              .property("message")
              .eql("user not found with username " + objFalse.username);
            done();
          });
      });
    });

    it("it should return an bad request", done => {
      const objReal = {
        username: "admin",
        password: "admin"
      };
      const objFalse = {};
      const user = new Users(objReal);
      user.save((err, user) => {
        chai
          .request(server)
          .post("/users/authenticate")
          .send(objFalse)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have
              .property("message")
              .eql("Please insert the necassary fields");
            done();
          });
      });
    });
  });

  /*
   * Test the logout
   */
  describe("/POST create user", () => {
    it("it should logout the user", done => {
    chai
      .request(server)
      .post("/users/logout")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});
