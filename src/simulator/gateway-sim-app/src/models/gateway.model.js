const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GatewaySchema = new Schema({
  apikey: {
    type: String,
    default: "",
  },
  interval: {
    type: Number,
    default: 1000,
  },
  name: {
    type: String,
  },
  provision: {
    type: String,
    default: "never",
  },
});

module.exports = mongoose.model("Gateway", GatewaySchema);
