/**
 * Config global varies (see global.js for more information)
 */
require("./global.js");
const redis = require("redis");

// Config debug module
if (process.env.DEV === "true") {
  console.log("Development environment detected, enabling debug module");
  require("debug").enable(
    [
      "app*",
      "inverter:production",
      "inverter:current",
      "meter:production",
      "meter:power",
    ].join(",")
  );
}
const debug = require("debug")("app");
const mongoose = require("mongoose");
const { default: axios } = require("axios");
const express = require("express");
const morgan = require("morgan");

const app = express();
const subscriber = redis.createClient();
const publisher = subscriber.duplicate();
(async function () {
  try {
    // Connect to mongodb and redis
    await mongoose.connect(MONGODB_COLLECTION_URL);
    await subscriber.connect();
    await publisher.connect();
    debug("connected to mongodb and redis");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
    require("./src/routes")(app);

    app.listen(8004, () => {
      console.log("Listening on port 8004");
    });

    app.get("/status", (_, response) => {
      response.send(200);
    });
    //Load inverters
    const { inverters: Inverters } = require("./src/analyzer/");
    debug("loading inverters");
    getInverters().then((data) => {
      debug("inverters loaded");
      Inverters.init(data, { subscriber, publisher });
    });
  } catch (err) {
    console.log(err);
  }
})();

/**
 * @typedef {{id, timeZone}}
 * @returns {(resolve: (Array.<{id: string, currents: Array.<string>, production: string, site: site}>) => void, reject: (error) => any)} inverter
 */
async function getInverters() {
  try {
    const { data: inverters } = await axios.get(
      `${CONTEXT_BROKER_URL}/entity`,
      {
        params: { query: { type: "Inverter" } },
      }
    );
    const { data: sites } = await axios.get(`${CONTEXT_BROKER_URL}/entity`, {
      params: { query: { type: "Site" } },
    });
    return inverters.map((inverter) => {
      /**
       * convert channels properties to an array
       * @const
       * @type {Array.<{type: string, value: string, kind: string}>}
       * @default
       * [{
       *    type: "link",
       *    value: "{id}.{channel name}"
       *    kind: {"PVV,PVC,..."}
       * }]
       */
      const channels = Object.keys(inverter)
        .filter((key) => inverter[key].type === "link")
        .map((channelName) => inverter[channelName]);

      /**
       * filter and map current channel
       * @const
       * @type {Array.<string>}
       * @default
       * ["PV1C","PV2C"]
       */
      const currents = channels
        .filter((channel) => channel.kind === "PVC")
        .map((channel) => channel.value.split(".")[1]);
      const production = channels
        .find((channel) => channel.kind === "E")
        .value.split(".")[1];

      return {
        id: channels[0].value.split(".")[0],
        currents,
        production,
        refSite: inverter.refSite,
        site: sites.find((e) => e.id === inverter.refSite),
      };
    });
  } catch (err) {
    console.log(err);
    return new Promise((resolve, reject) => {
      console.error("Load inverter fail retry after 5s");
      setTimeout(() => {
        getInverters().then(resolve);
      }, 5000);
    });
  }
}
