const express = require("express");
const router = express.Router();

const Channel = require("../models/channel.model");

router.post("/add", async (req, res) => {
  const { device, channel_id, channel_name, configs } = req.body;
  if (!(device && channel_id && channel_name && configs))
    return res.status(400).send("not enough info");

  try {
    const createdChannel = await Channel.create({
      device,
      channel_id,
      channel_name,
      configs,
    });
    return res.send(createdChannel);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.get("/get", async (req, res) => {
  const { device } = req.query;
  try {
    const channels = await Channel.find({ device });
    return res.send(channels);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("not enough info");

  try {
    const channel = await Channel.findById(id);
    return res.send(channel);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("not enough info");

  try {
    const result = await Channel.findByIdAndUpdate(id, req.body);
    return res.send(result);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id not found");

  try {
    await Channel.findByIdAndDelete(id);
    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
