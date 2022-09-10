const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");

router.post("/", async (req, res) => {
  const { username, password, email, role } = req.body;
  const user = new User({ username, email, role });

  try {
    await User.register(user, password);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  const result = await User.find();
  let data = result.map((user) => {
    let { _id, ...userData } = user.toObject();
    return { id: _id, ...userData };
  });
  console.log(data);
  res.send(data);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await User.findById(userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await User.findByIdAndDelete(userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User({ username, email, role: "user" });

  try {
    await User.register(user, password);
    return res.send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// comment out this code in production!
router.post("/registerAdmin", async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User({ email, username, role: "admin" });

  try {
    await User.register(user, password);
    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
});

module.exports = router;
