// const debug = require("debug")("index");
const debug = console.log;

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const redisUrl = "redis://" + REDIS_HOST + ":6379";
const { createClient } = require("redis");
const redisClient = createClient({ url: redisUrl });
redisClient.on("connect", () => console.log("redis client connect"));
redisClient.connect();

const { Server } = require("socket.io");
const socketServer = new Server({ cors: { origin: true } });

const { IoTServer } = require("node-iot-lib");
const ioTServer = new IoTServer(redisClient, socketServer);

const http = require("http");
const app = require("./app");
const httpServer = http.createServer(app);

ioTServer.attach(httpServer);

// const fs = require("fs");
// const options = {
//   key: fs.readFileSync("ssl/client-key.pem"),
//   cert: fs.readFileSync("ssl/client-cert.pem"),
// };
// const httpsServer = require("https").createServer(options, app);

const DB_HOST = process.env.MONGO_HOST || "localhost";
const dbName = process.env.DB_NAME || "monitoring-backend";
const dbUri = "mongodb://" + DB_HOST + ":27017/" + dbName;

async function main() {
  await require("./db").connect(dbUri);

  const PORT = process.env.MONITORING_BACKEND_PORT || 8002;
  httpServer.listen(PORT, () => debug("server is listening on port", PORT));

  // const SECURE_PORT = process.env.SECURE_PORT || 8003;
  // httpsServer.listen(SECURE_PORT, () =>
  //   debug("server is listening on secure port", SECURE_PORT)
  // );
}

main().catch(async (error) => {
  debug(error.message);
  process.exit(1);
});
