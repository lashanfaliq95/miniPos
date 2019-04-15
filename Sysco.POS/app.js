const express = require("express");
const path = require("path");
const favicon = require("static-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const users = require("./routes/users");
const items = require("./routes/items");
const orders = require("./routes/orders");
const config = require("config");

const dbUrl = config.get("dbConfig.url");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//https://stackoverflow.com/questions/49189058/cors-allow-credentials-nodejs-express
var corsOptions = {
 origin: "http://localhost:3001",
  credentials: true
};

//to fix the https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
app.use(cors(corsOptions));

app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


mongoose.Promise = global.Promise;

//"url": "mongodb://lashan:lashan123@ds239936.mlab.com:39936/heroku_l674m94n"

// Connecting to the database
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(
  session({
    name: "test",
    resave: false,
    secret: "lashans_node_backend",
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemove: "disabled"
    }),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true }
  })
);

app.use("/users", users);
app.use("/items", items);
app.use("/orders", orders);

//app.use(express.static(path.join(__dirname, "public")));
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

module.exports = app;
