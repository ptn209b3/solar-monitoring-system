const { createProxyMiddleware } = require("http-proxy-middleware");

const RECORD_ENGINE_HOST = process.env.RECORD_ENGINE_HOST || "localhost";
const RECORD_ENGINE_PORT = process.env.RECORD_ENGINE_PORT || 8001;
const RECORD_ENGINE_URL = process.env.RECORD_ENGINE_URL;
const reUrl =
  RECORD_ENGINE_URL ||
  "http://" + RECORD_ENGINE_HOST + ":" + RECORD_ENGINE_PORT;

const recordProxy = createProxyMiddleware({
  target: reUrl,
  pathRewrite: { "^/api/record": "/record" },
});

module.exports = recordProxy;
