const open = require("open");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gateway-sim";
const PORT = process.env.PORT || 3004;
const app = require("./server");
const mongoose = require("mongoose");

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongodb");

    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
      open(`http://localhost:${PORT}`);
    });
  });

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost";
const MQTT = require("./mqtt");
MQTT.connect(MQTT_BROKER_URL);
