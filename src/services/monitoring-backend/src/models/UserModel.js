const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(require("passport-local-mongoose"));

module.exports = model("User", UserSchema);
