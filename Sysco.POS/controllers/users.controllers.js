const user = require("../models/users");
const bcrypt = require("bcrypt");

// Authenticate a user with username and password
exports.authenticate = (req, res, next) => {
  if (req.body.username && req.body.password) {
    user
      .findOne({ username: req.body.username })
      .then(async user => {
        if (!user) {
          return res.status(404).send({
            message: "user not found with username " + req.body.username
          });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
          req.session.regenerate(function(err) {
            req.session.user = user;
            req.user = user;
            res.status(200).send({username:req.body.username});
          });
        } else {
          res.status(401).send({
            message: "username and password doesn't match"
          });
        }
      })
      .catch(err => {
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "Please insert the necassary fields"
    });
  }
};

// Create a new user
exports.createUser = (req, res, next) => {
  if (req.body.username && req.body.password) {
    const newUser = new user(req.body);
    newUser
      .save()
      .then(data => {
        return res.status(200).send({
          message: "user created sucessfully",
          _id:data._id

        });
      })
      .catch(err => {
        return next(err);
      });
  } else {
    return res.status(400).send({
      message: "Please insert the necassary fields"
    });
  }
};

// Create a new user
exports.logout = (req, res, next) => {
  //invalidate the session
  req.session.destroy(err => {
    if (!err) {
      return res.status(200).send({
        message: "user session successfully deleted"
      });
    } else {
      next(err);
    }
  });
};
