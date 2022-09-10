const mongoose = require("mongoose");
const analyzedData = new mongoose.Schema({
  timestamp: Date,
  metadata: {
    entityId: mongoose.ObjectId,
    timestamp: Date,
    field: String,
  },
  value: Number,
});
analyzedData.index({
  "metadata.timestamp": 1,
  "metedata.entityId": 1,
  "metadata.field": 1,
});
module.exports = mongoose.model("analysis", analyzedData);
