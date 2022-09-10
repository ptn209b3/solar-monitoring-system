const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: "Device",
  },
  channel_id: {
    type: String,
  },
  channel_name: {
    type: String,
  },
  configs: {},
});

module.exports = mongoose.model("Channel", ChannelSchema);
