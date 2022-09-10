const express = require("express");
const app = express();

app.use(require("cors")());
app.use(require("morgan")("dev"));

// app.use("/api/entity", require("./api/entityRoute"));
app.use("/api/entity", require("./proxies/entityProxy"));
// app.use("/api/record", require("./routes/recordRoute"));
app.use("/api/record", require("./proxies/recordProxy"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET || "topsecret",
};

app.use(require("express-session")(sessionConfig));

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/UserModel");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));

app.get("/status", (_, res) => res.sendStatus(200));

// app.use("/*", (req, res) => res.sendStatus(404));

module.exports = app;
