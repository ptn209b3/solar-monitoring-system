const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares");
const passport = require("passport");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) return res.send(req.user);
  else return res.sendStatus(401);
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  return res.send(req.user);
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  return res.send("ok");
});

module.exports = router;
