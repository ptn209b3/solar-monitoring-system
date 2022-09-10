const express = require("express");
const router = express.Router();

const TelemetryController = require("./telemetry.controller");

router.post("/set-apikey", TelemetryController.setApikey);
router.get("/start", TelemetryController.start);
router.get("/stop", TelemetryController.stop);

router.get("/status", TelemetryController.checkStatus);

router.post("/upload", TelemetryController.upload);

module.exports = router;
