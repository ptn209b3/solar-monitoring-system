const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  gateway: {
    type: Schema.Types.ObjectId,
    ref: "Gateway",
  },
  device_id: {
    type: String,
  },
  device_name: {
    type: String,
  },
});

module.exports = mongoose.model("Device", DeviceSchema);
