const mongoose = require("mongoose");
const DB_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS) || 10000;

const database = {
  connect: async (dbUri) => {
    await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: DB_TIMEOUT_MS,
    });
    console.log("mongodb database connect");
  },
};

module.exports = database;
