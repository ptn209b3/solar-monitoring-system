const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganLogger = require("morgan");
app.use(morganLogger("dev"));

app.use("/api/gateway", require("./api/gateway.route"));
app.use("/api/device", require("./api/device.route"));
app.use("/api/channel", require("./api/channel.route"));

app.get("/check", (req, res) => res.send("ok"));

app.use(express.static("build"));
app.use("/*", express.static("build"));

module.exports = app;
