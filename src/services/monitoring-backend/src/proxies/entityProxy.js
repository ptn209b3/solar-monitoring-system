const { createProxyMiddleware } = require("http-proxy-middleware");

const CONTEXT_BROKER_HOST = process.env.CONTEXT_BROKER_HOST || "localhost";
const CONTEXT_BROKER_PORT = process.env.CONTEXT_BROKER_PORT || 8000;
const CONTEXT_BROKER_URL = process.env.CONTEXT_BROKER_URL;
const cbUrl =
  CONTEXT_BROKER_URL ||
  "http://" + CONTEXT_BROKER_HOST + ":" + CONTEXT_BROKER_PORT;

const entityProxy = createProxyMiddleware({
  target: cbUrl,
  pathRewrite: { "^/api/entity": "/entity" },
});

module.exports = entityProxy;
