const formidable = require("formidable");
const XLSX = require("xlsx");
const axios = require("axios");

let intervalHandle;
let entity;
let telObjArr = [];
let round = 0;

class TelemetryController {
  static setApikey(req, res) {
    const { apikey } = req.body;

    if (!apikey) return res.status(400).send("apikey is undefined");
    entity = apikey;
    res.send("ok");
  }

  static start(req, res) {
    // apikey not configured
    if (!entity) return res.status(400).send("apikey not configured");

    const { interval } = req.query;

    try {
      const workbook = XLSX.readFile("./uploads/sheet1.csv");
      // console.log("workbook", workbook);
      const firtSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firtSheetName];
      const cellRange = XLSX.utils.decode_range(worksheet["!ref"]);

      telObjArr = [];
      for (let C = 2; C <= cellRange.e.c; C++) {
        const dataObj = {};
        for (let R = 1; R <= cellRange.e.r; ++R) {
          const device_idAddress = { c: 0, r: R };
          const device_idAddressA1 = XLSX.utils.encode_cell(device_idAddress);
          const device_idCell = worksheet[device_idAddressA1];
          const device_idValue = device_idCell.w;
          if (!dataObj[device_idValue]) dataObj[device_idValue] = {};

          const sampleAddress = { c: C, r: R };
          const sampleAddressA1 = XLSX.utils.encode_cell(sampleAddress);
          const sampleCell = worksheet[sampleAddressA1];
          const sampleValue = sampleCell.v;

          const channel_idAddress = { c: 1, r: R };
          const channel_idAddressA1 = XLSX.utils.encode_cell(channel_idAddress);
          const channel_idCell = worksheet[channel_idAddressA1];
          const channel_idValue = channel_idCell.w;
          if (!dataObj[device_idValue][channel_idValue])
            dataObj[device_idValue][channel_idValue] = sampleValue;
        }

        telObjArr.push(dataObj);
      }

      // 2 to cellRange.e.c = 6
      if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = undefined;
      }
      intervalHandle = setInterval(doit, parseInt(interval, 10) * 1000 || 1000);

      return res.sendStatus(200);
    } catch (error) {
      console.log(error.message);
      return res.sendStatus(500);
    }
  }

  static stop(req, res) {
    if (intervalHandle) {
      clearInterval(intervalHandle);
      intervalHandle = undefined;
      return res.sendStatus(200);
    }
    return res.send("not started");
  }

  static checkStatus(req, res) {
    let result = {};
    result.apikey = entity ? "set" : "not set";
    result.status = intervalHandle ? "running" : "not running";
    res.send(result);
  }

  static async upload(req, res) {
    const form = formidable({ multiples: true, uploadDir: "uploads" });

    form.parse(req, (err, fields, files) => {
      if (err) return console.log(err);

      console.log("fields", fields);
      console.log("files", files);
      return res.send("ok");
    });
  }
}

module.exports = TelemetryController;

function doit() {
  const dataObj = telObjArr[round];

  const telemetryObj = {
    entity: entity,
    timestamp: new Date(),
    data: dataObj,
  };

  console.log(telemetryObj);

  // axios
  //   .post("localhost:3002/telemetry", telemetryObj)
  //   .then((res) => console.log(res.data))
  //   .catch((err) => console.log(err.message));

  ++round;
  if (round === telObjArr.length) round = 0;
}
