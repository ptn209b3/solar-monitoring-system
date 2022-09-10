const express = require("express");
const router = express.Router();

const Channel = require("../models/channel.model");
const Device = require("../models/device.model");

router.post("/add", async (req, res) => {
  const { gateway, device_id, device_name } = req.body;
  if (!(gateway && device_id && device_name))
    return res.status(400).send("not enough info");

  try {
    const createdDevice = await Device.create({
      gateway,
      device_id,
      device_name,
    });
    return res.send(createdDevice);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
});

router.get("/get", async (req, res) => {
  const { gateway } = req.query;
  try {
    const devices = await Device.find({ gateway });
    return res.send(devices);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("not enough info");

  try {
    const device = await Device.findById(id);
    return res.send(device);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("not enough info");

  try {
    const result = await Device.findByIdAndUpdate(id, req.body);
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
    await Device.findByIdAndDelete(id);
    await Channel.deleteMany({ device: id });
    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
