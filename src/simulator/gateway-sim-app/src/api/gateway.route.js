const express = require("express");
const router = express.Router();

const GatewayController = require("./gateway.controller");

router.post("/add", GatewayController.add);
router.get("/get", GatewayController.getMany);
router.get("/get/:id", GatewayController.getOne);
router.post("/update/:id", GatewayController.updateOne);
router.get("/delete/:id", GatewayController.deleteOne);

router.get("/provision/:id", GatewayController.provisionOne);
router.get("/start/:id", GatewayController.startOne);
router.get("/stop/:id", GatewayController.stopOne);

module.exports = router;
