const mongoose = require("mongoose");

const MQTT = require("../mqtt");
const publishTopic = "up/provision";
const Channel = require("../models/channel.model");
const Device = require("../models/device.model");
const Gateway = require("../models/gateway.model");
const { getRandomIntInclusive } = require("../random");

let running = {};

exports.add = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("id not found");

  try {
    const createdGateway = await Gateway.create({ name });
    return res.send(createdGateway);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

exports.getMany = async (req, res) => {
  try {
    const gateways = await Gateway.find({});
    const result = gateways.map((gateway) => {
      return {
        ...gateway.toJSON(),
        running: running[gateway._id] ? true : false,
      };
    });
    return res.send(result);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id is undefined");

  try {
    const gateway = await Gateway.findById(id);
    return res.send(gateway);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id is undefined");

  try {
    const result = await Gateway.findByIdAndUpdate(id, req.body);
    return res.send(result);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

exports.deleteOne = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id is undefined");

  try {
    await Gateway.findByIdAndDelete(id);
    const devices = await Device.find({ gateway: id });
    await Promise.all(
      devices.map(async (device) => {
        await Device.findByIdAndDelete(device._id);
        await Channel.deleteMany({ device: device._id });
      })
    );

    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

exports.provisionOne = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id is undefined");
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send("id isn't an ObjectId");

  try {
    const gateway = await Gateway.findById(id);
    if (!gateway) return res.status(400).send("gateway not found");
    if (!gateway.apikey) return res.status(400).send("apikey not set");

    const devices = await Device.find({ gateway: id });
    const data = await Promise.all(
      devices.map(async (device) => {
        const channels = await Channel.find({ device: device._id });
        const returnChannels = channels.map((channel) => ({
          channel_id: channel.channel_id,
          channel_name: channel.channel_name,
          channel_type: channel.channel_type,
        }));
        const returnDevice = {
          device_id: device.device_id,
          device_name: device.device_name,
          device_kind: device.device_kind,
          device_channels: returnChannels,
        };
        return returnDevice;
      })
    );

    MQTT.publish(publishTopic + "/" + gateway.apikey, { data });
    await Gateway.findByIdAndUpdate(id, { provision: "done" });
    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

exports.startOne = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("id is undefined");

  if (!mongoose.isValidObjectId(id))
    return res.status(400).send("id isn't an ObjectId");

  if (running[id]) return res.status(400).send("already started");

  try {
    const gateway = await Gateway.findById(id);
    if (!gateway) return res.status(400).send("gateway not found");
    if (!gateway.apikey) return res.status(400).send("apikey not set");
    if (gateway.provision !== "done")
      return res.sendStatus(400).send("need to provision first");

    const devices = await Device.find({ gateway: id });
    if (!devices.length) return res.status(400).send("device&channel not set");

    const gatewayObj = (running[id] = {});
    gatewayObj.apikey = gateway.apikey;
    gatewayObj.data = {};
    gatewayObj.state = {};
    gatewayObj.configs = {};

    let results = await Promise.all(
      devices.map(async (device) => {
        const channels = await Channel.find({ device: device._id });
        if (!channels.length) return false;

        const deviceId = device.device_id;

        gatewayObj.data[deviceId] = {};
        gatewayObj.state[deviceId] = {};
        gatewayObj.configs[deviceId] = {};

        channels.forEach((channel) => {
          const channelId = channel.channel_id;
          const configs = channel.configs;

          gatewayObj.configs[deviceId][channelId] = configs;

          if (configs.type === "number") {
            if (configs.kind === "triangle") {
              gatewayObj.state[deviceId][channelId] = {
                edge: "rising",
                value: configs.min,
              };
            } else if (configs.kind === "ramp") {
              gatewayObj.state[deviceId][channelId] = {
                value: configs.start,
              };
            } else if (configs.kind === "random") {
              gatewayObj.state[deviceId][channelId] = {
                value: configs.min,
              };
            }
          }
        });

        return true;
      })
    );

    if (results.every((result) => result === false)) {
      delete running[id];
      return res.status(400).send("device&channel not set");
    }

    // Set up telemetry interval and save its handle
    gatewayObj.handle = setInterval(doit, gateway.interval || 1000, id);

    return res.send("ok");
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

exports.stopOne = async (req, res) => {
  const { id } = req.params;
  if (!id) res.status(400).send("id not found");

  if (!running[id]) return res.status(400).send("already stopped");
  else {
    clearInterval(running[id].handle);
    delete running[id];
    res.send("ok");
  }
};

function doit(id) {
  // contruct telemetry object

  const gatewayConfigs = running[id].configs;
  const gatewayState = running[id].state;
  const gatewayData = running[id].data;

  for (const device_id in gatewayConfigs) {
    const deviceConfigs = gatewayConfigs[device_id];
    const deviceState = gatewayState[device_id];
    const deviceData = gatewayData[device_id];

    for (const channel_id in deviceConfigs) {
      const channelConfigs = deviceConfigs[channel_id];
      const channelState = deviceState[channel_id];

      // output current value (SO TRICKY!!!)
      deviceData[channel_id] = channelState.value;

      // calculate next state
      if (channelConfigs.type === "number") {
        if (channelConfigs.kind === "triangle") {
          if (channelState.edge === "falling") {
            channelState.value = channelState.value - channelConfigs.step;

            if (channelState.value < channelConfigs.min)
              channelState.value = channelConfigs.min;

            if (channelState.value === channelConfigs.min)
              channelState.edge = "rising";
          } else {
            channelState.value = channelState.value + channelConfigs.step;

            if (channelState.value > channelConfigs.max)
              channelState.value = channelConfigs.max;

            if (channelState.value === channelConfigs.max)
              channelState.edge = "falling";
          }
        } else if (channelConfigs.kind === "ramp") {
          channelState.value = channelState.value + channelConfigs.step;
        } else if (channelConfigs.kind === "random") {
          channelState.value = getRandomIntInclusive(
            channelConfigs.min,
            channelConfigs.max
          );
        } else if (channelConfigs.kind === "sine") {
        } else if (channelConfigs.kind === "square") {
        }
      } else if (channelConfigs.type === "string") {
      } else if (channelConfigs.type === "boolean") {
      }
    }
  }
  const topic = "up/telemetry/" + running[id].apikey;
  const telemetryObject = { timestamp: new Date(), data: gatewayData };
  // console.log(telemetryObject);
  MQTT.publish(topic, telemetryObject);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
